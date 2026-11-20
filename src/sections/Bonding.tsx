import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import { Reveal, SectionHead } from '../components/ui'
import { LiveVideo } from '../components/LiveVideo'
import { IconCheck, IconHand, IconPower, IconReload, IconX } from '../components/icons'
import { fmtMbps } from '../lib/site'
import type { AnchorId, LinkId } from '../three/bonding'

const LINKS: { id: LinkId; label: string; cap: number; color: string }[] = [
  { id: '4g', label: '4G', cap: 2.4, color: '#30d158' },
  { id: '5g', label: '5G', cap: 3.6, color: '#f2b04e' },
  { id: 'wifi', label: 'Wi-Fi', cap: 2.0, color: '#3b9bff' },
]
const TARGET = 6

const NODE_LABELS: { id: AnchorId; title: string; sub: string }[] = [
  { id: 'phone', title: 'Seu celular', sub: 'App StreamerKit' },
  { id: 'ingest', title: 'Ingest', sub: 'Brasil, EUA ou Europa' },
  { id: 'obs', title: 'OBS', sub: 'No seu PC ou na nuvem' },
  { id: 'twitch', title: 'Twitch', sub: '' },
  { id: 'kick', title: 'Kick', sub: '' },
  { id: 'youtube', title: 'YouTube', sub: '' },
]

