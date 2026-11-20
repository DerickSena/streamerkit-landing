// Gera o HTML de cada idioma no build: a tela aparece antes do JavaScript (melhor LCP no celular)
// e o Google recebe uma página pronta por idioma, cada uma com o seu <head>.
//   /           português   dist/index.html
//   /en/        inglês      dist/en/index.html
//   /es/        espanhol (Espanha)
//   /es-419/    espanhol (América Latina)
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { pathToFileURL } from 'node:url'

const SITE = 'https://streamerkit.net'
const { render, DICTS, LOCALES } = await import(pathToFileURL('dist-ssr/entry-server.js').href)

const base = readFileSync('dist/index.html', 'utf-8')
const RAIZ = '<div id="root"></div>'
const SEO = /<!--seo-->[\s\S]*?<!--\/seo-->/
if (!base.includes(RAIZ)) throw new Error('marcador <div id="root"></div> não encontrado')
if (!SEO.test(base)) throw new Error('marcadores <!--seo--> ... <!--/seo--> não encontrados no index.html')

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Todas as páginas apontam umas para as outras (hreflang), como no site atual.
const alternates = [
  ...LOCALES.flatMap((l) => l.hreflang.map((h) => `<link rel="alternate" hreflang="${h}" href="${SITE}${l.path}" />`)),
  `<link rel="alternate" hreflang="x-default" href="${SITE}/" />`,
].join('\n    ')

for (const l of LOCALES) {
  const t = DICTS[l.id]
  const url = SITE + l.path
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'StreamerKit',
    alternateName: 'Servidor do Marco',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web, iOS',
    url,
    description: t.meta.description,
    offers: [
      { '@type': 'Offer', name: t.pricing.plans.basic.name, price: '119.90', priceCurrency: 'BRL' },
      { '@type': 'Offer', name: t.pricing.plans.advanced.name, price: '499.90', priceCurrency: 'BRL' },
    ],
    inLanguage: t.meta.lang,
  }
  const seo = `<title>${esc(t.meta.title)}</title>
    <meta name="description" content="${esc(t.meta.description)}" />
    <link rel="canonical" href="${url}" />
    ${alternates}
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="${t.meta.ogLocale}" />
    <meta property="og:site_name" content="StreamerKit" />
    <meta property="og:title" content="${esc(t.meta.ogTitle)}" />
    <meta property="og:description" content="${esc(t.meta.ogDescription)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${SITE}/assets/images/og-pt-BR.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`

  const html = render(l.id)
  // replace com função: o texto tem "R$", e "$" é especial no replace com string
  const page = base
    .replace(SEO, () => seo)
    .replace('<html lang="pt-BR">', () => `<html lang="${t.meta.lang}">`)
    .replace(RAIZ, () => `<div id="root">${html}</div>`)
  const arquivo = l.path === '/' ? 'dist/index.html' : `dist${l.path}index.html`
  mkdirSync(dirname(arquivo), { recursive: true })
  writeFileSync(arquivo, page)
  console.log(`pré-renderizado ${l.id.padEnd(6)} ${arquivo} (${(html.length / 1024).toFixed(1)} kB)`)
}

rmSync('dist-ssr', { recursive: true, force: true })
