# Tira o letreiro escuro dos ombros (patrocinador) da camisa branca do clipe da tradução ao vivo.
# Roda DEPOIS do tira_logo_camisa.py (entrada: quadros já sem o letreiro vermelho).
# Referência: o escudo amarelo do peito. O letreiro dos ombros fica sempre um pouco acima dele;
# o outro logo escuro do peito fica abaixo e não é tocado.
# uso: python tira_texto_ombro.py teste 60 250 500   |   python tira_texto_ombro.py tudo
import glob, os, sys
import cv2
import numpy as np

BASE = "H:/Projetos/streamerkit-landing/_aprovacao/_tmp-upscale/"
SRC = BASE + "traducao-rv_semlogo/"
DST = BASE + "traducao-rv_semlogo2/"
DBG = BASE + "teste_logo/"


def EL(n):
    return cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (n, n))


def hsv3(img):
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    return hsv[..., 0].astype(np.int32), hsv[..., 1].astype(np.int32), hsv[..., 2].astype(np.int32)


def shirt_mask(S, V):
    m = ((S < 60) & (V > 135)).astype(np.uint8)
    return cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))


def crest(img):
    """Centro do escudo amarelo do peito, ou None se a mão estiver na frente."""
    h, w = img.shape[:2]
    H, S, V = hsv3(img)
    yg = ((H >= 24) & (H <= 48) & (S >= 90) & (V >= 110)).astype(np.uint8)
    yg = cv2.morphologyEx(yg, cv2.MORPH_CLOSE, EL(15))
    n, lab, st, cen = cv2.connectedComponentsWithStats(yg, 8)
    best = None
    for i in range(1, n):
        a, bw, bh = st[i, 4], st[i, 2], st[i, 3]
        if not (1500 <= a <= 5200 and 40 <= bw <= 95 and 50 <= bh <= 115 and bh >= bw * 0.9):
            continue
        if cen[i][1] < h * 0.45 or not (w * 0.35 < cen[i][0] < w * 0.85):
            continue
        if best is None or a > best[2]:
            best = (float(cen[i][0]), float(cen[i][1]), a)
    return best[:2] if best else None


def track_crest(files):
    """Posição do escudo em todos os quadros: descarta achados falsos e interpola quando a mão cobre."""
    pts = [crest(cv2.imread(p)) for p in files]
    n = len(pts)
    # o escudo fica sempre na mesma região do quadro: o que aparece muito fora dela é outra mancha amarela
    allp = [q for q in pts if q]
    gx, gy = np.median([q[0] for q in allp]), np.median([q[1] for q in allp])
    pts = [q if (q and abs(q[0] - gx) <= 200 and abs(q[1] - gy) <= 130) else None for q in pts]
    # achado falso isolado: fica longe da mediana dos vizinhos
    good = {}
    for i, p in enumerate(pts):
        if not p:
            continue
        nb = [q for q in pts[max(0, i - 25):i + 26] if q]
        mx, my = np.median([q[0] for q in nb]), np.median([q[1] for q in nb])
        if abs(p[0] - mx) <= 110 and abs(p[1] - my) <= 110:
            good[i] = p
    ks = sorted(good)
    xs = np.interp(np.arange(n), ks, [good[k][0] for k in ks])
    ys = np.interp(np.arange(n), ks, [good[k][1] for k in ks])
    sm = []
    for i in range(n):
        a, b = max(0, i - 2), min(n, i + 3)
        sm.append((float(np.median(xs[a:b])), float(np.median(ys[a:b]))))
    return sm, len(ks)


