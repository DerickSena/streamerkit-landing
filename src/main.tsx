import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import '@fontsource-variable/saira/wdth.css'
import '@fontsource-variable/jetbrains-mono'
import './index.css'
import App from './App.tsx'
import { localeFromPath } from './i18n'

const root = document.getElementById('root')!
// O idioma vem do endereço: / (português), /en/, /es/ e /es-419/.
const locale = localeFromPath(window.location.pathname)
const app = (
  <StrictMode>
    <App locale={locale} />
  </StrictMode>
)

// Em produção o HTML já vem pré-renderizado (prerender.mjs). Deixa o navegador pintar
// esse HTML primeiro e só depois hidrata, para a tela não esperar o React.
if (root.hasChildNodes()) {
  requestAnimationFrame(() => setTimeout(() => hydrateRoot(root, app), 0))
} else {
  createRoot(root).render(app)
}
