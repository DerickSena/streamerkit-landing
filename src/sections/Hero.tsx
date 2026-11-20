import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import { AppPanel, Phone, type LinkStat } from '../components/Phone'
import { LiveVideo } from '../components/LiveVideo'
import { IconArrow, IconArrowDown, IconChat, IconEye, IconPower } from '../components/icons'
import { LINKS, fmtInt, fmtMbps } from '../lib/site'

type Phase = 'ok' | 'drop' | 'frozen' | 'offline' | 'on'
type Msg = { id: number; user: string; text: string; tone: 'bad' | 'good' | 'neutral' }
type Sim = {
  phase: Phase
  bitrate: number
  quality: number
  viewers: number
  delta: number
  history: number[]
  links: LinkStat[]
  chat: Msg[]
  cycles: number
  bars: number
}

const NAMES = ['leo_zx', 'bia.mp4', 'tutu77', 'gabs', 'rafa_irl', 'nandaa', 'kiko_mod', 'ju.live', 'pedrox', 'mari_s2']
const POOL: Record<Phase, string[]> = {
  ok: ['que show!!', 'manda salve', 'tá onde?', 'olha esse palco', 'kkkkk'],
  drop: ['tá travando', 'lagou aqui', 'imagem toda quadrada', 'o bitrate tá caindo'],
  frozen: ['caiu?', 'F', 'travou', 'caiu dnv kkkk', 'volta!!', 'congelou aqui', 'F no chat'],
  offline: ['encerrou :(', 'vou pra outra live', 'avisa quando voltar'],
  on: [
    'imagem lisa demais',
    'nem parece 4G',
    'que show!!',
    'o 5G caiu e nem travou',
    'manda salve',
    'kkkkk',
    'qualidade absurda',
    'segue o baile',
    'tá onde?',
    'live boa demais',
  ],
}

const GREEN = '#30d158'
const AMBER = '#f2b04e'
const BLUE = '#3b9bff'
const START_VIEWERS = 1284
const CYCLE = 11.6

const initial = (on: boolean): Sim => ({
  phase: on ? 'on' : 'ok',
  bitrate: on ? 6 : 4,
  quality: 1,
  viewers: START_VIEWERS,
  delta: 0,
  history: Array.from({ length: 26 }, () => (on ? 6 : 4)),
  links: on
    ? [
        { id: '4g', label: '4G', pct: 38, color: GREEN, up: true },
        { id: '5g', label: '5G', pct: 41, color: AMBER, up: true },
        { id: 'wifi', label: 'Wi-Fi', pct: 21, color: BLUE, up: true },
      ]
    : [{ id: '4g', label: '4G', pct: 100, color: GREEN, up: true }],
  chat: [],
  cycles: 0,
  bars: 3,
})

