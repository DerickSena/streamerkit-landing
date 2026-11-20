import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import { Reveal, SectionHead } from '../components/ui'
import { LiveVideo } from '../components/LiveVideo'
import { IconCheck, IconClock, IconCursor, IconHand, IconPin, IconPlus, IconSpeed } from '../components/icons'

type WidgetId = 'score' | 'viewers' | 'place' | 'chat' | 'goal' | 'qr' | 'alert'

const WIDGETS: { id: WidgetId; label: string; x: number; y: number }[] = [
  { id: 'score', label: 'Placar', x: 3, y: 6 },
  { id: 'viewers', label: 'Espectadores', x: 73, y: 6 },
  { id: 'place', label: 'Local e velocidade', x: 3, y: 76 },
  { id: 'chat', label: 'Chat', x: 69, y: 30 },
  { id: 'goal', label: 'Meta', x: 35, y: 84 },
  { id: 'qr', label: 'QR code', x: 82, y: 60 },
  { id: 'alert', label: 'Alertas', x: 33, y: 8 },
]

const CHAT = [
  ['leo_zx', 'essa rua de noite é linda'],
  ['bia.mp4', 'kkkkk olha o cara da moto'],
  ['tutu77', 'manda salve pra Anápolis'],
  ['gabs', 'placar tá ao vivo, que brabo'],
  ['nandaa', 'cheguei agora, tá onde?'],
  ['rafa_irl', 'bora pro próximo desafio'],
]

