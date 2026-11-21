import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import { Reveal, SectionHead } from '../components/ui'
import { LiveVideo } from '../components/LiveVideo'
import { IconCheck, IconHand, IconPower, IconReload, IconX } from '../components/icons'
import { fill, useFmt, useT } from '../i18n'
import type { AnchorId, LinkId } from '../three/bonding'

const LINKS: { id: LinkId; label: string; cap: number; color: string }[] = [
  { id: '5g', label: '5G', cap: 3.6, color: '#f2b04e' },
  { id: 'wifi', label: 'Wi-Fi', cap: 2.4, color: '#3b9bff' },
]
const TARGET = 6

export function Bonding() {
  const t = useT()
  const fmt = useFmt()
  const [links, setLinks] = useState<Record<LinkId, boolean>>({ '5g': true, wifi: true })
  const [touched, setTouched] = useState(false)
  const upCount = LINKS.filter((l) => links[l.id]).length
  const brb = upCount === 0
  const total = Math.min(TARGET, LINKS.reduce((s, l) => s + (links[l.id] ? l.cap : 0), 0))
  // Com uma conexão só a imagem continua cheia: o SRTLA passa tudo para a que ficou. Sem nenhuma, entra o BRB.
  const quality = 1

  const toggle = (id: LinkId) => {
    setTouched(true)
    setLinks((s) => ({ ...s, [id]: !s[id] }))
  }
  const all = (v: boolean) => {
    setTouched(true)
    setLinks({ '5g': v, wifi: v })
  }

  const status = brb
    ? { tone: '#f2b04e', ...t.bonding.status.brb }
    : upCount === LINKS.length
      ? { tone: '#30d158', ...t.bonding.status.both }
      : { tone: '#30d158', ...t.bonding.status.one }

  return (
    <section id="bonding" className="section bg-ink-deep" aria-labelledby="bonding-titulo">
      <div className="hairline absolute inset-x-0 top-0" />
      <div className="shell">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHead
            id="bonding-titulo"
            kicker={t.bonding.kicker}
            title={
              <>
                {t.bonding.title[0]} <span className="text-live">{t.bonding.title[1]}</span>
              </>
            }
          >
            {t.bonding.lede}
          </SectionHead>
          <Reveal delay={0.1} className="flex flex-none gap-2.5">
            <button type="button" onClick={() => all(false)} className="btn btn-ghost btn-sm">
              <IconX className="h-4 w-4" />
              {t.bonding.dropAll}
            </button>
            <button type="button" onClick={() => all(true)} className="btn btn-ghost btn-sm">
              <IconReload className="h-4 w-4" />
              {t.bonding.reconnect}
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
                label={t.bonding.videoLabel}
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
                      <p className="display text-[clamp(2.75rem,9vw,4.25rem)] text-warn">{t.bonding.brbTitle}</p>
                      <p className="label mt-2 text-paper/70">{t.bonding.brbSub}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="absolute left-3 top-3 flex items-center gap-2">
                <span className="flex items-center gap-1.5 rounded-md bg-live px-2 py-1 text-[0.6875rem] font-bold uppercase leading-none tracking-wide text-white">
                  <i className="h-1.5 w-1.5 rounded-full bg-white" style={{ animation: 'blink 1.4s ease-in-out infinite' }} />
                  {t.common.live}
                </span>
                <span className="rounded-md bg-black/60 px-2 py-1 text-[0.6875rem] font-medium leading-none text-white/90">
                  {t.bonding.viewerSees}
                </span>
              </div>
            </div>

            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="label text-dim">{t.bonding.total}</p>
                  <p className="num mt-1.5 text-4xl font-semibold leading-none" style={{ color: brb ? '#f2b04e' : '#f7eeec' }}>
                    {fmt.mbps(total)}
                    <span className="ml-1.5 text-sm font-medium text-dim">Mbps</span>
                  </p>
                </div>
                <p className="num text-right text-xs leading-relaxed text-dim">
                  {fill(t.bonding.countOf, { n: upCount })}
                  <br />
                  {t.bonding.connections}
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

        <Reveal delay={0.15} className="mt-4">
          <ConnTable links={links} onToggle={toggle} />
        </Reveal>
      </div>
    </section>
  )
}

