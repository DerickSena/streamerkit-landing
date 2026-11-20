import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useInView, useReducedMotion } from 'motion/react'

type Props = {
  src: string
  poster: string
  /** false pausa o vídeo (ex.: envio parado). */
  playing?: boolean
  /** 1 = limpo; quanto menor, mais "quadriculado" (bitrate baixo). */
  quality?: number
  /** congela no último quadro (conexão caiu). */
  frozen?: boolean
  className?: string
  style?: CSSProperties
  objectPosition?: string
  /** carrega a capa com prioridade (só o vídeo do topo). */
  eager?: boolean
  label?: string
}

/**
 * Vídeo em loop, sem som, que só toca quando está na tela.
 * A camada de "bitrate baixo" redesenha o vídeo num canvas minúsculo e amplia
 * com pixels duros: é o mesmo aspecto de uma live com a conexão ruim.
 */
export function LiveVideo({
  src,
  poster,
  playing = true,
  quality = 1,
  frozen = false,
  className = '',
  style,
  objectPosition = '50% 50%',
  eager = false,
  label,
}: Props) {
  const wrap = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const inView = useInView(wrap, { margin: '240px 0px' })
  const reduce = useReducedMotion()
  const [armed, setArmed] = useState(false)
  const q = useRef(quality)
  const fz = useRef(frozen)
  q.current = quality
  fz.current = frozen

  useEffect(() => {
    if (inView) setArmed(true)
  }, [inView])

  useEffect(() => {
    const v = video.current
    if (!v || !armed) return
    if (inView && playing && !frozen && !reduce) v.play().catch(() => {})
    else v.pause()
  }, [armed, inView, playing, frozen, reduce])

  const degraded = quality < 0.97
  useEffect(() => {
    if (!degraded || !inView) return
    let raf = 0
    let last = 0
    let drawn = false
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop)
      if (t - last < 95) return
      last = t
      const v = video.current
      const c = canvas.current
      if (!v || !c || v.readyState < 2) return
      if (fz.current && drawn) return
      const w = Math.round(26 + q.current * q.current * 250)
      const h = Math.round((w * 9) / 16)
      if (c.width !== w) {
        c.width = w
        c.height = h
      }
      const ctx = c.getContext('2d')
      if (!ctx) return
      ctx.drawImage(v, 0, 0, w, h)
      drawn = true
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [degraded, inView])

  return (
    <div ref={wrap} className={`overflow-hidden bg-black ${className || "relative"}`} style={style}>
      <video
        ref={video}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition }}
        src={armed ? src : undefined}
        poster={armed || eager ? poster : undefined}
        muted
        loop
        playsInline
        preload={eager ? 'auto' : 'none'}
        aria-label={label}
        aria-hidden={label ? undefined : true}
        tabIndex={-1}
        disablePictureInPicture
      />
      <canvas
        ref={canvas}
        width={64}
        height={36}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
        style={{ imageRendering: 'pixelated', opacity: degraded ? 1 : 0, objectPosition }}
      />
    </div>
  )
}
