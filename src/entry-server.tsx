import { renderToString } from 'react-dom/server'
import App from './App'
import { LOCALES, type Locale } from './i18n'
import { DICTS } from './i18n/all'

// O prerender.mjs usa estes dois para montar o <head> de cada idioma.
export { DICTS, LOCALES }

export function render(locale: Locale = 'pt') {
  return renderToString(<App locale={locale} dict={DICTS[locale]} />)
}