/** Latência e RTT de partida de cada conexão (números ilustrativos, como os do simulador). */
const NET: Record<LinkId, { lat: number; rtt: number }> = { wifi: { lat: 64, rtt: 38 }, '5g': { lat: 31, rtt: 44 } }
const ROWS: LinkId[] = ['wifi', '5g']
/** Variação pequena e repetível (igual no servidor e no navegador). */
const noise = (seed: number) => {
  const x = Math.sin(seed * 127.1) * 43758.5453
  return x - Math.floor(x)
}

/**
 * Tabela "Conexões", cópia da tela do painel: liga e desliga cada conexão (o mesmo estado do simulador 3D)
 * e muda a prioridade. O uso na transmissão se redistribui na hora; de tempos em tempos o Wi-Fi engasga
 * e o 5G assume, como acontece numa live de verdade.
 */
function ConnTable({ links, onToggle }: { links: Record<LinkId, boolean>; onToggle: (id: LinkId) => void }) {
  const t = useT()
  const c = t.bonding.table
  const wrap = useRef<HTMLDivElement>(null)
  const inView = useInView(wrap, { margin: '0px 0px -10% 0px' })
  const reduce = useReducedMotion()
  const [prio, setPrio] = useState<Record<LinkId, number>>({ '5g': 1, wifi: 1 })
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!inView || reduce) return
    const id = window.setInterval(() => setTick((n) => n + 1), 1600)
    return () => window.clearInterval(id)
  }, [inView, reduce])

  const rows = useMemo(() => {
    const choke = links.wifi && tick % 7 === 5
    const raw = ROWS.map((id, i) => {
      const cap = LINKS.find((l) => l.id === id)!.cap
      const on = links[id]
      const bad = choke && id === 'wifi'
      const w = on ? cap * (1 + (prio[id] - 1) * 0.4) * (0.92 + noise(tick * 7 + i + 1) * 0.16) * (bad ? 0.1 : 1) : 0
      const lat = bad ? 480 + Math.round(noise(tick + 3) * 280) : NET[id].lat + Math.round((noise(tick * 3 + i + 2) - 0.5) * 14)
      const rtt = NET[id].rtt + Math.round((noise(tick * 5 + i + 4) - 0.5) * 10)
      return { id, on, w, lat, rtt, share: 0 }
    })
    const sum = raw.reduce((acc, r) => acc + r.w, 0)
    const active = raw.filter((r) => r.on)
    let left = 100
    active.forEach((r, i) => {
      r.share = i === active.length - 1 ? left : Math.round((r.w / sum) * 100)
      left -= r.share
    })
    return raw
  }, [links, prio, tick])

  const name = (id: LinkId) => (id === 'wifi' ? { main: 'Wi-Fi', sub: c.wifiSub } : { main: c.cell, sub: '5G' })

  return (
    <div ref={wrap} className="tl-panel cx">
      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1.5">
        <p className="label text-live">{c.label}</p>
        <p className="text-[0.875rem] leading-snug text-[#a79c9a]">{c.text}</p>
      </div>

      <h3 className="mt-5 text-lg font-semibold text-[#f2edec]">{c.title}</h3>
      <div className="cx-table mt-3" role="table" aria-label={c.title}>
        <div className="cx-head" role="row">
          <span role="columnheader">{c.cols.net}</span>
          <span role="columnheader">{c.cols.status}</span>
          <span role="columnheader">{c.cols.latency}</span>
          <span role="columnheader">{c.cols.usage}</span>
          <span role="columnheader">{c.cols.rtt}</span>
          <span role="columnheader">{c.cols.priority}</span>
          <span role="columnheader" className="text-right">
            {c.cols.enable}
          </span>
        </div>

        {rows.map((r) => {
          const n = name(r.id)
          return (
            <div key={r.id} className="cx-row" role="row" data-on={r.on}>
              <div role="cell" className="cx-net">
                {r.id === 'wifi' ? (
                  <svg viewBox="0 0 24 24" className="h-4 w-4 flex-none" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M2.5 9a14 14 0 0 1 19 0M6 12.7a9 9 0 0 1 12 0M9.4 16.3a4 4 0 0 1 5.2 0" />
                    <circle cx="12" cy="19.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-4 w-4 flex-none" fill="currentColor" aria-hidden="true">
                    <path d="M21 3v18H3z" />
                  </svg>
                )}
                <b>{n.main}</b>
                <span>{n.sub}</span>
              </div>
              <div role="cell" className="cx-status">
                {r.on ? c.on : c.off}
              </div>
              <div role="cell" className="cx-lat" data-label={c.cols.latency} data-tone={!r.on ? undefined : r.lat > 300 ? 'bad' : r.lat < 60 ? 'good' : undefined}>
                {r.on ? `${r.lat} ms` : '-'}
              </div>
              <div role="cell" className="cx-use" data-label={c.cols.usage}>
                <span className="n">{r.on ? `${r.share}%` : '-'}</span>
                <span className="cx-bar" aria-hidden="true">
                  <i style={{ width: `${r.share}%` }} />
                </span>
              </div>
              <div role="cell" className="cx-rtt" data-label={c.cols.rtt}>
                {r.on ? `${r.rtt} ms` : '-'}
              </div>
              <div role="cell" className="cx-prio" data-label={c.cols.priority}>
                <input
                  type="range"
                  className="tl-range"
                  min={1}
                  max={10}
                  step={1}
                  value={prio[r.id]}
                  disabled={!r.on}
                  aria-label={`${c.cols.priority}: ${n.main} ${n.sub}`}
                  onChange={(e) => setPrio((p) => ({ ...p, [r.id]: Number(e.target.value) }))}
                  style={{ '--fill': `${((prio[r.id] - 1) / 9) * 100}%` } as CSSProperties}
                />
                <span>{prio[r.id]}/10</span>
              </div>
              <div role="cell" className="cx-tog">
                <button type="button" role="switch" aria-checked={r.on} aria-label={`${c.cols.enable}: ${n.main} ${n.sub}`} onClick={() => onToggle(r.id)}>
                  <span className="switch" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
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
  const t = useT()
  const fmt = useFmt()
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
            aria-label={fill(up ? t.bonding.ariaUp : t.bonding.ariaDown, { l: l.label })}
            className={`group flex min-h-11 items-center gap-2 rounded-full py-2 pl-3 pr-3.5 text-sm font-semibold leading-none shadow-[0_10px_30px_-10px_rgb(0_0_0/0.9)] transition-[background-color,color,box-shadow,scale] duration-300 hover:scale-105 active:scale-95 ${mode === '3d' ? 'absolute left-0 top-0' : ''}`}
            style={{
              background: up ? '#140404' : '#2a0e0c',
              color: up ? '#f7eeec' : '#ff8a7f',
              boxShadow: `0 0 0 1.5px ${up ? l.color : '#ff453a'}, 0 10px 30px -10px rgb(0 0 0 / 0.9)`,
            }}
          >
            <i className="h-2 w-2 rounded-full transition-colors duration-300" style={{ background: up ? l.color : '#ff453a' }} />
            <span className={up ? '' : 'line-through decoration-2'}>{l.label}</span>
            <span className="num text-xs font-medium opacity-70">{up ? fmt.mbps(l.cap) : t.common.down}</span>
          </button>
        )
      }),
    [links, mode, onToggle, t, fmt],
  )

  const nodeLabels: { id: AnchorId; title: string; sub: string }[] = [
    { id: 'phone', title: t.bonding.nodes.phone[0], sub: t.bonding.nodes.phone[1] },
    { id: 'ingest', title: t.bonding.nodes.ingest[0], sub: t.bonding.nodes.ingest[1] },
    { id: 'obs', title: t.bonding.nodes.obs[0], sub: t.bonding.nodes.obs[1] },
    { id: 'twitch', title: 'Twitch', sub: '' },
    { id: 'kick', title: 'Kick', sub: '' },
    { id: 'youtube', title: 'YouTube', sub: '' },
  ]

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
          {nodeLabels.map((n) => (
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
            <p className="mt-5 text-sm text-mute">{t.bonding.fallback}</p>
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
            <IconHand className="h-3.5 w-3.5" /> {t.bonding.hint}
          </motion.p>
        )}
      </AnimatePresence>
      <p className="label absolute left-4 top-4 text-dim">{brb ? t.bonding.sceneLabelBrb : t.bonding.sceneLabel}</p>
    </div>
  )
}
