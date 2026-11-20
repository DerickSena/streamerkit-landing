import { Reveal, SectionHead, spot } from '../components/ui'
import { useT } from '../i18n'

/** Depoimentos de streamers, logo antes dos planos. Sem foto e sem nota: só a frase e quem disse. */
export function Testimonials() {
  const t = useT()
  const [open, close] = t.testimonials.marks
  return (
    <section id="depoimentos" className="section pb-0" aria-labelledby="depoimentos-titulo">
      <div className="shell">
        <SectionHead id="depoimentos-titulo" kicker={t.testimonials.kicker} title={t.testimonials.title} />

        <div className="mt-10 grid gap-4 md:grid-cols-3 lg:mt-14">
          {t.testimonials.items.map((item, i) => (
            <Reveal key={item.author} delay={i * 0.08}>
              <figure onPointerMove={spot} className="card card-spot flex h-full flex-col p-6 sm:p-8">
                <blockquote className="subhead text-[clamp(1.5rem,1.2rem+1vw,1.875rem)] text-paper text-pretty">
                  <p>
                    {open}
                    {item.quote}
                    {close}
                  </p>
                </blockquote>
                <figcaption className="label mt-auto flex items-center gap-3 pt-8 text-mute">
                  <span aria-hidden="true" className="h-px w-6 bg-live" />
                  {item.author}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