/** Simulação da live: sem o StreamerKit ela cai em ciclo; com ele, segura. */
function useHeroSim(on: boolean, active: boolean) {
  const [s, setS] = useState<Sim>(() => initial(on))
  const r = useRef({ t: 0, viewers: START_VIEWERS, hist: initial(on).history, chat: [] as Msg[], next: 0.7, id: 0, cycles: 0, n: 0 })

  const firstRun = useRef(true)
  useEffect(() => {
    r.current.t = 0
    r.current.next = 0.4
    if (!on) r.current.viewers = START_VIEWERS
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    // Atualiza na hora (vale também para quem usa "reduzir movimento", em que a simulação não roda).
    const base = initial(on)
    setS((s) => ({ ...base, viewers: on ? s.viewers : START_VIEWERS, chat: s.chat, cycles: s.cycles }))
  }, [on])

  useEffect(() => {
    if (!active) return
    const dt = 0.22
    const iv = setInterval(() => {
      const m = r.current
      m.t += dt
      m.n += 1
      const wob = Math.sin(m.n * 0.9) * 0.12 + Math.sin(m.n * 0.37) * 0.08
      let phase: Phase
      let bitrate: number
      let quality = 1
      let bars = 3
      let links: LinkStat[]
      const before = m.viewers

      if (on) {
        phase = 'on'
        const period = 7
        const k = m.t % period
        const downIdx = k > 3.2 && k < 5.4 ? Math.floor(m.t / period) % 3 : -1
        const base = [38 + wob * 20, 41 - wob * 16, 21 + Math.sin(m.n * 0.21) * 4]
        const meta = [
          { id: '4g', label: '4G', color: GREEN },
          { id: '5g', label: '5G', color: AMBER },
          { id: 'wifi', label: 'Wi-Fi', color: BLUE },
        ]
        const sum = base.reduce((a, b, i) => a + (i === downIdx ? 0 : b), 0)
        links = meta.map((x, i) => ({ ...x, up: i !== downIdx, pct: i === downIdx ? 0 : (base[i] / sum) * 100 }))
        bitrate = 6 + wob * 0.9 - (downIdx >= 0 && k < 3.9 ? 0.5 : 0)
        m.viewers = m.viewers < START_VIEWERS ? m.viewers + (START_VIEWERS - m.viewers) * 0.09 + 4 : m.viewers + (m.n % 3 === 0 ? 2 : 1)
      } else {
        const t = m.t % CYCLE
        if (m.t >= CYCLE && t < dt) {
          m.cycles += 1
          m.viewers = START_VIEWERS
        }
        if (t < 2.6) {
          phase = 'ok'
          bitrate = 4 + wob
          m.viewers += m.n % 4 === 0 ? 1 : 0
        } else if (t < 4.8) {
          phase = 'drop'
          const p = (t - 2.6) / 2.2
          bitrate = Math.max(0.3, 4 - p * 3.7 + wob * 0.4)
          quality = Math.max(0.1, 1 - p * 0.95)
          bars = p > 0.5 ? 1 : 2
          m.viewers -= 6 + p * 14
        } else if (t < 8.2) {
          phase = 'frozen'
          bitrate = 0
          quality = 0.1
          bars = 0
          m.viewers = Math.max(160, m.viewers * 0.925)
        } else {
          phase = 'offline'
          bitrate = 0
          quality = 0.1
          bars = 0
          m.viewers = Math.max(0, m.viewers * 0.8 - 3)
        }
        links = [{ id: '4g', label: '4G', pct: 100, color: GREEN, up: bars > 0 }]
      }

      m.hist = [...m.hist.slice(1), bitrate]

      m.next -= dt
      if (m.next <= 0) {
        const pool = POOL[phase]
        const text = pool[(m.id * 7 + m.cycles * 3) % pool.length]
        const tone = phase === 'on' || phase === 'ok' ? (phase === 'on' ? 'good' : 'neutral') : 'bad'
        m.id += 1
        m.chat = [...m.chat.slice(-3), { id: m.id, user: NAMES[(m.id * 3) % NAMES.length], text, tone }]
        m.next = phase === 'frozen' ? 0.55 : phase === 'offline' ? 1.2 : 1.25
      }

      setS({
        phase,
        bitrate,
        quality,
        viewers: m.viewers,
        delta: m.viewers - before,
        history: m.hist,
        links,
        chat: m.chat,
        cycles: m.cycles,
        bars,
      })
    }, dt * 1000)
    return () => clearInterval(iv)
  }, [on, active])

  return s
}

