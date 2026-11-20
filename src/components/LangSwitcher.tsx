import { useEffect, useRef, useState } from 'react'
import { IconCheck, IconGlobe } from './icons'
import { LOCALES, STORAGE_KEY, useLocale, useT, type Locale } from '../i18n'

/** Guarda a escolha, para a detecção automática não trocar o idioma de novo. */
export function rememberLocale(id: Locale) {
  try {
    localStorage.setItem(STORAGE_KEY, id)
  } catch {
    // navegador sem armazenamento (modo privado antigo): segue sem lembrar
  }
}

/** Botão de idioma do topo: globo + sigla, abre a lista dos 4 idiomas. */
export function LangSwitcher() {
  const t = useT()
  const locale = useLocale()
  const [open, setOpen] = useState(false)
  const wrap = useRef<HTMLDivElement>(null)
  const current = LOCALES.find((l) => l.id === locale) ?? LOCALES[0]

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={wrap} className="relative">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`${t.nav.langAria}: ${current.label}`}
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 items-center gap-1.5 rounded-[0.7rem] px-2.5 text-[0.875rem] font-semibold text-mute transition-colors duration-200 hover:bg-paper/[0.06] hover:text-paper"
      >
        <IconGlobe className="h-[1.125rem] w-[1.125rem]" />
        <span className="num text-[0.8125rem]">{current.short}</span>
      </button>

      <ul
        className="absolute right-0 top-full z-10 mt-2 w-60 origin-top-right rounded-2xl bg-ink-raised p-1.5 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.9)] ring-1 ring-paper/12 transition-[opacity,transform,visibility] duration-200 ease-out"
        style={{
          opacity: open ? 1 : 0,
          transform: open ? 'none' : 'translateY(-6px) scale(0.98)',
          visibility: open ? 'visible' : 'hidden',
        }}
      >
        {LOCALES.map((l) => {
          const active = l.id === locale
          return (
            <li key={l.id}>
              <a
                href={l.path}
                hrefLang={l.hreflang[0]}
                lang={l.hreflang[0]}
                aria-current={active ? 'true' : undefined}
                onClick={() => rememberLocale(l.id)}
                className="flex min-h-11 items-center justify-between gap-3 rounded-xl px-3 text-[0.9375rem] font-medium transition-colors duration-150 hover:bg-paper/[0.07]"
                style={{ color: active ? '#f7eeec' : '#b8a3a0' }}
              >
                {l.label}
                {active && <IconCheck className="h-4 w-4 text-live" />}
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
