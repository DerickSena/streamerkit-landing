# Corta os clipes com a legenda ORIGINAL e faz o upscale por IA (Real-ESRGAN x4plus, local).
# uso: python upscale.py corte   -> gera os cortes em resolução nativa (rápido)
#      python upscale.py ia      -> upscale por IA quadro a quadro (lento), troca os arquivos no fim
import glob, os, shutil, subprocess, sys, time

SRC = "H:/Conteudo/cortes/"
SITE = "H:/Projetos/streamerkit-landing/public/media/"
PREV = "H:/Projetos/streamerkit-landing/_aprovacao/"
TMP = PREV + "_tmp-upscale/"  # no H: (o C: está quase cheio)
ESR = "H:/Conteudo/ferramentas/realesrgan/"
os.makedirs(TMP, exist_ok=True)

CLIPS = {
    # Clipe da estrada SEM a legenda original (ela fica na faixa de baixo, cortada fora):
    # a página desenha a legenda por cima, no idioma que o visitante escolher.
    "traducao-rv": {
        "src": SRC + "snapinsta-1795141074413.mp4",
        "segs": [(8.40, 25.90)],
        "crop": "crop=720:450:0:135",
        "out": (1728, 1080),
        "small": (1152, 720),
    },
}


def run(cmd, **kw):
    r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace", **kw)
    if r.returncode != 0:
        print("ERRO:", " ".join(cmd)[:300], "\n", r.stderr[-1200:], flush=True)
        raise SystemExit(1)
    return r


def cut(name, c):
    n = len(c["segs"])
    parts = []
    for i, (a, b) in enumerate(c["segs"]):
        parts.append(f"[0:v]trim={a}:{b},setpts=PTS-STARTPTS[v{i}];[0:a]atrim={a}:{b},asetpts=PTS-STARTPTS,"
                     f"afade=t=in:d=0.05,afade=t=out:st={b-a-0.06:.2f}:d=0.06[a{i}]")
    cat = "".join(f"[v{i}][a{i}]" for i in range(n)) + f"concat=n={n}:v=1:a=1[vc][ac]"
    post = "[vc]" + (c["crop"] + "," if c["crop"] else "") + "fps=30,format=yuv420p[vo];[ac]loudnorm=I=-16:TP=-1.5:LRA=11[ao]"
    mid = TMP + name + "_cut.mkv"
    run(["ffmpeg", "-v", "error", "-y", "-i", c["src"], "-filter_complex", ";".join(parts) + ";" + cat + ";" + post,
         "-map", "[vo]", "-map", "[ao]", "-c:v", "libx264", "-preset", "medium", "-crf", "10", "-c:a", "aac", "-b:a", "160k", "-ar", "44100", mid])
    w, h = c["small"]
    run(["ffmpeg", "-v", "error", "-y", "-i", mid, "-vf",
         f"deblock=filter=strong:block=8:alpha=0.12:beta=0.07,hqdn3d=1.5:1.5:5:5,scale={w}:{h}:flags=lanczos,cas=0.45,format=yuv420p",
         "-c:v", "libx264", "-preset", "slow", "-crf", "21", "-movflags", "+faststart", "-c:a", "aac", "-b:a", "112k", SITE + name + ".mp4"])
    run(["ffmpeg", "-v", "error", "-y", "-ss", "2.5", "-i", SITE + name + ".mp4", "-frames:v", "1", "-c:v", "libwebp", "-quality", "80", SITE + name + ".webp"])
    print(name, "corte ok", flush=True)


def ia(name, c):
    mid = TMP + name + "_cut.mkv"
    fin, fx4, fout = TMP + name + "_in/", TMP + name + "_x4/", TMP + name + "_out/"
    for d in (fin, fx4, fout):
        os.makedirs(d, exist_ok=True)
    # retomada: devolve o lote que ficou pela metade e limpa o que não terminou
    for p_ in glob.glob(TMP + name + "_b/*.png"):
        shutil.move(p_, fin + os.path.basename(p_))
    for p_ in glob.glob(fx4 + "*.png"):
        os.remove(p_)
    if not glob.glob(fin + "*.png") and not glob.glob(fout + "*.png"):
        run(["ffmpeg", "-v", "error", "-y", "-i", mid, fin + "%05d.png"])
    frames = sorted(os.path.basename(p) for p in glob.glob(fin + "*.png"))
    total = len(frames) + len(glob.glob(fout + "*.png"))
    w, h = c["out"]
    t0 = time.time(); done = 0
    B = 24
    for i in range(0, len(frames), B):
        batch = frames[i:i + B]
        bdir = TMP + name + "_b/"
        shutil.rmtree(bdir, ignore_errors=True); os.makedirs(bdir)
        for f in batch:
            shutil.move(fin + f, bdir + f)
        run([ESR + "realesrgan-ncnn-vulkan.exe", "-i", bdir, "-o", fx4, "-n", "realesrgan-x4plus", "-s", "4", "-f", "png"], cwd=ESR)
        for f in batch:
            # 70% IA + 30% original ampliado: segura a textura da pele e evita cara de cera
            run(["ffmpeg", "-v", "error", "-y", "-i", fx4 + f, "-i", bdir + f, "-filter_complex",
                 f"[0]scale={w}:{h}:flags=lanczos[a];[1]scale={w}:{h}:flags=lanczos[b];[a][b]blend=all_mode=normal:all_opacity=0.7",
                 fout + f])
            os.remove(fx4 + f)
        shutil.rmtree(bdir, ignore_errors=True)
        done += len(batch)
        el = time.time() - t0
        print(f"{name}: {done}/{len(frames)} quadros, {el/done:.1f}s por quadro, faltam {el/done*(len(frames)-done)/60:.0f} min", flush=True)
    final = TMP + name + "_1080.mp4"
    run(["ffmpeg", "-v", "error", "-y", "-framerate", "30", "-i", fout + "%05d.png", "-i", mid, "-map", "0:v", "-map", "1:a",
         "-vf", "format=yuv420p", "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-profile:v", "high", "-movflags", "+faststart",
         "-c:a", "aac", "-b:a", "128k", "-shortest", final])
    os.makedirs(PREV, exist_ok=True)
    shutil.copyfile(SITE + name + ".mp4", PREV + name + "-antes.mp4")
    shutil.copyfile(final, SITE + name + ".mp4")
    shutil.copyfile(final, PREV + name + "-depois-upscale.mp4")
    run(["ffmpeg", "-v", "error", "-y", "-ss", "2.5", "-i", final, "-frames:v", "1", "-c:v", "libwebp", "-quality", "82", SITE + name + ".webp"])
    print(name, "UPSCALE PRONTO", total, "quadros", flush=True)


mode = sys.argv[1]
names = sys.argv[2:] or list(CLIPS)
for nm in names:
    (cut if mode == "corte" else ia)(nm, CLIPS[nm])
