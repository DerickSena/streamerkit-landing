// Gera o HTML da página no build para a tela aparecer antes do JavaScript (melhor LCP no celular).
import { readFileSync, rmSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

const { render } = await import(pathToFileURL('dist-ssr/entry-server.js').href)
const html = render()
const arquivo = 'dist/index.html'
const pagina = readFileSync(arquivo, 'utf-8')
if (!pagina.includes('<div id="root"></div>')) throw new Error('marcador <div id="root"></div> não encontrado')
writeFileSync(arquivo, pagina.replace('<div id="root"></div>', `<div id="root">${html}</div>`))
rmSync('dist-ssr', { recursive: true, force: true })
console.log(`pré-renderizado: ${(html.length / 1024).toFixed(1)} kB de HTML`)
