import { useState, type ReactNode } from 'react'
import { Reveal, SectionHead, spot } from '../components/ui'
import { LiveVideo } from '../components/LiveVideo'
import { IconCloud, IconPower } from '../components/icons'

export function Bento() {
  return (
    <section id="recursos" className="section" aria-labelledby="recursos-titulo">
      <div className="shell">
        <SectionHead id="recursos-titulo" kicker="Tudo incluído" title="A live IRL inteira num lugar só.">
          Nada de juntar cinco serviços com fita. Bonding, OBS, overlays, multistream e equipe no mesmo painel.
        </SectionHead>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-6">
          <Card className="sm:col-span-2 lg:col-span-4" title="Preview das câmeras" text="Cada câmera aparece ao vivo no painel, com o bitrate que está chegando. A equipe vê o que entra antes de ir ao ar.">
            <div className="grid grid-cols-2 gap-3">
              <Cam n={1} mbps="5,8" src="/media/moto.mp4" poster="/media/moto.webp" />
              <Cam n={2} mbps="4,2" src="/media/praia.mp4" poster="/media/praia.webp" />
            </div>
          </Card>

          <Card className="lg:col-span-2" title="Multistream" text="Uma transmissão, até 4 destinos ao mesmo tempo, em todos os planos.">
            <ul className="grid gap-2">
              {[
                ['Twitch', '#9146ff'],
                ['Kick', '#53fc18'],
                ['YouTube', '#ff3b30'],
                ['RTMP personalizado', '#f7eeec'],
              ].map(([n, c], i) => (
                <li key={n} className="flex items-center gap-3 rounded-xl bg-paper/[0.045] px-3.5 py-2.5 text-sm font-medium">
                  <i className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />
                  {n}
                  <span className="ml-auto flex items-center gap-1.5 text-xs text-dim">
                    <i className="h-1.5 w-1.5 rounded-full bg-live" style={{ animation: `blink 1.6s ease-in-out ${i * 0.3}s infinite` }} />
                    no ar
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <Card
            className="lg:col-span-2"
            badge="Plano Avançado"
            title="OBS na nuvem"
            text="Um OBS Studio completo roda nos nossos servidores e você controla pelo navegador. O PC de casa pode ficar desligado."
          >
            <div className="flex min-h-28 items-stretch gap-3">
              <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl bg-paper/[0.045] py-4 text-dim">
                <IconPower className="h-6 w-6" />
                <span className="text-xs font-medium">PC desligado</span>
              </div>
              <div className="h-px w-6 flex-none self-center bg-paper/20" />
              <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl bg-live/10 py-4 text-paper ring-1 ring-live/40">
                <IconCloud className="h-6 w-6 text-live" />
                <span className="text-xs font-medium">OBS ligado</span>
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-2" title="Moderadores com permissões" text="Convide a equipe e escolha o que cada um pode mexer.">
            <Mods />
          </Card>

          <Card className="lg:col-span-2" title="Ingest perto de você" text="Seu encoder conecta no ingest mais próximo: menos distância, menos atraso.">
            <ul className="grid grid-cols-3 gap-2 text-center">
              {['Brasil', 'EUA', 'Europa'].map((p, i) => (
                <li key={p} className="flex min-h-28 flex-col justify-center rounded-xl bg-paper/[0.045] px-2 py-4">
                  <span className="relative mx-auto block h-2.5 w-2.5">
                    <i className="absolute inset-0 rounded-full bg-ok" />
                    <i className="absolute -inset-1.5 rounded-full border border-ok" style={{ animation: `ping 2s ease-out ${i * 0.5}s infinite` }} />
                  </span>
                  <span className="mt-3 block text-sm font-medium">{p}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="lg:col-span-2" title="H.265 (HEVC)" text="Envie H.265 por SRT e gaste menos dados móveis que com H.264, na mesma qualidade.">
            <div className="flex min-h-28 items-center gap-4 rounded-xl bg-paper/[0.045] p-4">
              <span className="num rounded-lg bg-live/15 px-3 py-2 text-lg font-bold text-[#ff8a7f]">HEVC</span>
              <span className="text-sm leading-snug text-mute">
                Mesma qualidade de imagem.
                <br />
                <span className="font-semibold text-paper">Menos dados do seu chip.</span>
              </span>
            </div>
          </Card>

          <Card className="lg:col-span-2" title="PiP com duas câmeras" text="Frontal e traseira ao mesmo tempo, uma num quadro menor. A equipe liga e desliga pelo navegador.">
            <div className="relative aspect-video overflow-hidden rounded-xl">
              <img
                src="/media/moto.webp"
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute right-2.5 top-2.5 aspect-video w-[34%] overflow-hidden rounded-lg ring-2 ring-white/85">
                <img src="/media/festa.webp" alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-[50%_30%]" />
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-2" title="Funciona com o seu app" text="No iPhone, o app StreamerKit. No Android e em outros aparelhos, qualquer app que envie SRT ou SRTLA.">
            <ul className="flex flex-wrap content-start gap-2">
              {['App StreamerKit (iPhone)', 'IRL Pro', 'Larix Broadcaster', 'OBS Studio', 'Qualquer encoder SRT'].map((a, i) => (
                <li
                  key={a}
                  className="rounded-full px-3 py-1.5 text-[0.8125rem] font-medium ring-1"
                  style={i === 0 ? { background: '#d92b21', color: '#fff', boxShadow: 'none' } : { boxShadow: 'inset 0 0 0 1px rgb(247 238 236 / 0.16)' }}
                >
                  {a}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </section>
  )
}

function Card({ title, text, children, className = '', badge }: { title: string; text: string; children: ReactNode; className?: string; badge?: string }) {
  return (
    <Reveal className={className}>
      <article
        onPointerMove={spot}
        className="card card-spot group flex h-full flex-col p-5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 sm:p-6"
      >
        <div className="mb-6 flex flex-1 flex-col [&>*]:flex-1">{children}</div>
        <div className="mt-auto">
          {badge && <p className="label mb-2.5 inline-block rounded-full bg-live/15 px-2.5 py-1 text-[#ff8a7f]">{badge}</p>}
          <h3 className="subhead text-[1.625rem] text-paper">{title}</h3>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-mute">{text}</p>
        </div>
      </article>
    </Reveal>
  )
}

function Cam({ n, mbps, src, poster }: { n: number; mbps: string; src: string; poster: string }) {
  return (
    <figure>
      <div className="relative aspect-video overflow-hidden rounded-xl">
        <LiveVideo src={src} poster={poster} className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105" />
      </div>
      <figcaption className="mt-2.5 flex items-center justify-between text-[0.8125rem]">
        <span className="flex items-center gap-2 font-semibold">
          <span className="live-dot" /> Câmera {n}
        </span>
        <span className="num text-mute">{mbps} Mbps</span>
      </figcaption>
    </figure>
  )
}

function Mods() {
  const [perm, setPerm] = useState({ Transmissões: true, Canvas: true, Ingests: false })
  return (
    <div className="rounded-xl bg-paper/[0.045] p-3.5">
      <p className="flex items-center gap-2.5 text-sm font-semibold">
        <i className="grid h-7 w-7 place-items-center rounded-full bg-info text-[0.625rem] font-bold not-italic text-ink">KM</i>
        kiko_mod
        <span className="ml-auto text-xs font-normal text-dim">Moderador</span>
      </p>
      <div className="mt-3 grid gap-1.5">
        {(Object.keys(perm) as (keyof typeof perm)[]).map((k) => (
          <button
            key={k}
            type="button"
            role="switch"
            aria-checked={perm[k]}
            onClick={() => setPerm((s) => ({ ...s, [k]: !s[k] }))}
            className="flex min-h-11 items-center justify-between gap-3 rounded-lg px-2 text-sm text-mute transition-colors duration-200 hover:bg-paper/[0.05]"
          >
            {k}
            <span className="switch scale-90" />
          </button>
        ))}
      </div>
    </div>
  )
}