def detect(img, c):
    """Devolve (letras do letreiro, escuro fraco, tecido, área permitida)."""
    h, w = img.shape[:2]
    H, S, V = hsv3(img)
    shirt = shirt_mask(S, V)
    v = shirt.astype(np.float32)
    lv = cv2.GaussianBlur(V.astype(np.float32) * v, (0, 0), 18) / np.maximum(cv2.GaussianBlur(v, (0, 0), 18), 1e-3)
    rel = lv - V  # quanto o ponto é mais escuro que o tecido em volta
    cx, cy = c
    win = np.zeros((h, w), np.uint8)
    win[max(0, int(cy - 220)):max(0, int(cy + 40)), max(0, int(cx - 460)):min(w, int(cx + 170))] = 1
    # só dentro do contorno da camisa, para o remendo não vazar para o fundo escuro atrás do ombro
    win &= cv2.morphologyEx(shirt, cv2.MORPH_CLOSE, EL(61))
    strong = ((rel > 55) & (S < 130)).astype(np.uint8)
    n, lab, st, cen = cv2.connectedComponentsWithStats(strong & cv2.dilate(win, EL(61)), 8)

    # o outro logo do peito, o do braço e o relógio são desenhos GRANDES: marca a vizinhança deles como proibida
    big = np.zeros((h, w), np.uint8)
    small = []
    for i in range(1, n):
        a, bw, bh = st[i, 4], st[i, 2], st[i, 3]
        if a < 18:
            continue
        comp = (lab == i).astype(np.uint8)
        yc = cen[i][1]
        wide = bw > 40 or bh > 34
        hollow = a / float(bw * bh) < 0.22  # desenho só de contorno (o outro logo do peito)
        if a > 1400 or (wide and (hollow or yc > cy - 5)):
            # desenho grande da camisa: só conta se estiver cercado de tecido (o fundo escuro atrás dele não conta)
            if a <= 9000:
                ring = cv2.dilate(comp, EL(25)) & (1 - comp)
                if ring.sum() and (shirt & ring).sum() / ring.sum() >= 0.45:
                    big |= comp
        elif yc < cy + 5:
            small.append(comp)  # letra solta ou letras borradas juntas, acima da altura do escudo
    forbid = cv2.dilate(big, EL(71))
    win &= (1 - forbid)

    # letras soltas e pequenas em cima do tecido
    letters = np.zeros((h, w), np.uint8)
    for comp in small:
        if (comp & win).sum() < comp.sum() * 0.6:
            continue
        ring = cv2.dilate(comp, EL(25)) & (1 - comp)
        if ring.sum() == 0 or (shirt & ring).sum() / ring.sum() < 0.5:
            continue  # cercado de pele ou de fundo: não é letra em cima do tecido
        letters |= comp
    # o letreiro tem várias letras juntas: descarta pontinho isolado
    keep = np.zeros((h, w), np.uint8)
    n2, lab2, st2, _ = cv2.connectedComponentsWithStats(cv2.dilate(letters, EL(45)), 8)
    for i in range(1, n2):
        grp = ((lab2 == i).astype(np.uint8)) & letters
        k = cv2.connectedComponents(grp, connectivity=8)[0] - 1
        if k >= 2 or grp.sum() >= 150:
            keep |= grp
    weak = ((rel > 24) & (S < 150)).astype(np.uint8) & win
    return keep, weak, shirt, win


def clean(img, c, region=None, seed=0):
    h, w = img.shape[:2]
    keep, weak, shirt, win = detect(img, c)
    extra = np.zeros_like(keep)
    if region is not None:
        x0, y0, x1, y1 = region
        box = np.zeros((h, w), np.uint8)
        box[max(0, y0):min(h, y1), max(0, x0):min(w, x1)] = 1
        n, lab, st, _ = cv2.connectedComponentsWithStats(weak & box, 8)
        for i in range(1, n):
            a = st[i, 4]
            if not (12 <= a <= 1400):
                continue
            comp = (lab == i).astype(np.uint8)
            ring = cv2.dilate(comp, EL(25)) & (1 - comp)
            if ring.sum() and (shirt & ring).sum() / ring.sum() >= 0.55:
                extra |= comp
    if keep.sum() + extra.sum() < 40:
        return img, np.zeros((h, w), np.uint8)
    mask = keep | extra | (weak & cv2.dilate(keep, EL(31)))
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, EL(11))
    mask = cv2.dilate(mask, EL(11)) & win

    valid = (shirt & (1 - mask)).astype(np.float32)
    f = img.astype(np.float32)
    num = cv2.GaussianBlur(f * valid[..., None], (0, 0), 14)
    den = cv2.GaussianBlur(valid, (0, 0), 14)[..., None]
    fill = num / np.maximum(den, 1e-3)
    far = den[..., 0] < 0.02
    if far[mask > 0].any():
        fill[far] = f[valid > 0].mean(axis=0) if valid.sum() > 500 else np.array([225, 225, 225], np.float32)
    rng = np.random.default_rng(seed)
    fill += rng.normal(0, 1.6, fill.shape[:2])[..., None].astype(np.float32)
    soft = (cv2.GaussianBlur(mask.astype(np.float32), (0, 0), 3) * cv2.dilate(win, EL(3)))[..., None]
    return np.clip(f * (1 - soft) + fill * soft, 0, 255).astype(np.uint8), mask


