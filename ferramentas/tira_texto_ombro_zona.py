# Tira o letreiro escuro dos dois ombros apagando a ÁREA inteira dele em todos os quadros.
# 1) acha as letras nos quadros em que elas aparecem bem (detect() do tira_texto_ombro.py);
# 2) guarda a posição da área em relação ao escudo amarelo do peito, um ombro de cada vez;
# 3) completa os quadros em que não achou (borrado, mão na frente) interpolando entre os vizinhos;
# 4) pinta a área com a cor do tecido em volta, sem tocar em pele nem no fundo atrás do ombro.
# uso: python tira_texto_ombro_zona.py tudo   |   python tira_texto_ombro_zona.py folha
import glob, os, sys
import cv2
import numpy as np
import tira_texto_ombro as T

SRC, DST, DBG = T.SRC, T.DST, T.DBG
EL = T.EL
CACHE = T.BASE + "ombro_track.npy"


def side_boxes(keep, cx, cy):
    """Caixa do letreiro em cada ombro (relativa ao escudo), se as letras apareceram bem."""
    out = {}
    h, w = keep.shape
    cut = int(max(0, min(w, cx - 110)))
    right = keep[:, cut:].copy()
    right[int(max(0, cy - 70)):, :] = 0  # logo acima do escudo ficam as estrelinhas dele: não são o letreiro
    for name, part, off in (("L", keep[:, :cut], 0), ("R", right, cut)):
        if part.sum() < 120:
            continue
        n = cv2.connectedComponents(part, connectivity=8)[0] - 1
        if n < 3 and part.sum() < 260:
            continue
        ys, xs = np.where(part > 0)
        x0, x1, y0, y1 = xs.min() + off, xs.max() + off, ys.min(), ys.max()
        if x1 - x0 > 230 or y1 - y0 > 120 or x1 - x0 < 35:
            continue  # grande ou pequeno demais para ser a palavra
        out[name] = (x0 - cx, y0 - cy, x1 - cx, y1 - cy)
    return out


def fill_track(vals, n):
    """vals: {quadro: (4 números)}. Interpola os quadros que faltam e suaviza."""
    if not vals:
        return None
    ks = sorted(vals)
    arr = np.zeros((n, 4), np.float32)
    for d in range(4):
        arr[:, d] = np.interp(np.arange(n), ks, [vals[k][d] for k in ks])
    sm = arr.copy()
    for i in range(n):
        a, b = max(0, i - 3), min(n, i + 4)
        sm[i] = np.median(arr[a:b], axis=0)
    return sm


def build(files):
    cr, seen = T.track_crest(files)
    print("escudo achado em", seen, "de", len(files), "quadros", flush=True)
    found = {"L": {}, "R": {}}
    for i, p in enumerate(files):
        keep = T.detect(cv2.imread(p), cr[i])[0]
        for name, b in side_boxes(keep, cr[i][0], cr[i][1]).items():
            found[name][i] = b
        if (i + 1) % 105 == 0:
            print(f"rastreando {i + 1}/{len(files)}", flush=True)
    print("letreiro visto em: ombro esquerdo", len(found["L"]), "quadros; ombro direito", len(found["R"]), "quadros", flush=True)
    tr = {k: fill_track(found[k], len(files)) for k in ("L", "R")}
    np.save(CACHE, {"cr": cr, "L": tr["L"], "R": tr["R"]}, allow_pickle=True)
    return cr, tr


def paint(img, c, boxes, seed=0):
    h, w = img.shape[:2]
    H, S, V = T.hsv3(img)
    shirt = T.shirt_mask(S, V)
    inside = cv2.morphologyEx(shirt, cv2.MORPH_CLOSE, EL(61))  # contorno da camisa, com as letras dentro
    # pele: alaranjada E clara. Pixel escuro tem cor instável, então letra preta entra pelo brilho, não pela cor
    skin = ((H >= 3) & (H <= 24) & (S >= 45) & (V >= 110)).astype(np.uint8)
    # só pele em bloco grande (mão, braço): a borda amarronzada das letras é fina e tem que ser pintada
    skin = cv2.dilate(cv2.morphologyEx(skin, cv2.MORPH_OPEN, EL(13)), EL(7))
    paintable = inside & (1 - skin)
    zone = np.zeros((h, w), np.uint8)
    cx, cy = c
    for b in boxes:
        if b is None:
            continue
        x0, y0, x1, y1 = int(cx + b[0]) - 18, int(cy + b[1]) - 16, int(cx + b[2]) + 18, int(cy + b[3]) + 16
        zone[max(0, y0):min(h, y1), max(0, x0):min(w, x1)] = 1
    mask = zone & paintable
    if mask.sum() < 60:
        return img, mask
    valid = (shirt & (1 - cv2.dilate(zone, EL(9)))).astype(np.float32)
    f = img.astype(np.float32)
    num = cv2.GaussianBlur(f * valid[..., None], (0, 0), 20)
    den = cv2.GaussianBlur(valid, (0, 0), 20)[..., None]
    fill = num / np.maximum(den, 1e-3)
    far = den[..., 0] < 0.02
    if far[mask > 0].any():
        fill[far] = f[valid > 0].mean(axis=0) if valid.sum() > 500 else np.array([225, 225, 225], np.float32)
    rng = np.random.default_rng(seed)
    fill += rng.normal(0, 1.6, fill.shape[:2])[..., None].astype(np.float32)
    soft = (cv2.GaussianBlur(mask.astype(np.float32), (0, 0), 3.5) * paintable)[..., None]
    return np.clip(f * (1 - soft) + fill * soft, 0, 255).astype(np.uint8), mask


if __name__ == "__main__":
    mode = sys.argv[1]
    files = sorted(glob.glob(SRC + "*.png"))
    if os.path.exists(CACHE) and "--refaz" not in sys.argv:
        d = np.load(CACHE, allow_pickle=True).item()
        cr, tr = d["cr"], {"L": d["L"], "R": d["R"]}
        print("rastreamento carregado do disco", flush=True)
    else:
        cr, tr = build(files)
    os.makedirs(DST, exist_ok=True)
    os.makedirs(DBG, exist_ok=True)
    idx = range(len(files)) if mode == "tudo" else [int(n) - 1 for n in sys.argv[2:] if n.isdigit()]
    tiles = []
    for i in idx:
        img = cv2.imread(files[i])
        boxes = [tr[k][i] if tr[k] is not None else None for k in ("L", "R")]
        out, mask = paint(img, cr[i], boxes, i)
        if mode == "tudo":
            cv2.imwrite(DST + os.path.basename(files[i]), out)
            if (i + 1) % 105 == 0:
                print(f"{i + 1}/{len(files)}", flush=True)
        else:
            cx, cy = int(cr[i][0]), int(cr[i][1])
            x0 = max(0, min(img.shape[1] - 760, cx - 520)); y0 = max(0, min(img.shape[0] - 380, cy - 270))
            a = img[y0:y0 + 380, x0:x0 + 760]; b = out[y0:y0 + 380, x0:x0 + 760]
            row = np.hstack([a, b])
            cv2.putText(row, str(i + 1), (8, 28), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 255), 2)
            tiles.append(row)
    if tiles:
        cv2.imwrite(DBG + "teste_zona.jpg", np.vstack(tiles), [cv2.IMWRITE_JPEG_QUALITY, 88])
    print("pronto", flush=True)
