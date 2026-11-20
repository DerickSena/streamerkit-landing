import { renderToString } from 'react-dom/server'
import App from './App'
import { DICTS, LOCALES, type Locale } from './i18n'

// O prerender.mjs usa estes dois para montar o <head> de cada idioma.
export { DICTS, LOCALES }

export function render(locale: Locale = 'pt') {
  return renderToString(<App locale={locale} />)
}
