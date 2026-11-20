import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { Reveal, SectionHead } from '../components/ui'
import { useT } from '../i18n'

export function Steps() {
  const t = useT()
  const ref = useRef<HTMLOListElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.55'] })
  const scale = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section id="como-funciona" className="section bg-ink-deep" aria-labelledby="passos-titulo">
      <div className="hairline absolute inset-x-0 top-0" />
      <div className="shell">
        <SectionHead id="passos-titulo" kicker={t.steps.kicker} title={t.steps.title}>
          {t.steps.lede}
        </SectionHead>

        <div className="relative mt-14 lg:mt-20">
          <div aria-hidden="true" className="absolute left-0 top-0 hidden h-px w-full bg-paper/12 lg:block" />
          <motion.div
            aria-hidden="true"
            className="absolute left-0 top-0 hidden h-px w-full origin-left bg-live lg:block"
            style={reduce ? undefined : { scaleX: scale }}
          />
          <ol ref={ref} className="relative grid gap-10 lg:grid-cols-3 lg:gap-8">
          {t.steps.items.map((s, i) => (
            <li key={s.title} className="relative lg:pt-10">
              <Reveal delay={i * 0.1}>
                <span aria-hidden="true" className="absolute left-0 top-[-5px] hidden h-[11px] w-[11px] rounded-full bg-live ring-4 ring-ink-deep lg:block" />
                <p className="display text-[clamp(4.5rem,10vw,7.5rem)] text-paper/[0.13]">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="subhead -mt-4 text-[clamp(1.75rem,3vw,2.25rem)] text-paper sm:-mt-6">{s.title}</h3>
                <p className="mt-3 max-w-[24rem] text-[0.9875rem] leading-relaxed text-mute">{s.text}</p>
              </Reveal>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
