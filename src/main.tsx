import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import '@fontsource-variable/saira/wdth.css'
import '@fontsource-variable/jetbrains-mono'
import './index.css'
import App from './App.tsx'
import { LOADERS, localeFromPath } from './i18n'

const root = document.getElementById('root')!
// O idioma vem do endereço: / (português), /en/, /es/, /de/, /ja/...
const locale = localeFromPath(window.location.pathname)

// Baixa só os textos do idioma da página e então liga o React.
LOADERS[locale]().then((dict) => {
  const app = (
    <StrictMode>
      <App locale={locale} dict={dict} />
    </StrictMode>
  )
  // Em produção o HTML já vem pré-renderizado (prerender.mjs). Deixa o navegador pintar
  // esse HTML primeiro e só depois hidrata, para a tela não esperar o React.
  if (root.hasChildNodes()) {
    requestAnimationFrame(() => setTimeout(() => hydrateRoot(root, app), 0))
  } else {
    createRoot(root).render(app)
  }
})
