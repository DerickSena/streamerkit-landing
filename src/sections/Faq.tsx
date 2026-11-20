import { Reveal, SectionHead } from '../components/ui'
import { IconArrow, IconPlus } from '../components/icons'
import { FAQ, LINKS } from '../lib/site'

export function Faq() {
  return (
    <section id="duvidas" className="section bg-ink-deep" aria-labelledby="duvidas-titulo">
      <div className="hairline absolute inset-x-0 top-0" />
      <div className="shell grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHead id="duvidas-titulo" kicker="Dúvidas" title="O que todo mundo pergunta antes de assinar.">
            Não achou a sua? A gente responde no Discord.
          </SectionHead>
          <Reveal delay={0.15}>
            <a href={LINKS.discord} target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-7">
              Perguntar no Discord
              <IconArrow className="h-5 w-5" />
            </a>
          </Reveal>
        </div>

        <Reveal delay={0.05}>
          <div className="border-b border-paper/10">
            {FAQ.map((f, i) => (
              <details key={f.q} className="group border-t border-paper/10" open={i === 0}>
                <summary className="flex min-h-[4.25rem] items-center justify-between gap-6 py-5 text-[1.0625rem] font-semibold leading-snug text-paper transition-colors duration-200 [font-stretch:90%] hover:text-white sm:text-[1.1875rem]">
                  {f.q}
                  <span className="grid h-9 w-9 flex-none place-items-center rounded-full ring-1 ring-paper/20 transition-colors duration-300 group-open:bg-cta group-open:ring-cta">
                    <IconPlus className="faq-plus h-4 w-4" />
                  </span>
                </summary>
                <p className="max-w-[44rem] pb-7 pr-12 text-[0.9875rem] leading-relaxed text-mute">{f.a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
