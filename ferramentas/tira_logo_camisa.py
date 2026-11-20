# Tira o letreiro vermelho (patrocinador) da camisa branca do clipe da tradução ao vivo, quadro a quadro.
# Acha o vermelho que está em cima do tecido branco e preenche com a cor da própria camisa em volta.
# Duas passadas: a primeira acha onde o letreiro está nos quadros em que ele aparece inteiro; a segunda usa
# essa posição para pegar também os pedacinhos que sobram quando a mão ou o braço passam na frente.
# uso: python tira_logo_camisa.py teste 30 150 330      -> salva comparações de alguns quadros
#      python tira_logo_camisa.py tudo                  -> processa os 525 quadros
import glob, os, sys
import cv2
import numpy as np

BASE = "H:/Projetos/streamerkit-landing/_aprovacao/_tmp-upscale/"
SRC = BASE + "traducao-rv_out/"
DST = BASE + "traducao-rv_semlogo/"
DBG = BASE + "teste_logo/"


def EL(n):
    return cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (n, n))


def layers(img):
    h, w = img.shape[:2]
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    H, S, V = hsv[..., 0].astype(np.int32), hsv[..., 1].astype(np.int32), hsv[..., 2].astype(np.int32)
    shirt = ((S < 60) & (V > 135)).astype(np.uint8)  # tecido branco
    shirt = cv2.morphologyEx(shirt, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    loose = ((S < 75) & (V > 85)).astype(np.uint8)  # tecido na sombra do braço também
    loose = cv2.morphologyEx(loose, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    near = cv2.dilate(loose, EL(71))
    roi = np.zeros((h, w), np.uint8)
    roi[int(h * 0.36):, int(w * 0.22):int(w * 0.90)] = 1  # camisa: da metade para baixo, no meio
    red = (H >= 163) | (H <= 3)  # vermelho puxado para o rosa; pele é mais alaranjada
    return H, S, V, shirt, loose, near, roi, red


def seeds(L):
    """Blocos de letra bem visíveis (vermelho forte em cima do tecido)."""
    H, S, V, shirt, loose, near, roi, red = L
    strong = (red & (S >= 135) & (V >= 100)).astype(np.uint8) & roi & near
    n, lab, st, _ = cv2.connectedComponentsWithStats(strong, 8)
    keep = np.zeros_like(strong)
    for i in range(1, n):
        if st[i, cv2.CC_STAT_AREA] >= 120:
            keep[lab == i] = 1
    return keep


def bbox(mask):
    ys, xs = np.where(mask > 0)
    return (int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())) if len(xs) else None


def clean(img, seed=0, region=None):
    h, w = img.shape[:2]
    L = layers(img)
    H, S, V, shirt, loose, near, roi, red = L
    keep = seeds(L)

    if region is not None:
        # dentro da área onde o letreiro costuma estar, aceita pedaços menores e menos fortes
        x0, y0, x1, y1 = region
        box = np.zeros((h, w), np.uint8)
        box[max(0, y0):min(h, y1), max(0, x0):min(w, x1)] = 1
        cand = (red & (S >= 118) & (V >= 95)).astype(np.uint8) & roi & near & box & (1 - keep)
        n, lab, st, _ = cv2.connectedComponentsWithStats(cand, 8)
        for i in range(1, n):
            area = st[i, cv2.CC_STAT_AREA]
            if area < 30:
                continue
            comp = (lab == i).astype(np.uint8)
            if area < 500:
                # pedaço pequeno: só vale se encostar em tecido (dedo avermelhado fica cercado de pele)
                # exceção: vermelho bem vivo (o letreiro aparecendo entre os dedos) entra mesmo cercado de pele
                ring = cv2.dilate(comp, EL(31)) & (1 - comp)
                touches = ring.sum() > 0 and (loose & ring).sum() / ring.sum() >= 0.2
                vivid = float(np.median(S[comp > 0])) >= 150
                if not (touches or vivid):
                    continue
            keep |= comp

    if keep.sum() < 40:
        return img, np.zeros((h, w), np.uint8)

    weak = (((H >= 160) | (H <= 2)) & (S >= 42) & (V >= 100)).astype(np.uint8)
    around = cv2.dilate(keep, EL(91))
    mask = ((weak & around & near) | keep).astype(np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, EL(15))
    mask = cv2.dilate(mask, EL(17))

    # preenche com a média do tecido em volta (só tecido branco conta, para não puxar pele nem logo preto)
    valid = (shirt & (1 - mask)).astype(np.float32)
    f = img.astype(np.float32)
    num = cv2.GaussianBlur(f * valid[..., None], (0, 0), 26)
    den = cv2.GaussianBlur(valid, (0, 0), 26)[..., None]
    fill = num / np.maximum(den, 1e-3)
    far = den[..., 0] < 0.02  # sem tecido por perto (entre os dedos): usa a cor média da camisa no quadro
    if far[mask > 0].any():
        base = f[valid > 0].mean(axis=0) if valid.sum() > 500 else np.array([225, 225, 225], np.float32)
        fill[far] = base

    # grão leve, para o remendo não ficar liso demais
    rng = np.random.default_rng(seed)
    fill += rng.normal(0, 1.6, fill.shape[:2])[..., None].astype(np.float32)

    soft = cv2.GaussianBlur(mask.astype(np.float32), (0, 0), 4)[..., None]
    out = f * (1 - soft) + fill * soft
    return np.clip(out, 0, 255).astype(np.uint8), mask


def track(files):
    """Para cada quadro, a área onde o letreiro deve estar (vinda dos quadros vizinhos em que ele aparece bem)."""
    boxes = []
    for p in files:
        k = seeds(layers(cv2.imread(p)))
        boxes.append(bbox(k) if k.sum() >= 3000 else None)
    regions = []
    for i in range(len(files)):
        near = []
        for span in (10, 25, 60):
            near = [b for b in boxes[max(0, i - span):i + span + 1] if b]
            if near:
                break
        if not near:
            regions.append(None)
            continue
        regions.append((min(b[0] for b in near) - 80, min(b[1] for b in near) - 70, max(b[2] for b in near) + 80, max(b[3] for b in near) + 70))
    return regions


if __name__ == "__main__":
    mode = sys.argv[1]
    files = sorted(glob.glob(SRC + "*.png"))
    regions = track(files)
    print("posicao do letreiro calculada", flush=True)
    if mode == "teste":
        os.makedirs(DBG, exist_ok=True)
        tiles = []
        for n in sys.argv[2:]:
            i = int(n) - 1
            img = cv2.imread(files[i])
            out, mask = clean(img, i, regions[i])
            r = regions[i] or (img.shape[1] // 2 - 300, int(img.shape[0] * 0.5), img.shape[1] // 2 + 300, int(img.shape[0] * 0.8))
            cx, cy = (r[0] + r[2]) // 2, (r[1] + r[3]) // 2
            x0 = max(0, min(img.shape[1] - 620, cx - 310)); y0 = max(0, min(img.shape[0] - 420, cy - 230))
            a = img[y0:y0 + 420, x0:x0 + 620]; b = out[y0:y0 + 420, x0:x0 + 620]
            m = cv2.cvtColor(mask[y0:y0 + 420, x0:x0 + 620] * 255, cv2.COLOR_GRAY2BGR)
            row = np.hstack([a, m, b])
            cv2.putText(row, str(n), (8, 28), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 255), 2)
            tiles.append(row)
            print(n, "pixels na mascara:", int(mask.sum()))
        cv2.imwrite(DBG + "teste.jpg", np.vstack(tiles), [cv2.IMWRITE_JPEG_QUALITY, 88])
    else:
        os.makedirs(DST, exist_ok=True)
        sem = 0
        for i, p in enumerate(files):
            out, mask = clean(cv2.imread(p), i, regions[i])
            if mask.sum() == 0:
                sem += 1
            cv2.imwrite(DST + os.path.basename(p), out)
            if (i + 1) % 75 == 0:
                print(f"{i + 1}/{len(files)}", flush=True)
        print("pronto:", len(files), "quadros;", sem, "sem logo visivel", flush=True)
