import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { pt, type Dict } from './pt'
import { en } from './en'
import { es419 } from './es419'
import { es } from './es'

export type { Dict }
export type Locale = 'pt' | 'en' | 'es' | 'es-419'

/** Mesmos endereços e hreflang do site atual do StreamerKit. */
export const LOCALES: { id: Locale; path: string; label: string; short: string; hreflang: string[] }[] = [
  { id: 'pt', path: '/', label: 'Português', short: 'PT', hreflang: ['pt-BR'] },
  { id: 'en', path: '/en/', label: 'English', short: 'EN', hreflang: ['en'] },
  { id: 'es', path: '/es/', label: 'Español (España)', short: 'ES', hreflang: ['es-ES'] },
  { id: 'es-419', path: '/es-419/', label: 'Español (Latinoamérica)', short: 'ES', hreflang: ['es', 'es-419'] },
]

export const DICTS: Record<Locale, Dict> = { pt, en, es, 'es-419': es419 }

/** Chave do navegador onde fica o idioma que a pessoa escolheu. O script do index.html usa a mesma. */
export const STORAGE_KEY = 'sk-lang'

export function localeFromPath(pathname: string): Locale {
  const seg = pathname.split('/')[1] ?? ''
  return seg === 'en' || seg === 'es' || seg === 'es-419' ? seg : 'pt'
}

const Ctx = createContext<{ locale: Locale; t: Dict }>({ locale: 'pt', t: pt })

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const value = useMemo(() => ({ locale, t: DICTS[locale] }), [locale])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

/** Textos do idioma atual. */
export const useT = () => useContext(Ctx).t
export const useLocale = () => useContext(Ctx).locale

/** Troca {chave} pelo valor: fill('{n} de 3', { n: 2 }) vira '2 de 3'. */
export function fill(text: string, vars: Record<string, string | number>) {
  return text.replace(/\{(\w+)\}/g, (_, k: string) => (k in vars ? String(vars[k]) : `{${k}}`))
}

/** Números no formato do idioma (1.284 e 4,0 em português; 1,284 e 4.0 em inglês). */
export function useFmt() {
  const { num } = useT()
  return useMemo(
    () => ({
      int: (n: number) => String(Math.max(0, Math.round(n))).replace(/\B(?=(\d{3})+(?!\d))/g, num.thousands),
      mbps: (n: number) => n.toFixed(1).replace('.', num.decimal),
    }),
    [num],
  )
}
