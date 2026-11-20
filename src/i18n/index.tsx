import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { Dict } from './pt'

export type { Dict }
export type Locale = 'pt' | 'en' | 'es' | 'es-419' | 'de' | 'fr' | 'it' | 'ja' | 'ko' | 'zh'

/**
 * Idiomas da página. Os 4 primeiros usam os mesmos endereços e hreflang do site atual do StreamerKit;
 * os outros são novos. Para criar um idioma: copiar en.ts, traduzir e acrescentar uma linha aqui,
 * uma em LOADERS (abaixo) e uma em all.ts. O script de idioma automático do index.html tem a mesma lista.
 */
export const LOCALES: { id: Locale; path: string; label: string; short: string; hreflang: string[] }[] = [
  { id: 'pt', path: '/', label: 'Português', short: 'PT', hreflang: ['pt-BR'] },
  { id: 'en', path: '/en/', label: 'English', short: 'EN', hreflang: ['en'] },
  { id: 'es', path: '/es/', label: 'Español (España)', short: 'ES', hreflang: ['es-ES'] },
  { id: 'es-419', path: '/es-419/', label: 'Español (Latinoamérica)', short: 'ES', hreflang: ['es', 'es-419'] },
  { id: 'de', path: '/de/', label: 'Deutsch', short: 'DE', hreflang: ['de'] },
  { id: 'fr', path: '/fr/', label: 'Français', short: 'FR', hreflang: ['fr'] },
  { id: 'it', path: '/it/', label: 'Italiano', short: 'IT', hreflang: ['it'] },
  { id: 'ja', path: '/ja/', label: '日本語', short: 'JA', hreflang: ['ja'] },
  { id: 'ko', path: '/ko/', label: '한국어', short: 'KO', hreflang: ['ko'] },
  { id: 'zh', path: '/zh/', label: '简体中文', short: '中文', hreflang: ['zh-Hans'] },
]

/** Cada idioma é baixado só por quem abre aquele idioma (o navegador não carrega os outros 9). */
export const LOADERS: Record<Locale, () => Promise<Dict>> = {
  pt: () => import('./pt').then((m) => m.pt),
  en: () => import('./en').then((m) => m.en),
  es: () => import('./es').then((m) => m.es),
  'es-419': () => import('./es419').then((m) => m.es419),
  de: () => import('./de').then((m) => m.de),
  fr: () => import('./fr').then((m) => m.fr),
  it: () => import('./it').then((m) => m.it),
  ja: () => import('./ja').then((m) => m.ja),
  ko: () => import('./ko').then((m) => m.ko),
  zh: () => import('./zh').then((m) => m.zh),
}

/** Chave do navegador onde fica o idioma que a pessoa escolheu. O script do index.html usa a mesma. */
export const STORAGE_KEY = 'sk-lang'

export function localeFromPath(pathname: string): Locale {
  const seg = pathname.split('/')[1] ?? ''
  const found = LOCALES.find((l) => l.id !== 'pt' && l.id === seg)
  return found ? found.id : 'pt'
}

const Ctx = createContext<{ locale: Locale; t: Dict } | null>(null)

export function LocaleProvider({ locale, dict, children }: { locale: Locale; dict: Dict; children: ReactNode }) {
  const value = useMemo(() => ({ locale, t: dict }), [locale, dict])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

function useCtx() {
  const c = useContext(Ctx)
  if (!c) throw new Error('LocaleProvider ausente')
  return c
}

/** Textos do idioma atual. */
export const useT = () => useCtx().t
export const useLocale = () => useCtx().locale

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
