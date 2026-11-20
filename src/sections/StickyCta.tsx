import { useEffect, useState } from 'react'
import { IconArrow } from '../components/icons'
import { LINKS } from '../lib/site'
import { useT } from '../i18n'

/** Barra fixa no celular: aparece depois do topo e some nos planos e no fim da página. */
export function StickyCta() {
  const t = useT()
  const [show, setShow] = useState(false)
  useEffect(() => {
    const on = () => {
      const y = window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      const plans = document.getElementById('planos')
      const r = plans?.getBoundingClientRect()
      const inPlans = r ? r.top < window.innerHeight * 0.7 && r.bottom > 120 : false
      setShow(y > 620 && y < max - 520 && !inPlans)
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-6 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:hidden"
      style={{
        transform: show ? 'translateY(0)' : 'translateY(120%)',
        background: 'linear-gradient(to top, rgb(11 2 2 / 0.96) 60%, transparent)',
      }}
      aria-hidden={!show}
    >
      <a href={LINKS.plans} tabIndex={show ? 0 : -1} className="btn btn-primary w-full justify-between !px-5">
        <span>{t.common.choosePlan}</span>
        <span className="flex items-center gap-2 text-sm font-medium text-white/85">
          {t.sticky.from} <IconArrow className="h-5 w-5" />
        </span>
      </a>
    </div>
  )
}
