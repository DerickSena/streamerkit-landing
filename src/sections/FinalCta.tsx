import { Reveal } from '../components/ui'
import { IconArrow } from '../components/icons'
import { LINKS } from '../lib/site'
import { useT } from '../i18n'

export function FinalCta() {
  const t = useT()
  return (
    <section className="relative overflow-hidden pb-10 pt-[clamp(5rem,11vw,10rem)]" aria-labelledby="cta-titulo">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(60% 70% at 50% 100%, rgb(255 42 28 / 0.28), transparent 70%)' }}
      />
      <div className="shell relative text-center">
        <Reveal y={16}>
          <p className="label mb-6 flex items-center justify-center gap-2.5 text-mute">
            <span className="live-dot" /> {t.final.kicker}
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 id="cta-titulo" className="display mx-auto text-[clamp(3.6rem,13.5vw,10.5rem)]">
            <span className="block">{t.final.title[0]}</span>
            <span className="block text-live">{t.final.title[1]}</span>
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="lede mx-auto mt-7 max-w-[36rem]">
            {t.final.lede}
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <div className="mt-9 flex flex-col items-center gap-4">
            <a href={LINKS.plans} className="btn btn-primary !min-h-[3.75rem] w-full max-w-[22rem] !text-lg">
              {t.common.choosePlan}
              <IconArrow className="h-5 w-5" />
            </a>
            <p className="text-sm text-dim">{t.final.micro}</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
