import { useState, type ReactNode } from 'react'
import { Reveal, SectionHead, spot } from '../components/ui'
import { LiveVideo } from '../components/LiveVideo'
import { IconCloud, IconPower } from '../components/icons'
import { useFmt, useT } from '../i18n'

export function Bento() {
  const t = useT()
  const { mbps } = useFmt()
  return (
    <section id="recursos" className="section" aria-labelledby="recursos-titulo">
      <div className="shell">
        <SectionHead id="recursos-titulo" kicker={t.bento.kicker} title={t.bento.title}>
          {t.bento.lede}
        </SectionHead>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-6">
          <Card className="sm:col-span-2 lg:col-span-4" title={t.bento.cams.title} text={t.bento.cams.text}>
            <div className="grid grid-cols-2 gap-3">
              <Cam n={1} mbps={mbps(5.8)} src="/media/moto.mp4" poster="/media/moto.webp" />
              <Cam n={2} mbps={mbps(4.2)} src="/media/praia.mp4" poster="/media/praia.webp" />
            </div>
          </Card>

          <Card className="lg:col-span-2" title={t.bento.multi.title} text={t.bento.multi.text}>
            <ul className="grid gap-2">
              {[
                ['Twitch', '#9146ff'],
                ['Kick', '#53fc18'],
                ['YouTube', '#ff3b30'],
                [t.bento.multi.rtmp, '#f7eeec'],
              ].map(([n, c], i) => (
                <li key={n} className="flex items-center gap-3 rounded-xl bg-paper/[0.045] px-3.5 py-2.5 text-sm font-medium">
                  <i className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />
                  {n}
                  <span className="ml-auto flex items-center gap-1.5 text-xs text-dim">
                    <i className="h-1.5 w-1.5 rounded-full bg-live" style={{ animation: `blink 1.6s ease-in-out ${i * 0.3}s infinite` }} />
                    {t.bento.multi.onAir}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <Card
            className="lg:col-span-2"
            badge={t.bento.obs.badge}
            title={t.bento.obs.title}
            text={t.bento.obs.text}
          >
            <div className="flex min-h-28 items-stretch gap-3">
              <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl bg-paper/[0.045] py-4 text-dim">
                <IconPower className="h-6 w-6" />
                <span className="text-xs font-medium">{t.bento.obs.pcOff}</span>
              </div>
              <div className="h-px w-6 flex-none self-center bg-paper/20" />
              <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl bg-live/10 py-4 text-paper ring-1 ring-live/40">
                <IconCloud className="h-6 w-6 text-live" />
                <span className="text-xs font-medium">{t.bento.obs.obsOn}</span>
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-2" title={t.bento.mods.title} text={t.bento.mods.text}>
            <Mods />
          </Card>

          <Card className="lg:col-span-2" title={t.bento.ingest.title} text={t.bento.ingest.text}>
            <ul className="grid grid-cols-3 gap-2 text-center">
              {t.bento.ingest.places.map((p, i) => (
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

          <Card className="lg:col-span-2" title={t.bento.h265.title} text={t.bento.h265.text}>
            <div className="flex min-h-28 items-center gap-4 rounded-xl bg-paper/[0.045] p-4">
              <span className="num rounded-lg bg-live/15 px-3 py-2 text-lg font-bold text-[#ff8a7f]">HEVC</span>
              <span className="text-sm leading-snug text-mute">
                {t.bento.h265.line1}
                <br />
                <span className="font-semibold text-paper">{t.bento.h265.line2}</span>
              </span>
            </div>
          </Card>

          <Card className="lg:col-span-2" title={t.bento.pip.title} text={t.bento.pip.text}>
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

          <Card className="lg:col-span-2" title={t.bento.apps.title} text={t.bento.apps.text}>
            <ul className="flex flex-wrap content-start gap-2">
              {t.bento.apps.list.map((a, i) => (
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
  const t = useT()
  return (
    <figure>
      <div className="relative aspect-video overflow-hidden rounded-xl">
        <LiveVideo src={src} poster={poster} className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105" />
      </div>
      <figcaption className="mt-2.5 flex items-center justify-between text-[0.8125rem]">
        <span className="flex items-center gap-2 font-semibold">
          <span className="live-dot" /> {`${t.bento.cams.cam} ${n}`}
        </span>
        <span className="num text-mute">{mbps} Mbps</span>
      </figcaption>
    </figure>
  )
}

function Mods() {
  const t = useT()
  const [perm, setPerm] = useState([true, true, false])
  return (
    <div className="rounded-xl bg-paper/[0.045] p-3.5">
      <p className="flex items-center gap-2.5 text-sm font-semibold">
        <i className="grid h-7 w-7 place-items-center rounded-full bg-info text-[0.625rem] font-bold not-italic text-ink">KM</i>
        kiko_mod
        <span className="ml-auto text-xs font-normal text-dim">{t.bento.mods.role}</span>
      </p>
      <div className="mt-3 grid gap-1.5">
        {perm.map((on, i) => (
          <button
            key={i}
            type="button"
            role="switch"
            aria-checked={on}
            onClick={() => setPerm((s) => s.map((v, j) => (j === i ? !v : v)))}
            className="flex min-h-11 items-center justify-between gap-3 rounded-lg px-2 text-sm text-mute transition-colors duration-200 hover:bg-paper/[0.05]"
          >
            {t.bento.mods.perms[i]}
            <span className="switch scale-90" />
          </button>
        ))}
      </div>
    </div>
  )
}