def bbox(mask):
    ys, xs = np.where(mask > 0)
    return (int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())) if len(xs) else None


def regions_for(files, cr):
    """Área onde o letreiro deve estar em cada quadro (união dos quadros vizinhos em que ele aparece bem)."""
    boxes = []
    for p, c in zip(files, cr):
        k = detect(cv2.imread(p), c)[0]
        boxes.append(bbox(k) if k.sum() >= 90 else None)
    out = []
    for i in range(len(files)):
        near = [b for b in boxes[max(0, i - 12):i + 13] if b]
        out.append((min(b[0] for b in near) - 45, min(b[1] for b in near) - 35, max(b[2] for b in near) + 45, max(b[3] for b in near) + 35) if near else None)
    return out


if __name__ == "__main__":
    mode = sys.argv[1]
    files = sorted(glob.glob(SRC + "*.png"))
    if mode == "teste":
        # teste rápido: só olha os quadros pedidos e os vizinhos deles
        cr, reg = {}, {}
        for n in sys.argv[2:]:
            i = int(n) - 1
            js = list(range(max(0, i - 12), min(len(files), i + 13)))
            imgs = {j: cv2.imread(files[j]) for j in js}
            cs = {j: crest(imgs[j]) for j in js}
            ok = [j for j in js if cs[j]]
            if not ok:
                print(n, "sem escudo por perto"); continue
            cj = {j: cs[j] or cs[min(ok, key=lambda k: abs(k - j))] for j in js}
            cr[i] = cj[i]
            bs = [b for b in (bbox(detect(imgs[j], cj[j])[0]) for j in js) if b]
            reg[i] = (min(b[0] for b in bs) - 45, min(b[1] for b in bs) - 35, max(b[2] for b in bs) + 45, max(b[3] for b in bs) + 35) if bs else None
    else:
        cr, seen = track_crest(files)
        print("escudo achado em", seen, "de", len(files), "quadros", flush=True)
        reg = regions_for(files, cr)
        print("posicao do letreiro calculada", flush=True)
    if mode == "teste":
        os.makedirs(DBG, exist_ok=True)
        tiles = []
        for n in sys.argv[2:]:
            i = int(n) - 1
            if i not in cr:
                continue
            img = cv2.imread(files[i])
            out, mask = clean(img, cr[i], reg[i], i)
            cx, cy = int(cr[i][0]), int(cr[i][1])
            x0 = max(0, min(img.shape[1] - 760, cx - 520)); y0 = max(0, min(img.shape[0] - 380, cy - 260))
            a = img[y0:y0 + 380, x0:x0 + 760].copy(); b = out[y0:y0 + 380, x0:x0 + 760]
            cv2.circle(a, (cx - x0, cy - y0), 8, (0, 0, 255), 2)
            m = cv2.cvtColor(mask[y0:y0 + 380, x0:x0 + 760] * 255, cv2.COLOR_GRAY2BGR)
            row = np.hstack([a, m, b])
            cv2.putText(row, str(n), (8, 28), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 255), 2)
            tiles.append(row)
            print(n, "pixels na mascara:", int(mask.sum()))
        cv2.imwrite(DBG + "teste_ombro.jpg", np.vstack(tiles), [cv2.IMWRITE_JPEG_QUALITY, 88])
    else:
        os.makedirs(DST, exist_ok=True)
        sem = 0
        for i, p in enumerate(files):
            out, mask = clean(cv2.imread(p), cr[i], reg[i], i)
            sem += int(mask.sum() == 0)
            cv2.imwrite(DST + os.path.basename(p), out)
            if (i + 1) % 105 == 0:
                print(f"{i + 1}/{len(files)}", flush=True)
        print("pronto:", len(files), "quadros;", sem, "sem letreiro visivel", flush=True)