export function CanvasDemo() {
  const stage = useRef<HTMLDivElement>(null)
  const inView = useInView(stage, { margin: '100px 0px' })
  const reduce = useReducedMotion()
  const [on, setOn] = useState<Record<WidgetId, boolean>>({
    score: true,
    viewers: true,
    place: true,
    chat: true,
    goal: false,
    qr: false,
    alert: false,
  })
  const [sel, setSel] = useState<WidgetId | null>('score')
  const [dragged, setDragged] = useState(false)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!inView || reduce) return
    const iv = setInterval(() => setTick((t) => t + 1), 2100)
    return () => clearInterval(iv)
  }, [inView, reduce])

  const flip = (id: WidgetId) => {
    setOn((s) => ({ ...s, [id]: !s[id] }))
    setSel(id)
  }
  const count = Object.values(on).filter(Boolean).length

  return (
    <section id="canvas" className="section bg-ink-deep" aria-labelledby="canvas-titulo">
      <div className="hairline absolute inset-x-0 top-0" />
      <div className="shell">
        <SectionHead
          id="canvas-titulo"
          kicker="Só aqui · Canvas com widgets"
          title={
            <>
              Overlay de live grande, <span className="text-live">montado no navegador.</span>
            </>
          }
        >
          Alertas, chat, mapa, placar, espectadores, desafios e QR code. Você arrasta, solta e o canvas entra no OBS como
          uma fonte de navegador, no seu PC ou na nuvem.
        </SectionHead>

        <Reveal delay={0.08} className="mt-10 grid gap-4 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_17.5rem]">
          <div className="card !bg-ink">
            <div className="flex items-center justify-between gap-3 border-b border-paper/10 px-4 py-3">
              <p className="flex min-w-0 items-center gap-2.5 text-sm font-medium text-paper">
                <span className="flex gap-1.5">
                  <i className="h-2.5 w-2.5 rounded-full bg-paper/20" />
                  <i className="h-2.5 w-2.5 rounded-full bg-paper/20" />
                  <i className="h-2.5 w-2.5 rounded-full bg-paper/20" />
                </span>
                <span className="truncate">Canvas · Cena IRL</span>
              </p>
              <p className="flex flex-none items-center gap-2 text-xs text-mute">
                <span className="flex -space-x-1.5">
                  <i className="grid h-6 w-6 place-items-center rounded-full bg-cta text-[0.625rem] font-bold not-italic text-white ring-2 ring-ink">VC</i>
                  <i className="grid h-6 w-6 place-items-center rounded-full bg-info text-[0.625rem] font-bold not-italic text-ink ring-2 ring-ink">KM</i>
                </span>
                <span className="hidden sm:inline">Você e 1 mod editando</span>
              </p>
            </div>

            <div
              ref={stage}
              className="relative aspect-video overflow-hidden"
              style={{ containerType: 'inline-size' }}
              onPointerDown={(e) => {
                if (e.target === e.currentTarget) setSel(null)
              }}
            >
              <LiveVideo
                src="/media/rua.mp4"
                poster="/media/rua.webp"
                className="pointer-events-none absolute inset-0"
                label="Vídeo de exemplo: rua de cidade à noite vista de dentro do carro"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/30" />

              <AnimatePresence>
                {WIDGETS.filter((w) => on[w.id]).map((w) => (
                  <motion.div
                    key={w.id}
                    drag
                    dragConstraints={stage}
                    dragMomentum={false}
                    dragElastic={0.04}
                    onDragStart={() => {
                      setSel(w.id)
                      setDragged(true)
                    }}
                    onPointerDown={() => setSel(w.id)}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileDrag={{ scale: 1.05, zIndex: 20 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                    className="ovl absolute"
                    data-sel={sel === w.id ? 'true' : undefined}
                    style={{ left: `${w.x}%`, top: `${w.y}%`, zIndex: sel === w.id ? 10 : 5 }}
                    role="img"
                    aria-label={`Widget ${w.label} (arrastável)`}
                  >
                    <WidgetBody id={w.id} tick={tick} />
                  </motion.div>
                ))}
              </AnimatePresence>

              {inView && !reduce && (
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-0 top-0 z-30 flex items-start gap-1"
                  initial={{ x: '58cqw', y: '29cqw' }}
                  animate={{ x: ['58cqw', '40cqw', '22cqw', '48cqw', '58cqw'], y: ['29cqw', '17cqw', '33cqw', '39cqw', '29cqw'] }}
                  transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <IconCursor className="h-[2.4cqw] min-h-4 w-[2.4cqw] min-w-4 text-info" />
                  <span className="mt-[1.4cqw] rounded-md bg-info px-1.5 py-0.5 text-[max(0.625rem,1.2cqw)] font-bold leading-none text-ink">kiko_mod</span>
                </motion.div>
              )}

              <AnimatePresence>
                {!dragged && (
                  <motion.p
                    key="hint"
                    exit={{ opacity: 0 }}
                    className="label pointer-events-none absolute bottom-3 right-3 z-30 flex items-center gap-2 rounded-full bg-paper px-3 py-1.5 text-ink"
                  >
                    <IconHand className="h-3.5 w-3.5" /> Arraste os widgets
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="card flex flex-col !bg-ink p-4 sm:p-5">
            <p className="label flex items-center justify-between text-dim">
              Widgets <span className="num text-paper">{count} na cena</span>
            </p>
            <ul className="mt-3.5 grid grid-cols-2 gap-2 lg:grid-cols-1">
              {WIDGETS.map((w) => (
                <li key={w.id}>
                  <button
                    type="button"
                    aria-pressed={on[w.id]}
                    onClick={() => flip(w.id)}
                    className="flex min-h-11 w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium ring-1 transition-[background-color,color,box-shadow] duration-200 active:scale-[0.98]"
                    style={{
                      background: on[w.id] ? 'rgb(247 238 236 / 0.08)' : 'transparent',
                      color: on[w.id] ? '#f7eeec' : '#b8a3a0',
                      boxShadow: `inset 0 0 0 1px ${on[w.id] ? 'rgb(247 238 236 / 0.22)' : 'rgb(247 238 236 / 0.1)'}`,
                    }}
                  >
                    <span className="truncate">{w.label}</span>
                    <span
                      className="grid h-5 w-5 flex-none place-items-center rounded-full transition-colors duration-200"
                      style={{ background: on[w.id] ? '#d92b21' : 'rgb(247 238 236 / 0.1)', color: '#fff' }}
                    >
                      {on[w.id] ? <IconCheck className="h-3 w-3" /> : <IconPlus className="h-3 w-3" />}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-auto pt-5 text-[0.8125rem] leading-relaxed text-mute">
              Textos, imagens, vídeos e páginas de alerta também entram. E os seus moderadores podem editar junto com você.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function WidgetBody({ id, tick }: { id: WidgetId; tick: number }) {
  const qr = useMemo(() => makeQr(), [])
  switch (id) {
    case 'score':
      return (
        <div className="flex items-stretch overflow-hidden rounded-[inherit] text-[max(0.6875rem,1.9cqw)] font-bold leading-none">
          <Cell>COR</Cell>
          <span className="grid place-items-center bg-[#14b8a6] px-[1.1cqw] text-[#04201c]">2-1</span>
          <Cell>PAL</Cell>
          <span className="num grid place-items-center border-l border-white/15 px-[1.1cqw] font-medium text-white/80">67:12</span>
        </div>
      )
    case 'viewers':
      return (
        <div className="flex items-center gap-[1.2cqw] px-[1.2cqw] py-[0.9cqw] text-[max(0.6875rem,1.6cqw)] font-bold leading-none">
          <span className="flex items-center gap-[0.6cqw]">
            <i className="h-[1.1cqw] min-h-2 w-[1.1cqw] min-w-2 rounded-sm bg-[#9146ff]" />
            <span className="num">1.284</span>
          </span>
          <span className="flex items-center gap-[0.6cqw]">
            <i className="h-[1.1cqw] min-h-2 w-[1.1cqw] min-w-2 rounded-sm bg-[#53fc18]" />
            <span className="num">312</span>
          </span>
        </div>
      )
    case 'place':
      return (
        <div className="flex flex-col gap-[0.6cqw] rounded-[inherit] bg-transparent p-0 text-[max(0.625rem,1.35cqw)] font-bold leading-none">
          <span className="flex w-fit items-center gap-[0.6cqw] rounded-full bg-[#c03030] px-[1.1cqw] py-[0.7cqw]">
            <IconPin className="h-[1.5cqw] min-h-3 w-[1.5cqw] min-w-3 text-[#ff8a24]" />
            CONSOLAÇÃO, SÃO PAULO, SP
          </span>
          <span className="flex gap-[0.6cqw]">
            <span className="flex items-center gap-[0.5cqw] rounded-full bg-[#8b1616] px-[1cqw] py-[0.6cqw]">
              <IconClock className="h-[1.3cqw] min-h-2.5 w-[1.3cqw] min-w-2.5" /> 21:47
            </span>
            <span className="flex items-center gap-[0.5cqw] rounded-full bg-[#8b1616] px-[1cqw] py-[0.6cqw]">
              <IconSpeed className="h-[1.3cqw] min-h-2.5 w-[1.3cqw] min-w-2.5" /> 5 KM/H
            </span>
          </span>
        </div>
      )
    case 'chat': {
      const rows = [0, 1, 2].map((i) => CHAT[(tick + i) % CHAT.length])
      return (
        <ul className="flex w-[27cqw] min-w-[9.5rem] flex-col gap-[0.7cqw] p-[1.2cqw] text-[max(0.625rem,1.35cqw)] leading-tight">
          {rows.map(([u, t]) => (
            <li key={u + t}>
              <b className="text-[#ff8a7f]">{u}</b> <span className="font-normal text-white/90">{t}</span>
            </li>
          ))}
        </ul>
      )
    }
    case 'goal':
      return (
        <div className="w-[30cqw] min-w-[10rem] p-[1.2cqw] text-[max(0.6875rem,1.4cqw)] font-bold leading-none">
          <div className="flex items-center justify-between">
            <span>Meta de subs</span>
            <span className="num">64 / 100</span>
          </div>
          <div className="mt-[0.9cqw] h-[0.9cqw] min-h-1.5 overflow-hidden rounded-full bg-white/20">
            <motion.div className="h-full rounded-full bg-live" initial={{ width: 0 }} animate={{ width: '64%' }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} />
          </div>
        </div>
      )
    case 'qr':
      return (
        <div className="flex flex-col items-center gap-[0.7cqw] bg-white p-[1cqw] text-black" style={{ borderRadius: 'inherit' }}>
          <svg viewBox="0 0 21 21" className="h-[11cqw] min-h-14 w-[11cqw] min-w-14" shapeRendering="crispEdges" aria-hidden="true">
            {qr.map(([x, y]) => (
              <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#000" />
            ))}
          </svg>
          <span className="text-[max(0.5625rem,1.1cqw)] font-bold leading-none">ENTRA NO DISCORD</span>
        </div>
      )
    case 'alert':
      return (
        <div className="flex items-center gap-[1cqw] rounded-[inherit] bg-gradient-to-r from-[#d92b21] to-[#8b1616] px-[1.4cqw] py-[1cqw] text-[max(0.6875rem,1.6cqw)] font-bold leading-none">
          <span className="grid h-[3cqw] min-h-5 w-[3cqw] min-w-5 place-items-center rounded-full bg-white/20">
            <IconSpeed className="h-[1.8cqw] min-h-3 w-[1.8cqw] min-w-3" />
          </span>
          <span>
            bia.mp4 <span className="font-medium text-white/85">virou sub!</span>
          </span>
        </div>
      )
  }
}

function Cell({ children }: { children: ReactNode }) {
  return <span className="grid place-items-center px-[1.1cqw] py-[0.9cqw]">{children}</span>
}

/** Desenho no formato de um QR code (decorativo, não aponta para lugar nenhum). */
function makeQr() {
  const cells: [number, number][] = []
  const finder = (ox: number, oy: number) => {
    for (let y = 0; y < 7; y++)
      for (let x = 0; x < 7; x++) {
        const edge = x === 0 || y === 0 || x === 6 || y === 6
        const core = x >= 2 && x <= 4 && y >= 2 && y <= 4
        if (edge || core) cells.push([ox + x, oy + y])
      }
  }
  finder(0, 0)
  finder(14, 0)
  finder(0, 14)
  let s = 41
  for (let y = 0; y < 21; y++)
    for (let x = 0; x < 21; x++) {
      const inFinder = (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12)
      s = (s * 1103515245 + 12345) & 0x7fffffff
      if (!inFinder && s % 100 < 46) cells.push([x, y])
    }
  return cells
}
