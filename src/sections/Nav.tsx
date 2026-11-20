import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { LINKS } from '../lib/site'

const ITEMS = [
  ['Como segura', '#bonding'],
  ['Controle remoto', '#controle'],
  ['Overlays', '#canvas'],
  ['Planos', '#planos'],
  ['Dúvidas', '#duvidas'],
]

export function Nav() {
  const [solid, setSolid] = useState(false)
  const { scrollYProgress } = useScroll()
  const bar = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.4 })

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500"
      style={{
        background: solid ? 'rgb(20 4 4 / 0.82)' : 'transparent',
        backdropFilter: solid ? 'blur(14px) saturate(1.3)' : 'none',
        WebkitBackdropFilter: solid ? 'blur(14px) saturate(1.3)' : 'none',
        boxShadow: solid ? 'inset 0 -1px 0 rgb(247 238 236 / 0.08)' : 'none',
      }}
    >
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-10 focus:rounded-lg focus:bg-paper focus:px-4 focus:py-2 focus:text-ink"
      >
        Pular para o conteúdo
      </a>
      <div className="shell flex h-16 items-center justify-between gap-4 sm:h-[4.5rem]">
        <a href="#topo" aria-label="StreamerKit, início" className="flex-none">
          <img src="/logo-horizontal-light.svg" alt="StreamerKit" width={134} height={36} className="h-8 w-auto sm:h-9" />
        </a>
        <nav aria-label="Seções" className="hidden items-center gap-7 lg:flex">
          {ITEMS.map(([t, h]) => (
            <a
              key={h}
              href={h}
              className="group relative py-2 text-[0.9375rem] font-medium text-mute transition-colors duration-200 hover:text-paper"
            >
              {t}
              <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-live transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <a href={LINKS.login} className="btn btn-ghost btn-sm">
            Entrar
          </a>
          <a href={LINKS.plans} className="btn btn-primary btn-sm hidden sm:inline-flex">
            Escolher um plano
          </a>
        </div>
      </div>
      <motion.div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px origin-left bg-live" style={{ scaleX: bar, opacity: solid ? 1 : 0 }} />
    </header>
  )
}
