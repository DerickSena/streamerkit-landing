import type { CSSProperties, PointerEvent, ReactNode } from 'react'
import { motion } from 'motion/react'

const EASE = [0.16, 1, 0.3, 1] as const

/** Bloco que sobe e aparece uma vez, quando entra na tela. */
export function Reveal({
  children,
  delay = 0,
  y = 30,
  className,
  style,
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  style?: CSSProperties
}) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

/** Cabeçalho padrão de seção: rótulo, título e parágrafo. */
export function SectionHead({
  kicker,
  title,
  children,
  className = '',
  id,
}: {
  kicker: string
  title: ReactNode
  children?: ReactNode
  className?: string
  id?: string
}) {
  return (
    <div className={`max-w-[46rem] ${className}`}>
      <Reveal y={16}>
        <p className="label mb-5 flex items-center gap-3 text-live">
          <span className="h-px w-8 bg-live" />
          {kicker}
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 id={id} className="headline text-[clamp(2.5rem,7.4vw,5rem)] text-paper">
          {title}
        </h2>
      </Reveal>
      {children && (
        <Reveal delay={0.12}>
          <p className="lede mt-6 max-w-[38rem]">{children}</p>
        </Reveal>
      )}
    </div>
  )
}

/** Guarda a posição do mouse em --mx/--my para a luz dos cartões (.card-spot). */
export function spot(e: PointerEvent<HTMLElement>) {
  const el = e.currentTarget
  const b = el.getBoundingClientRect()
  el.style.setProperty('--mx', `${e.clientX - b.left}px`)
  el.style.setProperty('--my', `${e.clientY - b.top}px`)
}
