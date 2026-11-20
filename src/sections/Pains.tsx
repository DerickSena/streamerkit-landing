import { Reveal, SectionHead } from '../components/ui'
import { IconArrow } from '../components/icons'
import { useT } from '../i18n'

// Destino de cada item, na mesma ordem de t.pains.items.
const HREFS = ['#bonding', '#bonding', '#controle', '#planos']

export function Pains() {
  const t = useT()
  const pains = t.pains.items.map((p, i) => ({ ...p, href: HREFS[i] }))
  return (
    <section className="section" aria-labelledby="dores-titulo">
      <div className="shell">
        <SectionHead
          id="dores-titulo"
          kicker={t.pains.kicker}
          title={
            <>
              {t.pains.title[0]}
              <span className="text-live">{t.pains.title[1]}</span>
              {t.pains.title[2]}
            </>
          }
        >
          {t.pains.lede}
        </SectionHead>

        <ol className="mt-14 lg:mt-20">
          {pains.map((p, i) => (
            <li key={p.title}>
              <Reveal delay={i * 0.05} y={22}>
                <a
                  href={p.href}
                  className="group relative grid gap-x-10 gap-y-3 border-t border-paper/10 py-7 transition-colors duration-300 hover:bg-paper/[0.025] sm:py-9 lg:grid-cols-[5rem_minmax(0,1.15fr)_minmax(0,1fr)_auto] lg:items-center lg:px-4"
                >
                  <span className="absolute inset-x-0 top-[-1px] h-px origin-left scale-x-0 bg-live transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
                  <span className="num text-sm text-dim transition-colors duration-300 group-hover:text-live">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="subhead text-[clamp(1.6rem,3.4vw,2.35rem)] text-paper">{p.title}</h3>
                  <p className="max-w-[34rem] text-[0.9875rem] leading-relaxed text-mute lg:text-base">{p.text}</p>
                  <span className="mt-2 inline-flex w-fit items-center gap-2.5 rounded-full bg-paper/[0.06] py-2 pl-3.5 pr-3 text-sm font-medium text-paper ring-1 ring-paper/10 transition-[background-color,box-shadow] duration-300 group-hover:bg-cta group-hover:ring-cta lg:mt-0">
                    <span className="label !tracking-[0.1em] text-dim transition-colors duration-300 group-hover:text-white/80">
                      {t.pains.resolve}
                    </span>
                    {p.fix}
                    <IconArrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </a>
              </Reveal>
            </li>
          ))}
        </ol>
        <div className="border-t border-paper/10" />
      </div>
    </section>
  )
}
