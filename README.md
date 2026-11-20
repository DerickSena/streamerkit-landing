# StreamerKit: nova landing (proposta)

Proposta de nova página inicial para o StreamerKit (https://streamerkit.net), feita pelo Dérick a pedido do dono do produto. Objetivo: converter mais, abrindo pela dor do streamer IRL (live que cai) e deixando o visitante mexer no produto.

## Rodar
```
npm install
npm run dev        # desenvolvimento
npm run build      # gera dist/ (HTML pré-renderizado + JS)
npm run preview    # serve o dist/
```
O `dist/` é um site estático: sobe em qualquer hospedagem (Cloudflare Pages, VPS, Vercel).

## Stack
Vite + React + TypeScript + Tailwind CSS v4 + Motion. Three.js só na cena do bonding, carregado quando a seção entra na tela. Fontes Saira (a mesma do site atual) e JetBrains Mono, servidas pelo próprio site.

## Estrutura da página (ordem de conversão)
1. **Topo (dor):** "Sua live caiu. De novo." O celular mostra a live travando, o chat reclamando e os viewers indo embora. O interruptor "StreamerKit" liga a solução e o título muda para "Sua live continua no ar".
2. **O problema:** 4 dores, cada uma ligada ao recurso que resolve.
3. **Bonding (3D):** o visitante derruba o 4G, o 5G ou o Wi-Fi e vê a live continuar. Com tudo caído, entra a cena de BRB.
4. **Controle remoto:** painel do mod de verdade (lanterna, câmera, zoom, bitrate, PiP, mic, widgets) e o iPhone respondendo.
5. **Canvas com widgets:** overlays arrastáveis.
6. **Tudo incluído:** preview das câmeras, multistream, OBS na nuvem, permissões, ingests, H.265, PiP, apps.
7. **Três passos, Planos (mensal e anual), Dúvidas, Chamada final, Rodapé.**
No celular há um botão fixo "Escolher um plano" embaixo.

## Idiomas
Dez páginas: `/` (português), `/en/`, `/es/` (Espanha), `/es-419/` (América Latina), `/de/`, `/fr/`, `/it/`, `/ja/`, `/ko/` e `/zh/` (chinês simplificado). As quatro primeiras usam os endereços do site atual. O build gera um HTML pronto por idioma, cada um com título, descrição e `hreflang` próprios.
- Textos: um arquivo por idioma em `src/i18n/` (`pt.ts` é a origem). `es.ts` parte do `es419.ts` e troca o vocabulário da Espanha. As perguntas frequentes em inglês e espanhol estão em `faq-official.ts`, copiadas do site atual.
- O navegador baixa só o idioma da página (`LOADERS` em `src/i18n/index.tsx`). O build usa todos (`src/i18n/all.ts`).
- Seletor: globo no topo (`src/components/LangSwitcher.tsx`) e links no rodapé. A escolha fica guardada no navegador.
- Idioma automático: script pequeno no `index.html`. Só age na página raiz, na primeira visita, pelo idioma do navegador. Não redireciona robôs.
- Idioma novo: copiar `en.ts`, traduzir (regras em `ferramentas/BRIEFING-TRADUCAO.md`) e registrar em `LOCALES` e `LOADERS` (`src/i18n/index.tsx`), em `src/i18n/all.ts` e na lista do script do `index.html`.
- Japonês, coreano e chinês: a fonte Saira não tem esses caracteres; o fim do `src/index.css` indica fontes do sistema e ajusta o tamanho dos títulos.

## Formulário de perguntas ao dono
`public/briefing/index.html` (endereço `/briefing/`): formulário simples que manda as respostas para um webhook do n8n. Detalhes em `PENDENCIAS.md`.

## Onde mexer
- Textos, preços e FAQ: `src/i18n/` (um arquivo por idioma). Links: `src/lib/site.ts`.
- Cores e fontes: `src/index.css` (bloco `@theme`).
- Cada seção: `src/sections/`.
- Vídeos: `public/media/` (créditos em `CREDITOS-MIDIA.md`).
- Lanterna: `ferramentas/lanterna_bake.py` gera o vídeo com e sem flash (precisa de Python com `opencv-python` e `rembg`).

## O que falta confirmar
Ver `PENDENCIAS.md`.
