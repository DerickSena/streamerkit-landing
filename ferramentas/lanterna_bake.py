"""Gera o vídeo da demo de lanterna: metade de cima = lanterna desligada, metade de baixo = ligada.

A luz do flash é simulada com um recorte (matte) do motoqueiro quadro a quadro:
quem está perto da câmera recebe muita luz fria, o asfalto perto recebe um pouco,
o fundo quase nada, e a exposição geral cai (a câmera compensa), como num flash real.

Uso:
  python lanterna_bake.py teste <frame.png> <saida.jpg>
  python lanterna_bake.py video <entrada.mp4> <inicio_s> <duracao_s> <pasta_saida_frames>
"""
import os
import sys

os.environ.setdefault("U2NET_HOME", r"H:\Projetos\demos\_ferramentas\rembg\models\u2net")

import cv2
import numpy as np
from rembg import new_session, remove

W, H = 960, 540
_sessao = None


def matte_de(frame_bgr: np.ndarray) -> np.ndarray:
    """Recorte do primeiro plano (0..1), calculado em tamanho reduzido."""
    global _sessao
    if _sessao is None:
        _sessao = new_session("u2net")
    pequeno = cv2.resize(frame_bgr, (640, 360), interpolation=cv2.INTER_AREA)
    m = remove(cv2.cvtColor(pequeno, cv2.COLOR_BGR2RGB), session=_sessao, only_mask=True)
    m = np.asarray(m, dtype=np.float32) / 255.0
    return cv2.resize(m, (W, H), interpolation=cv2.INTER_LINEAR)


def relight(frame_bgr: np.ndarray, matte: np.ndarray) -> np.ndarray:
    f = frame_bgr.astype(np.float32) / 255.0
    lin = np.power(f, 2.2)

    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    ny, nx = yy / H, xx / W

    # Recorte suavizado e levemente encolhido (evita halo na borda).
    m = cv2.GaussianBlur(matte, (0, 0), 2.2)
    m = np.clip((m - 0.30) / 0.62, 0, 1)

    # Cone do flash: mais forte no centro do quadro, cai para as bordas.
    r2 = ((nx - 0.5) / 0.62) ** 2 + ((ny - 0.5) / 0.75) ** 2
    cone = np.clip(1.0 - 0.42 * r2, 0.25, 1.0)

    # Asfalto perto da câmera (parte de baixo) recebe luz; cai com a distância.
    chao = np.clip((ny - 0.50) / 0.50, 0, 1) ** 1.6 * 0.42
    fundo = 0.055
    luz = (m * 1.0 + (1 - m) * (chao + fundo)) * cone

    # Refletância aproximada: tira o tom quente do poste (balanço de branco) e
    # dá um piso para o couro preto ainda refletir alguma coisa.
    cinza = lin @ np.array([0.0722, 0.7152, 0.2126], dtype=np.float32)
    wb = lin * np.array([1.55, 1.08, 0.80], dtype=np.float32)  # BGR: esfria
    refl = 0.55 * wb + 0.45 * cinza[..., None]
    refl = np.power(np.clip(refl, 0, 4), 0.72) * 1.10 + 0.008

    flash = np.array([1.10, 1.02, 0.97], dtype=np.float32)  # BGR, branco frio
    somado = refl * flash * luz[..., None] * 1.95

    # Brilho especular: realça o que já brilha no capacete, no couro e no metal.
    spec = np.power(np.clip(cinza, 0, 1), 1.35) * m * cone * 2.6
    somado += spec[..., None] * flash

    # A câmera compensa a exposição: o ambiente escurece um pouco.
    ambiente = lin * 0.62
    out = ambiente + somado

    # Curva com ombro suave (não estoura de uma vez) e volta para sRGB.
    out = out / (1.0 + 0.55 * out) * 1.50
    out = np.power(np.clip(out, 0, 1), 1 / 2.2)
    # contraste extra só onde o flash bate (tira o aspecto lavado)
    k = np.clip(luz, 0, 1)[..., None]
    curva = out * out * (3.0 - 2.0 * out)
    out = out * (1 - 0.55 * k) + curva * (0.55 * k)

    # Leve halo nas altas luzes do motoqueiro (lente de celular).
    altas = np.clip(out.max(axis=2) - 0.80, 0, 1) * m
    halo = cv2.GaussianBlur(altas, (0, 0), 14)
    out = np.clip(out + halo[..., None] * 0.55, 0, 1)
    return (out * 255.0 + 0.5).astype(np.uint8)


def modo_teste(entrada: str, saida: str) -> None:
    fr = cv2.resize(cv2.imread(entrada), (W, H), interpolation=cv2.INTER_AREA)
    m = matte_de(fr)
    lit = relight(fr, m)
    mm = cv2.cvtColor((m * 255).astype(np.uint8), cv2.COLOR_GRAY2BGR)
    cv2.imwrite(saida, np.hstack([fr, lit, mm]), [cv2.IMWRITE_JPEG_QUALITY, 88])


def modo_video(entrada: str, inicio: float, dur: float, pasta: str) -> None:
    os.makedirs(pasta, exist_ok=True)
    cap = cv2.VideoCapture(entrada)
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    cap.set(cv2.CAP_PROP_POS_MSEC, inicio * 1000)
    total = int(round(dur * fps))
    anterior = None
    for i in range(total):
        ok, fr = cap.read()
        if not ok:
            break
        fr = cv2.resize(fr, (W, H), interpolation=cv2.INTER_AREA)
        m = matte_de(fr)
        # Suaviza o recorte no tempo para não piscar.
        if anterior is not None:
            m = 0.6 * m + 0.4 * anterior
        anterior = m
        lit = relight(fr, m)
        cv2.imwrite(os.path.join(pasta, f"f_{i:04d}.png"), np.vstack([fr, lit]))
        if i % 30 == 0:
            print(f"{i}/{total}", flush=True)
    print(f"fps={fps:.3f} frames={i + 1}")


if __name__ == "__main__":
    if sys.argv[1] == "teste":
        modo_teste(sys.argv[2], sys.argv[3])
    else:
        modo_video(sys.argv[2], float(sys.argv[3]), float(sys.argv[4]), sys.argv[5])