export function Hero() {
  const [on, setOn] = useState(false)
  const [touched, setTouched] = useState(false)
  const toggle = (v: boolean) => {
    setOn(v)
    setTouched(true)
  }

  return (
    <section id="topo" className="relative overflow-x-clip pt-[5.25rem] sm:pt-28 lg:pt-32">
      <Backdrop on={on} />
      <div className="shell relative grid items-center gap-x-10 gap-y-10 lg:grid-cols-12 lg:gap-y-14">
        <div className="lg:col-span-5">
          <p className="label mb-4 flex items-center gap-2.5 text-mute sm:mb-5">
            <span className="live-dot" />
            Servidor de live IRL
          </p>

          <h1 className="display grid text-[clamp(3.9rem,19.5vw,8.6rem)] lg:text-[clamp(5rem,8.3vw,8.6rem)]">
            <span className="sr-only">StreamerKit, servidor de live IRL: </span>
            <HeadlineVariant show={!on}>
              <span className="block">Sua live</span>
              <span className="block">
                <span className="glitch" data-text="caiu.">
                  caiu.
                </span>
              </span>
              <span className="block text-paper/40">De novo.</span>
            </HeadlineVariant>
            <HeadlineVariant show={on}>
              <span className="block">Sua live</span>
              <span className="block">continua</span>
              <span className="block text-live">no ar.</span>
            </HeadlineVariant>
          </h1>

          <div className="mt-5 grid max-w-[34rem] sm:mt-6">
            <LedeVariant show={!on}>
              <span className="hidden sm:inline">Show lotado, todo mundo pendurado na mesma antena, e o seu único chip não aguenta. </span>
              <span className="sm:hidden">Um chip só não aguenta show lotado. </span>O{' '}
              <strong className="font-semibold text-paper">StreamerKit</strong> junta 4G, 5G e Wi-Fi numa transmissão só e
              segura a sua live no ar.
            </LedeVariant>
            <LedeVariant show={on}>
              4G, 5G e Wi-Fi somados numa transmissão só. Se uma conexão cai, as outras seguram.
              <span className="hidden sm:inline">
                {' '}
                Se todas caem, a cena de BRB mantém <strong className="font-semibold text-paper">a sua live no ar</strong> até
                você voltar.
              </span>
            </LedeVariant>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center">
            <a href={LINKS.plans} className="btn btn-primary w-full sm:w-auto">
              Escolher um plano
              <IconArrow className="h-5 w-5" />
            </a>
            <a href="#bonding" className="btn btn-ghost hidden sm:inline-flex sm:w-auto">
              Ver funcionando
              <IconArrowDown className="h-5 w-5" />
            </a>
          </div>
          <p className="mt-3.5 text-sm text-dim sm:mt-4">
            Você entra com a sua conta da Twitch ou da Kick. Planos a partir de R$&nbsp;119,90 por mês.
          </p>
        </div>

        <div className="lg:col-span-7">
          <Stage on={on} touched={touched} onToggle={toggle} />
        </div>
      </div>

      <TrustBar />
    </section>
  )
}

function HeadlineVariant({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <span
      aria-hidden={!show}
      className="col-start-1 row-start-1 transition-[opacity,transform,filter] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? 'none' : 'translateY(0.12em)',
        filter: show ? 'none' : 'blur(10px)',
        visibility: show ? 'visible' : 'hidden',
        transitionProperty: 'opacity, transform, filter, visibility',
      }}
    >
      {children}
    </span>
  )
}

function LedeVariant({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <p
      aria-hidden={!show}
      className="lede col-start-1 row-start-1 transition-opacity duration-500"
      style={{ opacity: show ? 1 : 0, visibility: show ? 'visible' : 'hidden', transitionProperty: 'opacity, visibility' }}
    >
      {children}
    </p>
  )
}

function Backdrop({ on }: { on: boolean }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute left-[38%] top-[4%] h-[62rem] w-[62rem] rounded-full transition-opacity duration-700"
        style={{
          background: 'radial-gradient(closest-side, rgb(255 42 28 / 0.22), rgb(179 65 65 / 0.08) 45%, transparent 70%)',
          opacity: on ? 1 : 0.55,
        }}
      />
      <div
        className="absolute -left-[20%] top-[40%] h-[40rem] w-[40rem] rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgb(179 65 65 / 0.12), transparent 70%)' }}
      />
      <div className="shell absolute inset-0 hidden grid-cols-12 gap-x-10 lg:grid">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className="border-l border-paper/[0.035]" />
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink" />
    </div>
  )
}