export function Bonding() {
  const [links, setLinks] = useState<Record<LinkId, boolean>>({ '4g': true, '5g': true, wifi: true })
  const [touched, setTouched] = useState(false)
  const upCount = LINKS.filter((l) => links[l.id]).length
  const brb = upCount === 0
  const total = Math.min(TARGET, LINKS.reduce((s, l) => s + (links[l.id] ? l.cap : 0), 0))
  const quality = brb ? 1 : total >= 4 ? 1 : total >= 3 ? 0.82 : 0.62

  const toggle = (id: LinkId) => {
    setTouched(true)
    setLinks((s) => ({ ...s, [id]: !s[id] }))
  }
  const all = (v: boolean) => {
    setTouched(true)
    setLinks({ '4g': v, '5g': v, wifi: v })
  }

  const status = brb
    ? { tone: '#f2b04e', title: 'BRB automático no ar', text: 'Todas as conexões caíram. O OBS trocou para a sua cena de BRB e a live continua aberta. Quando o sinal voltar, ele volta sozinho para a cena ao vivo.' }
    : upCount === 3
      ? { tone: '#30d158', title: 'Três conexões somadas', text: 'O vídeo viaja dividido entre 4G, 5G e Wi-Fi. Nenhuma delas carrega a live sozinha.' }
      : upCount === 2
        ? { tone: '#30d158', title: 'Uma caiu, duas seguram', text: 'O SRTLA redistribuiu a transmissão na hora. Quem está assistindo não percebe a troca.' }
        : { tone: '#f2b04e', title: 'Segurando com uma conexão', text: 'O bitrate desce para caber no sinal que sobrou, mas a live segue no ar e o SRT reenvia os pacotes perdidos.' }

  return (
    <section id="bonding" className="section bg-ink-deep" aria-labelledby="bonding-titulo">
      <div className="hairline absolute inset-x-0 top-0" />
      <div className="shell">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHead
            id="bonding-titulo"
            kicker="Como o StreamerKit segura"
            title={
              <>
                Derrube uma conexão. <span className="text-live">A live continua.</span>
              </>
            }
          >
            O SRTLA bonding soma o 4G, o 5G e o Wi-Fi do celular numa transmissão só. Teste: toque em uma conexão para
            desligar e veja o que chega nas plataformas.
          </SectionHead>
          <Reveal delay={0.1} className="flex flex-none gap-2.5">
            <button type="button" onClick={() => all(false)} className="btn btn-ghost btn-sm">
              <IconX className="h-4 w-4" />
              Derrubar todas
            </button>
            <button type="button" onClick={() => all(true)} className="btn btn-ghost btn-sm">
              <IconReload className="h-4 w-4" />
              Religar
            </button>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-10 grid gap-4 lg:mt-14 lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)]">
          <div className="card !bg-ink">
            <Scene links={links} brb={brb} onToggle={toggle} touched={touched} />
          </div>

          <div className="card flex flex-col !bg-ink">
            <div className="relative aspect-video">
              <LiveVideo
                src="/media/show.mp4"
                poster="/media/show.webp"
                quality={quality}
                playing={!brb}
                className="absolute inset-0"
                label="Vídeo de exemplo: o que chega para quem assiste"
              />
              <AnimatePresence>
                {brb && (
                  <motion.div
                    key="brb"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="absolute inset-0 grid place-items-center overflow-hidden bg-[#1a0f04]"
                  >
                    <div className="scanlines absolute inset-0 opacity-60" />
                    <div
                      className="absolute inset-0"
                      style={{ background: 'radial-gradient(60% 80% at 50% 50%, rgb(242 176 78 / 0.22), transparent 70%)' }}
                    />
                    <div className="relative text-center">
                      <p className="display text-[clamp(2.75rem,9vw,4.25rem)] text-warn">Já volto</p>
                      <p className="label mt-2 text-paper/70">Cena de BRB · live no ar</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="absolute left-3 top-3 flex items-center gap-2">
                <span className="flex items-center gap-1.5 rounded-md bg-live px-2 py-1 text-[0.6875rem] font-bold uppercase leading-none tracking-wide text-white">
                  <i className="h-1.5 w-1.5 rounded-full bg-white" style={{ animation: 'blink 1.4s ease-in-out infinite' }} />
                  Ao vivo
                </span>
                <span className="rounded-md bg-black/60 px-2 py-1 text-[0.6875rem] font-medium leading-none text-white/90">
                  O que o viewer vê
                </span>
              </div>
            </div>

            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="label text-dim">Bitrate somado</p>
                  <p className="num mt-1.5 text-4xl font-semibold leading-none" style={{ color: brb ? '#f2b04e' : '#f7eeec' }}>
                    {fmtMbps(total)}
                    <span className="ml-1.5 text-sm font-medium text-dim">Mbps</span>
                  </p>
                </div>
                <p className="num text-right text-xs leading-relaxed text-dim">
                  {upCount} de 3<br />
                  conexões
                </p>
              </div>

              <div className="mt-4 flex h-2 gap-1 overflow-hidden rounded-full bg-paper/10">
                {LINKS.map((l) => (
                  <span
                    key={l.id}
                    className="h-full rounded-full transition-[flex-grow,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{ flexGrow: links[l.id] ? l.cap : 0, flexBasis: 0, background: l.color, opacity: links[l.id] ? 1 : 0 }}
                  />
                ))}
                <span
                  className="h-full transition-[flex-grow] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ flexGrow: Math.max(0, 8 - LINKS.reduce((s, l) => s + (links[l.id] ? l.cap : 0), 0)), flexBasis: 0 }}
                />
              </div>

              <div className="mt-5 border-t border-paper/10 pt-5" aria-live="polite">
                <p className="flex items-center gap-2.5 text-[1.0625rem] font-semibold leading-tight [font-stretch:88%]" style={{ color: status.tone }}>
                  <span className="grid h-6 w-6 flex-none place-items-center rounded-full" style={{ background: `${status.tone}26` }}>
                    {brb ? <IconPower className="h-3.5 w-3.5" /> : <IconCheck className="h-3.5 w-3.5" />}
                  </span>
                  {status.title}
                </p>
                <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-mute">{status.text}</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Scene({
  links,
  brb,
  onToggle,
  touched,
}: {
  links: Record<LinkId, boolean>
  brb: boolean
  onToggle: (id: LinkId) => void
  touched: boolean
}) {
  const wrap = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const labels = useRef<Partial<Record<AnchorId, HTMLElement | null>>>({})
  const api = useRef<ReturnType<typeof import('../three/bonding').createBondingScene> | null>(null)
  const inView = useInView(wrap, { margin: '200px 0px' })
  const visible = useRef(false)
  const reduce = useReducedMotion()
  const [mode, setMode] = useState<'loading' | '3d' | 'fallback'>('loading')
  const stateRef = useRef({ links, brb })
  stateRef.current = { links, brb }
  visible.current = inView

  useEffect(() => {
    api.current?.setState({ links, brb })
  }, [links, brb])

  // A cena nasce uma vez (quando a seção chega perto da tela) e só é desfeita ao sair da página.
  const [armed, setArmed] = useState(false)
  useEffect(() => {
    if (inView) setArmed(true)
  }, [inView])
  useEffect(() => {
    if (!armed) return
    let raf = 0
    let dead = false
    let ro: ResizeObserver | null = null
    import('../three/bonding')
      .then(({ createBondingScene }) => {
        if (dead || !canvas.current) return
        const scene = createBondingScene(canvas.current, (pts) => {
          for (const id in pts) {
            const el = labels.current[id as AnchorId]
            const p = pts[id as AnchorId]
            if (el) el.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0) translate(-50%, -50%)`
          }
        })
        api.current = scene
        scene.setState(stateRef.current)
        setMode('3d')
        ro = new ResizeObserver(() => scene.resize())
        ro.observe(canvas.current)
        let last = performance.now()
        const loop = (now: number) => {
          raf = requestAnimationFrame(loop)
          const dt = Math.max(0, Math.min(0.05, (now - last) / 1000))
          last = now
          if (!visible.current) return
          scene.frame(dt, !reduce)
        }
        raf = requestAnimationFrame(loop)
      })
      .catch(() => setMode('fallback'))
    return () => {
      dead = true
      cancelAnimationFrame(raf)
      ro?.disconnect()
      api.current?.dispose()
      api.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [armed])

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    const b = e.currentTarget.getBoundingClientRect()
    api.current?.setPointer(((e.clientX - b.left) / b.width - 0.5) * 2, ((e.clientY - b.top) / b.height - 0.5) * 2)
  }

  const chips = useMemo(
    () =>
      LINKS.map((l) => {
        const up = links[l.id]
        return (
          <button
            key={l.id}
            type="button"
            ref={(el) => {
              labels.current[l.id] = el
            }}
            onClick={() => onToggle(l.id)}
            aria-pressed={up}
            aria-label={`${l.label}: ${up ? 'ligado, toque para derrubar' : 'caiu, toque para religar'}`}
            className={`group flex min-h-11 items-center gap-2 rounded-full py-2 pl-3 pr-3.5 text-sm font-semibold leading-none shadow-[0_10px_30px_-10px_rgb(0_0_0/0.9)] transition-[background-color,color,box-shadow,scale] duration-300 hover:scale-105 active:scale-95 ${mode === '3d' ? 'absolute left-0 top-0' : ''}`}
            style={{
              background: up ? '#140404' : '#2a0e0c',
              color: up ? '#f7eeec' : '#ff8a7f',
              boxShadow: `0 0 0 1.5px ${up ? l.color : '#ff453a'}, 0 10px 30px -10px rgb(0 0 0 / 0.9)`,
            }}
          >
            <i className="h-2 w-2 rounded-full transition-colors duration-300" style={{ background: up ? l.color : '#ff453a' }} />
            <span className={up ? '' : 'line-through decoration-2'}>{l.label}</span>
            <span className="num text-xs font-medium opacity-70">{up ? `${fmtMbps(l.cap)}` : 'caiu'}</span>
          </button>
        )
      }),
    [links, mode, onToggle],
  )

  return (
    <div
      ref={wrap}
      onPointerMove={onMove}
      onPointerLeave={() => api.current?.setPointer(0, 0)}
      className="relative aspect-[3/4] w-full overflow-hidden sm:aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[33rem]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'radial-gradient(70% 60% at 50% 45%, rgb(255 42 28 / 0.1), transparent 70%)' }}
      />
      <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 h-full w-full" style={{ opacity: mode === '3d' ? 1 : 0, transition: 'opacity 0.8s ease' }} />

      {mode === '3d' ? (
        <div className="absolute inset-0">
          {chips}
          {NODE_LABELS.map((n) => (
            <div
              key={n.id}
              ref={(el) => {
                labels.current[n.id] = el
              }}
              className="pointer-events-none absolute left-0 top-0 whitespace-nowrap text-center"
            >
              <p className="text-[0.8125rem] font-semibold leading-tight text-paper sm:text-sm">{n.title}</p>
              {n.sub && <p className="mt-0.5 hidden text-[0.6875rem] leading-tight text-dim sm:block">{n.sub}</p>}
            </div>
          ))}
        </div>
      ) : (
        <div className="absolute inset-0 grid place-items-center p-6">
          <div className="text-center">
            <div className="flex flex-wrap justify-center gap-2.5">{chips}</div>
            <p className="mt-5 text-sm text-mute">Celular → Ingest → OBS → Twitch, Kick e YouTube</p>
          </div>
        </div>
      )}

      <AnimatePresence>
        {!touched && mode === '3d' && (
          <motion.p
            key="hint"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="label pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-paper px-3 py-1.5 text-ink sm:bottom-4"
          >
            <IconHand className="h-3.5 w-3.5" /> Toque em 4G, 5G ou Wi-Fi
          </motion.p>
        )}
      </AnimatePresence>
      <p className="label absolute left-4 top-4 text-dim">{brb ? 'Sem sinal · BRB segurando' : 'SRTLA bonding'}</p>
    </div>
  )
}
