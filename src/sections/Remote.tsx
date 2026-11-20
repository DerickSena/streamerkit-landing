import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useInView } from 'motion/react'
import { Reveal, SectionHead } from '../components/ui'
import { AppPanel, Phone, type LinkStat } from '../components/Phone'
import { LiveVideo } from '../components/LiveVideo'
import { TorchCanvas } from '../components/TorchCanvas'
import {
  IconArrow,
  IconEye,
  IconFlip,
  IconGauge,
  IconMic,
  IconMicOff,
  IconPip,
  IconPlay,
  IconReload,
  IconStop,
  IconTorch,
  IconZoom,
} from '../components/icons'
import { LINKS, fmtMbps } from '../lib/site'

type Cam = 'back' | 'front'
type Zoom = 0.5 | 1 | 2
const ZOOM_SCALE: Record<number, number> = { 0.5: 1, 1: 1.42, 2: 2.3 }

export function Remote() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '120px 0px' })

  const [sending, setSending] = useState(true)
  const [muted, setMuted] = useState(false)
  const [torch, setTorch] = useState(false)
  const [cam, setCam] = useState<Cam>('back')
  const [zoom, setZoom] = useState<Zoom>(1)
  const [target, setTarget] = useState(4)
  const [pip, setPip] = useState(false)
  const [goal, setGoal] = useState(true)
  const [reloading, setReloading] = useState(false)
  const [last, setLast] = useState('Nenhuma ainda. Mexa nos controles.')

  // O bitrate real persegue o alvo, com a oscilação normal de rede móvel.
  const [live, setLive] = useState({ bitrate: 4, history: Array.from({ length: 26 }, () => 4), mic: 0.6, n: 0 })
  const tRef = useRef({ target, sending })
  tRef.current = { target, sending }
  useEffect(() => {
    if (!inView) return
    const iv = setInterval(() => {
      setLive((s) => {
        const goalB = tRef.current.sending ? tRef.current.target : 0
        const n = s.n + 1
        const wob = tRef.current.sending ? Math.sin(n * 0.8) * 0.12 + Math.sin(n * 0.31) * 0.08 : 0
        const bitrate = Math.max(0, s.bitrate + (goalB - s.bitrate) * 0.22 + wob * 0.25)
        return { bitrate, history: [...s.history.slice(1), bitrate], mic: 0.35 + Math.abs(Math.sin(n * 1.3)) * 0.55, n }
      })
    }, 240)
    return () => clearInterval(iv)
  }, [inView])

  const act = (text: string, fn: () => void) => {
    fn()
    setLast(text)
  }

  const reloadTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(reloadTimer.current), [])
  const reload = () => {
    setLast('Mod recarregou os widgets')
    setReloading(true)
    clearTimeout(reloadTimer.current)
    reloadTimer.current = setTimeout(() => setReloading(false), 1300)
  }

  const quality = !sending ? 1 : live.bitrate >= 3.2 ? 1 : live.bitrate >= 2.2 ? 0.8 : live.bitrate >= 1.5 ? 0.6 : 0.42
  const share = 58 + Math.sin(live.n * 0.2) * 5
  const links: LinkStat[] = [
    { id: '4g', label: '4G', pct: share, color: '#30d158', up: sending },
    { id: 'wifi', label: 'Wi-Fi', pct: 100 - share, color: '#3b9bff', up: sending },
  ]
  const torchOn = torch && cam === 'back'

  return (
    <section id="controle" className="section" aria-labelledby="controle-titulo">
      <div className="shell">
        <SectionHead
          id="controle-titulo"
          kicker="Só aqui · App StreamerKit para iPhone"
          title={
            <>
              Você faz a live. <span className="text-live">Sua equipe cuida do celular.</span>
            </>
          }
        >
          Pelo navegador, de qualquer lugar, seus mods trocam a câmera, dão zoom, acendem a lanterna e seguram o
          bitrate. Você não tira o olho do rolê.
        </SectionHead>

        <Reveal delay={0.05}>
          <p className="mt-10 inline-flex items-center gap-2.5 rounded-full bg-paper px-4 py-2 text-sm font-semibold text-ink lg:mt-12">
            <span className="live-dot" />
            Faça o papel do mod: mexa nos controles e veja o celular responder
          </p>
        </Reveal>

        <div ref={ref} className="mt-6 lg:grid lg:grid-cols-[minmax(0,1.42fr)_minmax(0,1fr)] lg:gap-8">
          {/* Celular: fica preso no topo no celular para a pessoa ver o efeito enquanto toca nos botões */}
          <div className="sticky top-[4.25rem] z-20 -mx-[clamp(1.125rem,4vw,3rem)] bg-ink/95 px-[clamp(1.125rem,4vw,3rem)] pb-3 pt-2 backdrop-blur-sm lg:static lg:top-28 lg:mx-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
            <div className="lg:sticky lg:top-28">
              <Phone>
                <div className="relative min-w-0 flex-1 overflow-hidden">
                  <div
                    className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{ transform: `scale(${ZOOM_SCALE[zoom]})`, transformOrigin: cam === 'back' ? '36% 34%' : '50% 42%' }}
                  >
                    <div className="absolute inset-0 transition-opacity duration-300" style={{ opacity: cam === 'back' ? 1 : 0 }}>
                      <TorchCanvas
                        src="/media/lanterna.mp4"
                        poster="/media/lanterna.webp"
                        on={torchOn}
                        playing={sending && cam === 'back'}
                        quality={quality}
                        className="absolute inset-0"
                      />
                    </div>
                    <div className="absolute inset-0 transition-opacity duration-300" style={{ opacity: cam === 'front' ? 1 : 0 }}>
                      <LiveVideo
                        src="/media/festa.mp4"
                        poster="/media/festa.webp"
                        playing={sending && cam === 'front'}
                        quality={cam === 'front' ? quality : 1}
                        className="absolute inset-0"
                        objectPosition="50% 30%"
                      />
                    </div>
                  </div>

                  {/* PiP: a outra câmera num quadro menor */}
                  <AnimatePresence>
                    {pip && (
                      <motion.div
                        key="pip"
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                        className="absolute right-[2cqw] top-[2cqw] z-10 aspect-video w-[30%] origin-top-right overflow-hidden rounded-[1.6cqw] ring-[0.25cqw] ring-white/80"
                      >
                        {cam === 'back' ? (
                          <LiveVideo src="/media/festa.mp4" poster="/media/festa.webp" playing={sending} className="absolute inset-0" objectPosition="50% 30%" />
                        ) : (
                          <LiveVideo src="/media/moto.mp4" poster="/media/moto.webp" playing={sending} className="absolute inset-0" />
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* widget "Meta do dia" desenhado sobre a câmera */}
                  <AnimatePresence>
                    {goal && !reloading && (
                      <motion.div
                        key="goal"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-[2.2cqw] left-[7.4cqw] z-10 w-[26cqw] rounded-[1.2cqw] bg-black/65 p-[1.1cqw] text-white"
                      >
                        <div className="flex items-center justify-between text-[1.25cqw] font-semibold leading-none">
                          <span>Meta do dia</span>
                          <span className="num">64%</span>
                        </div>
                        <div className="mt-[0.8cqw] h-[0.7cqw] overflow-hidden rounded-full bg-white/20">
                          <motion.div className="h-full rounded-full bg-live" initial={{ width: 0 }} animate={{ width: '64%' }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="absolute left-[7.2cqw] top-[2cqw] z-10 flex items-center gap-[0.8cqw]">
                    <span className="app-pill">
                      <IconEye />
                      <span className="num">1.2K</span>
                    </span>
                    {muted && (
                      <span className="app-pill" style={{ background: 'rgb(255 69 58 / 0.92)' }}>
                        <IconMicOff /> Mudo
                      </span>
                    )}
                    {torchOn && (
                      <span className="app-pill" style={{ background: '#f2f2f5', color: '#121216' }}>
                        <IconTorch /> Lanterna
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-[2cqw] right-[2cqw] z-10 flex items-center gap-[0.6cqw]">
                    <span className="app-pill !gap-[0.3cqw] !px-[0.5cqw]">
                      {([0.5, 1, 2] as Zoom[]).map((z) => (
                        <span
                          key={z}
                          className="rounded-full px-[0.8cqw] py-[0.25cqw] transition-colors duration-300"
                          style={{ background: zoom === z ? '#fff' : 'transparent', color: zoom === z ? '#000' : 'rgb(255 255 255 / 0.55)' }}
                        >
                          {z}
                        </span>
                      ))}
                    </span>
                    <span className="app-pill">{cam === 'back' ? 'Traseira' : 'Frontal'}</span>
                  </div>

                  <AnimatePresence>
                    {!sending && (
                      <motion.div
                        key="stopped"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-20 grid place-items-center bg-black/70"
                      >
                        <p className="rounded-full bg-black/80 px-[2.6cqw] py-[1.3cqw] text-[2.2cqw] font-semibold leading-none">Envio pausado pelo mod</p>
                      </motion.div>
                    )}
                    {reloading && (
                      <motion.div
                        key="reload"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-[2.2cqw] left-[7.4cqw] z-10 flex items-center gap-[1cqw] rounded-full bg-black/70 px-[1.6cqw] py-[0.9cqw] text-[1.3cqw] font-semibold leading-none"
                      >
                        <IconReload style={{ width: '1.5cqw', height: '1.5cqw', animation: 'spin 0.8s linear infinite' }} />
                        Recarregando widgets
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <AppPanel
                  bitrate={live.bitrate}
                  history={live.history}
                  links={links}
                  muted={muted}
                  torch={torchOn}
                  pip={pip}
                  sending={sending}
                  reloading={reloading}
                  micLevel={live.mic}
                />
              </Phone>

              <p className="sr-only" aria-live="polite">
                {last}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 px-1 text-[0.8125rem] sm:text-sm">
                <span className="flex items-center gap-2 font-semibold" style={{ color: sending ? '#f7eeec' : '#8f7a77' }}>
                  <span className={sending ? 'live-dot' : 'h-2 w-2 rounded-full bg-dim'} />
                  {sending ? 'Ao vivo' : 'Parado'}
                </span>
                <span className="num text-mute">4G + Wi-Fi</span>
                <span className="num text-mute">{fmtMbps(sending ? live.bitrate : 0)} Mbps</span>
                <span className="hidden truncate text-dim sm:inline" aria-hidden="true">
                  <span className="label mr-2">Última ação</span>
                  {last}
                </span>
              </div>

              <div className="mt-8 hidden border-t border-paper/10 pt-7 lg:block">
                <p className="label text-dim">O que a equipe controla daqui</p>
                <ul className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2.5 text-[0.9375rem] text-paper xl:grid-cols-3">
                  {['Câmera frontal e traseira', 'Zoom', 'PiP com duas câmeras', 'Microfone', 'Lanterna', 'Bitrate', 'Iniciar e parar o envio', 'Widgets no celular', 'Qualidade de cada conexão'].map((t) => (
                    <li key={t} className="flex items-center gap-2.5">
                      <i className="h-1.5 w-1.5 flex-none rounded-full bg-live" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Painel do mod */}
          <Reveal delay={0.1} className="mt-4 lg:mt-0">
            <div className="dash p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="flex items-center gap-2 rounded-full bg-black/35 px-3 py-1.5 text-sm font-medium ring-1 ring-dash-line">
                  <span className="h-2 w-2 rounded-full" style={{ background: sending ? '#30d158' : '#8f7a77' }} />
                  iPhone do streamer
                </p>
                <p className="label text-[#bcb2b0]">Painel do mod</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  className="dash-key"
                  style={sending ? { background: '#c62828', boxShadow: 'none', color: '#fff' } : { background: '#2e7d32', boxShadow: 'none', color: '#fff' }}
                  onClick={() => act(sending ? 'Mod parou o envio' : 'Mod iniciou o envio', () => setSending((v) => !v))}
                >
                  {sending ? <IconStop className="mb-auto h-5 w-5" /> : <IconPlay className="mb-auto h-5 w-5" />}
                  <span className="k-title">{sending ? 'Parar de enviar' : 'Iniciar envio'}</span>
                  <span className="k-sub">{sending ? 'Enviando' : 'Parado'}</span>
                </button>
                <button
                  type="button"
                  className="dash-key"
                  aria-pressed={muted}
                  onClick={() => act(muted ? 'Mod ligou o microfone' : 'Mod mutou o microfone', () => setMuted((v) => !v))}
                >
                  {muted ? <IconMicOff className="mb-auto h-5 w-5" /> : <IconMic className="mb-auto h-5 w-5" />}
                  <span className="k-title">{muted ? 'Desmutar' : 'Mutar'}</span>
                  <span className="k-sub">{muted ? 'Microfone mutado' : 'Microfone ligado'}</span>
                </button>
                <button
                  type="button"
                  className="dash-key"
                  aria-pressed={torchOn}
                  disabled={cam === 'front'}
                  style={cam === 'front' ? { opacity: 0.45 } : undefined}
                  onClick={() => act(torch ? 'Mod apagou a lanterna' : 'Mod acendeu a lanterna', () => setTorch((v) => !v))}
                >
                  <IconTorch className="mb-auto h-5 w-5" />
                  <span className="k-title">{torchOn ? 'Apagar lanterna' : 'Ligar lanterna'}</span>
                  <span className="k-sub">{cam === 'front' ? 'Só na câmera traseira' : torchOn ? 'Lanterna acesa' : 'Lanterna desligada'}</span>
                </button>
                <button type="button" className="dash-key" onClick={reload}>
                  <IconReload className="mb-auto h-5 w-5" style={reloading ? { animation: 'spin 0.8s linear infinite' } : undefined} />
                  <span className="k-title">Recarregar widgets</span>
                  <span className="k-sub">{reloading ? 'Recarregando' : 'Alertas e metas'}</span>
                </button>
              </div>

              <Row icon={<IconFlip className="h-4 w-4" />} label="Cena">
                <div className="seg" role="group" aria-label="Câmera">
                  {(['back', 'front'] as Cam[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      aria-pressed={cam === c}
                      onClick={() => act(`Mod trocou para a câmera ${c === 'back' ? 'traseira' : 'frontal'}`, () => setCam(c))}
                    >
                      {c === 'back' ? 'Traseira' : 'Frontal'}
                    </button>
                  ))}
                </div>
              </Row>

              <Row icon={<IconZoom className="h-4 w-4" />} label="Zoom">
                <div className="seg" role="group" aria-label="Zoom">
                  {([0.5, 1, 2] as Zoom[]).map((z) => (
                    <button key={z} type="button" aria-pressed={zoom === z} onClick={() => act(`Mod ajustou o zoom para ${z}x`, () => setZoom(z))}>
                      {z}x
                    </button>
                  ))}
                </div>
              </Row>

              <div className="mt-2.5 rounded-[0.85rem] bg-dash-raised px-3.5 pb-1 pt-3 ring-1 ring-dash-line">
                <div className="flex items-center justify-between gap-3">
                  <label htmlFor="bitrate" className="flex items-center gap-2 text-sm font-medium text-[#bcb2b0]">
                    <IconGauge className="h-4 w-4" /> Bitrate
                  </label>
                  <p className="text-sm">
                    <span className="font-semibold [font-stretch:88%]">Alvo de {fmtMbps(target)} Mb/s</span>
                    <span className="num ml-2 text-xs text-[#bcb2b0]">enviando {fmtMbps(sending ? live.bitrate : 0)}</span>
                  </p>
                </div>
                <input
                  id="bitrate"
                  type="range"
                  className="range"
                  min={1}
                  max={8}
                  step={0.5}
                  value={target}
                  style={{ ['--fill' as string]: `${((target - 1) / 7) * 100}%` }}
                  onChange={(e) => act(`Mod mudou o bitrate para ${fmtMbps(+e.target.value)} Mb/s`, () => setTarget(+e.target.value))}
                />
              </div>

              <Toggle
                icon={<IconPip className="h-4 w-4" />}
                title="Picture-in-Picture"
                sub={pip ? `${cam === 'back' ? 'Frontal' : 'Traseira'}, 30%` : 'Desligado'}
                on={pip}
                onChange={() => act(pip ? 'Mod desligou o PiP' : 'Mod ligou o PiP com as duas câmeras', () => setPip((v) => !v))}
              />

              <p className="label mb-1 mt-5 text-[#bcb2b0]">Widgets</p>
              <Toggle
                title="Meta do dia"
                sub="https://overlay/meta"
                on={goal}
                onChange={() => act(goal ? 'Mod escondeu a meta do dia' : 'Mod mostrou a meta do dia', () => setGoal((v) => !v))}
              />

              <p className="mt-4 text-xs leading-relaxed text-[#8f8583]">Simulação: nada aqui se conecta a uma live de verdade.</p>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-10 flex flex-col gap-4 border-t border-paper/10 pt-8 sm:flex-row sm:items-center sm:justify-between lg:mt-14">
          <p className="max-w-[40rem] text-[0.9875rem] leading-relaxed text-mute">
            Os widgets também saem dali: cole o link do alerta ou da meta uma vez, posicione arrastando e ele aparece no
            celular. E a equipe vê a qualidade de cada conexão, Wi-Fi e rede móvel, em tempo real.
          </p>
          <a href={LINKS.plans} className="btn btn-primary flex-none">
            Quero isso na minha live
            <IconArrow className="h-5 w-5" />
          </a>
        </Reveal>
      </div>
    </section>
  )
}

function Row({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="mt-2.5 grid grid-cols-[5.25rem_minmax(0,1fr)] items-center gap-3 rounded-[0.85rem] bg-dash-raised py-1.5 pl-3.5 pr-1.5 ring-1 ring-dash-line">
      <p className="flex items-center gap-2 text-sm font-medium text-[#bcb2b0]">
        {icon} {label}
      </p>
      {children}
    </div>
  )
}

function Toggle({ icon, title, sub, on, onChange }: { icon?: ReactNode; title: string; sub: string; on: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onChange}
      className="mt-2.5 flex min-h-[3.5rem] w-full items-center gap-3 rounded-[0.85rem] bg-dash-raised px-3.5 py-2.5 text-left ring-1 ring-dash-line transition-shadow duration-200 hover:ring-paper/30"
    >
      {icon && <span className="text-[#bcb2b0]">{icon}</span>}
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold leading-tight [font-stretch:88%]">{title}</span>
        <span className="mt-0.5 block truncate text-xs text-[#bcb2b0]">{sub}</span>
      </span>
      <span className="switch" />
    </button>
  )
}