function Stage({ on, touched, onToggle }: { on: boolean; touched: boolean; onToggle: (v: boolean) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '120px 0px' })
  const reduce = useReducedMotion()
  const sim = useHeroSim(on, inView && !reduce)

  // 3D: o celular inclina com o mouse e "deita" um pouco conforme a página rola.
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 120, damping: 18, mass: 0.6 })
  const sy = useSpring(py, { stiffness: 120, damping: 18, mass: 0.6 })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.75', 'end start'] })
  const rotateY = useTransform(sx, (v) => -7 + v * 8)
  const rotX = useTransform(sy, (v) => 5 - v * 7)
  const scrollTilt = useTransform(scrollYProgress, [0, 1], [0, 16])
  const rotateX = useTransform([rotX, scrollTilt], ([a, b]) => (a as number) + (b as number))

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || reduce) return
    const b = e.currentTarget.getBoundingClientRect()
    px.set(((e.clientX - b.left) / b.width - 0.5) * 2)
    py.set(((e.clientY - b.top) / b.height - 0.5) * 2)
  }
  const onLeave = () => {
    px.set(0)
    py.set(0)
  }

  const frozen = sim.phase === 'frozen' || sim.phase === 'offline'
  const offline = sim.phase === 'offline'
  const bad = !on && sim.phase !== 'ok'

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className="relative">
      <div className="relative mx-auto w-full max-w-[46rem] lg:-mr-8 lg:w-auto lg:max-w-none xl:-mr-14">
        <div className="rise" style={{ perspective: '1600px' }}>
        <motion.div
          style={reduce ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
          className="relative will-change-transform"
        >
          <Phone>
            <div className="relative min-w-0 flex-1">
              <LiveVideo
                src="/media/show.mp4"
                poster="/media/show.webp"
                eager
                quality={on ? 1 : sim.quality}
                frozen={!on && frozen}
                className="absolute inset-0"
                style={{ filter: 'brightness(1.14) saturate(1.12)' }}
                label="Vídeo de exemplo: plateia de um show filmando o palco com o celular"
              />

              {/* brilho vermelho quando a live está morrendo */}
              <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{ boxShadow: 'inset 0 0 12cqw rgb(255 42 28 / 0.55)', opacity: bad ? 1 : 0 }}
              />

              <div className="absolute left-[7.2cqw] top-[2cqw] z-10 flex items-center gap-[0.8cqw]">
                <span className="app-pill">
                  <IconChat style={{ color: '#30d158' }} />
                  <i className="h-[1.4cqw] w-px bg-white/25" />
                  <IconEye />
                  <span className="num">{fmtInt(sim.viewers)}</span>
                </span>
                <span
                  className="app-pill transition-colors duration-300"
                  style={{ background: frozen && !on ? 'rgb(60 60 66 / 0.9)' : 'rgb(255 42 28 / 0.92)' }}
                >
                  {frozen && !on ? 'OFFLINE' : 'AO VIVO'}
                </span>
              </div>

              <div className="absolute bottom-[2cqw] right-[2cqw] z-10 hidden items-center gap-[0.6cqw] sm:flex">
                <span className="app-pill">
                  <span className="opacity-50">0.5</span>
                  <span className="rounded-full bg-white px-[0.8cqw] py-[0.2cqw] text-black">1</span>
                  <span className="opacity-50">2</span>
                </span>
                <span className="app-pill">Traseira</span>
              </div>

              <AnimatePresence>
                {!on && sim.phase === 'frozen' && (
                  <motion.div
                    key="frozen"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-10 grid place-items-center bg-black/35"
                  >
                    <div className="flex items-center gap-[1.4cqw] rounded-full bg-black/70 px-[2.4cqw] py-[1.3cqw] text-[2.3cqw] font-semibold leading-none">
                      <i
                        className="block h-[2.4cqw] w-[2.4cqw] rounded-full border-[0.3cqw] border-white/25 border-t-white"
                        style={{ animation: 'spin 0.8s linear infinite' }}
                      />
                      Reconectando...
                    </div>
                  </motion.div>
                )}
                {!on && offline && (
                  <motion.div
                    key="offline"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-20 grid place-items-center overflow-hidden bg-[#0d0a0a]"
                  >
                    <div className="tv-static absolute inset-0 opacity-70" />
                    <div className="scanlines absolute inset-0" />
                    <div className="relative px-[3cqw] text-center">
                      <p className="label !text-[1.5cqw] text-white/70">Conexão perdida</p>
                      <p className="display mt-[1cqw] text-[7.4cqw] text-white">Live encerrada</p>
                      <button
                        type="button"
                        onClick={() => onToggle(true)}
                        className="mt-[2.2cqw] inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-black transition-transform duration-300 hover:scale-105 active:scale-95"
                      >
                        <IconPower className="h-4 w-4" />
                        Ligar o StreamerKit
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AppPanel bitrate={sim.bitrate} history={sim.history} links={sim.links} sending={!(!on && frozen)} />
          </Phone>

          {/* chat flutuando na frente do celular */}
          <div
            className="pointer-events-none absolute bottom-[86%] right-[3%] hidden w-[14rem] lg:block"
            style={{ transform: 'translateZ(70px)' }}
          >
            <ChatCard chat={sim.chat} />
          </div>
        </motion.div>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-5 grid max-w-[46rem] gap-3 sm:-mt-6 sm:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] sm:px-6 lg:max-w-none">
        <PowerSwitch on={on} touched={touched} onToggle={onToggle} />
        <Telemetry sim={sim} on={on} />
        <ChatTicker msg={sim.chat[sim.chat.length - 1]} />
      </div>
    </div>
  )
}

