import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'motion/react'

type Props = {
  /** vídeo empilhado: metade de cima sem lanterna, metade de baixo com lanterna */
  src: string
  poster: string
  on: boolean
  playing?: boolean
  /** 1 = limpo; menor = quadriculado (bitrate baixo) */
  quality?: number
  className?: string
}

/**
 * Lanterna de verdade: o mesmo vídeo existe em duas versões no mesmo arquivo
 * (sem flash em cima, com flash embaixo), então as duas ficam sempre no mesmo
 * quadro. O canvas mistura uma na outra e a "câmera" reage à mudança de luz
 * (estoura um instante ao ligar, escurece um instante ao desligar).
 */
export function TorchCanvas({ src, poster, on, playing = true, quality = 1, className = '' }: Props) {
  const wrap = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const inView = useInView(wrap, { margin: '240px 0px' })
  const reduce = useReducedMotion()
  const [armed, setArmed] = useState(false)
  const [ready, setReady] = useState(false)
  const target = useRef(on ? 1 : 0)
  const level = useRef(on ? 1 : 0)
  const first = useRef(true)
  const q = useRef(quality)
  q.current = quality

  useEffect(() => {
    if (inView) setArmed(true)
  }, [inView])

  useEffect(() => {
    const v = video.current
    if (!v || !armed) return
    if (inView && playing && !reduce) v.play().catch(() => {})
    else v.pause()
  }, [armed, inView, playing, reduce])

  // A câmera compensando a exposição quando a luz muda.
  useEffect(() => {
    target.current = on ? 1 : 0
    if (first.current) {
      first.current = false
      return
    }
    const c = canvas.current
    if (!c || reduce || typeof c.animate !== 'function') return
    c.animate(
      on
        ? [
            { filter: 'brightness(1.65) contrast(0.9) saturate(0.85)' },
            { filter: 'brightness(1.12) contrast(1)', offset: 0.35 },
            { filter: 'brightness(1) contrast(1) saturate(1)' },
          ]
        : [
            { filter: 'brightness(0.55) contrast(1.05)' },
            { filter: 'brightness(0.9)', offset: 0.5 },
            { filter: 'brightness(1)' },
          ],
      { duration: on ? 620 : 760, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
    )
  }, [on, reduce])

  useEffect(() => {
    if (!armed || !inView) return
    let raf = 0
    let lastT = -1
    let lastQ = -1
    const draw = () => {
      raf = requestAnimationFrame(draw)
      const v = video.current
      const c = canvas.current
      if (!v || !c || v.readyState < 2 || !v.videoWidth) return
      // Nada mudou (vídeo parado, luz estável, mesma qualidade): não redesenha.
      const settled = Math.abs(target.current - level.current) < 0.004
      if (v.currentTime === lastT && settled && q.current === lastQ) return
      lastT = v.currentTime
      lastQ = q.current
      const sw = v.videoWidth
      const sh = v.videoHeight / 2
      // bitrate baixo: desenha pequeno e o CSS amplia com pixels duros
      const w = q.current < 0.97 ? Math.round(26 + q.current * q.current * 250) : sw
      const h = Math.round((w * sh) / sw)
      if (c.width !== w || c.height !== h) {
        c.width = w
        c.height = h
      }
      const ctx = c.getContext('2d')
      if (!ctx) return
      level.current += (target.current - level.current) * 0.3
      const l = level.current
      ctx.globalAlpha = 1
      ctx.drawImage(v, 0, 0, sw, sh, 0, 0, w, h)
      if (l > 0.004) {
        ctx.globalAlpha = Math.min(1, l)
        ctx.drawImage(v, 0, sh, sw, sh, 0, 0, w, h)
      }
      if (!ready) setReady(true)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [armed, inView, ready])

  return (
    <div ref={wrap} className={`overflow-hidden bg-black ${className || "relative"}`}>
      <img
        src={poster}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ filter: on && !ready ? 'brightness(1.5)' : undefined }}
      />
      {/* O vídeo fica fora da vista: quem aparece é o canvas. */}
      <video
        ref={video}
        src={armed ? src : undefined}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
        disablePictureInPicture
        className="pointer-events-none absolute left-0 top-0 h-px w-px opacity-0"
      />
      <canvas
        ref={canvas}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
        style={{ opacity: ready ? 1 : 0, imageRendering: quality < 0.97 ? 'pixelated' : 'auto' }}
      />
    </div>
  )
}