function ChatCard({ chat }: { chat: Msg[] }) {
  return (
    <div className="rounded-2xl bg-ink-deep/90 p-3.5 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.9)] ring-1 ring-paper/10">
      <p className="label mb-2.5 flex items-center gap-2 text-dim">
        <IconChat className="h-3.5 w-3.5" /> Chat da live
      </p>
      <ul className="flex h-[6.75rem] flex-col justify-end gap-1.5 overflow-hidden text-[0.8125rem] leading-tight">
        <AnimatePresence initial={false}>
          {chat.map((m) => (
            <motion.li
              key={m.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="font-semibold" style={{ color: m.tone === 'bad' ? '#ff6b5e' : m.tone === 'good' ? '#30d158' : '#b8a3a0' }}>
                {m.user}
              </span>{' '}
              <span className="text-paper/90">{m.text}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  )
}

/** No celular e no tablet o chat vira uma linha só, embaixo dos números. */
function ChatTicker({ msg }: { msg?: Msg }) {
  return (
    <div
      aria-hidden="true"
      className="flex min-h-10 items-center gap-2.5 overflow-hidden rounded-xl bg-ink-deep/80 px-3.5 text-[0.8125rem] ring-1 ring-paper/10 sm:col-span-2 lg:hidden"
    >
      <IconChat className="h-3.5 w-3.5 flex-none text-dim" />
      <span className="label flex-none text-dim">Chat</span>
      {msg && (
        <span key={msg.id} className="truncate" style={{ animation: 'price-in 0.35s cubic-bezier(0.16,1,0.3,1)' }}>
          <b className="font-semibold" style={{ color: msg.tone === 'bad' ? '#ff6b5e' : msg.tone === 'good' ? '#30d158' : '#b8a3a0' }}>
            {msg.user}
          </b>{' '}
          <span className="text-paper/90">{msg.text}</span>
        </span>
      )}
    </div>
  )
}

function PowerSwitch({ on, touched, onToggle }: { on: boolean; touched: boolean; onToggle: (v: boolean) => void }) {
  return (
    <div className="relative">
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => onToggle(!on)}
        className="group flex w-full items-center gap-3.5 rounded-2xl p-3.5 text-left ring-1 transition-[background-color,box-shadow] duration-500 sm:p-4"
        style={{
          background: on ? 'rgb(48 209 88 / 0.1)' : 'var(--color-ink-raised)',
          boxShadow: on
            ? '0 0 0 1px rgb(48 209 88 / 0.5), 0 24px 60px -24px rgb(48 209 88 / 0.5)'
            : '0 0 0 1px rgb(247 238 236 / 0.14), 0 24px 60px -24px rgb(0 0 0 / 0.9)',
        }}
      >
        <span
          className="grid h-11 w-11 flex-none place-items-center rounded-xl transition-colors duration-500"
          style={{ background: on ? '#30d158' : 'rgb(247 238 236 / 0.08)', color: on ? '#04140a' : '#f7eeec' }}
        >
          <IconPower className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[1.0625rem] font-semibold leading-tight [font-stretch:88%]">
            StreamerKit {on ? 'ligado' : 'desligado'}
          </span>
          <span className="mt-0.5 block truncate text-sm text-mute">{on ? '4G + 5G + Wi-Fi somados' : 'Um chip 4G, sozinho'}</span>
        </span>
        <span className="switch" data-on={on ? 'true' : undefined} style={on ? { background: '#30d158' } : undefined} />
      </button>
      {!touched && (
        <p
          className="label pointer-events-none absolute -top-2.5 left-4 flex items-center gap-1.5 rounded-full bg-paper px-2.5 py-1 text-ink shadow-lg"
          style={{ animation: 'blink 1.8s ease-in-out infinite' }}
        >
          Ligue e veja <IconArrowDown className="h-3 w-3" />
        </p>
      )}
    </div>
  )
}

function Telemetry({ sim, on }: { sim: Sim; on: boolean }) {
  const dropping = sim.delta < -1
  const dead = !on && (sim.phase === 'frozen' || sim.phase === 'offline')
  return (
    <div className="grid grid-cols-[1fr_1.15fr_1.6fr] divide-x divide-paper/10 rounded-2xl bg-ink-deep/80 py-3 ring-1 ring-paper/10 sm:py-3.5">
      <div className="px-3.5">
        <p className="label text-dim">Viewers</p>
        <p className="num mt-1 text-lg font-semibold leading-none transition-colors duration-300 sm:text-xl" style={{ color: dropping ? '#ff6b5e' : '#f7eeec' }}>
          {fmtInt(sim.viewers)}
        </p>
      </div>
      <div className="px-3.5">
        <p className="label text-dim">Bitrate</p>
        <p className="num mt-1 text-lg font-semibold leading-none transition-colors duration-300 sm:text-xl" style={{ color: dead || sim.bitrate < 1.2 ? '#ff6b5e' : '#f7eeec' }}>
          {fmtMbps(dead ? 0 : sim.bitrate)}
          <span className="ml-1 text-[0.6875rem] font-medium text-dim">Mbps</span>
        </p>
      </div>
      <div className="px-3.5">
        <p className="label text-dim">Sinal</p>
        <div className="mt-1.5 flex items-center gap-1.5">
          {sim.links.map((l) => (
            <span
              key={l.id}
              className="whitespace-nowrap rounded-md px-1.5 py-1 text-[0.6875rem] font-semibold leading-none transition-colors duration-300"
              style={{
                background: l.up ? `${l.color}26` : 'rgb(255 69 58 / 0.16)',
                color: l.up ? l.color : '#ff6b5e',
                textDecoration: l.up ? 'none' : 'line-through',
              }}
            >
              {l.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function TrustBar() {
  const items = [
    ['Transmite para', 'Twitch, Kick e YouTube'],
    ['Ingests', 'Brasil, EUA e Europa'],
    ['Cobrança em real', 'Cartão ou Pix Automático'],
    ['Funciona com', 'iPhone, IRL Pro e Larix'],
  ]
  return (
    <div className="shell relative mt-14 lg:mt-20">
      <div className="hairline" />
      <ul className="grid grid-cols-2 gap-x-6 gap-y-5 py-6 lg:grid-cols-4 lg:py-7">
        {items.map(([k, v]) => (
          <li key={k}>
            <p className="label text-dim">{k}</p>
            <p className="mt-1.5 text-[0.9375rem] font-medium leading-snug text-paper sm:text-base">{v}</p>
          </li>
        ))}
      </ul>
      <div className="hairline" />
    </div>
  )
}
