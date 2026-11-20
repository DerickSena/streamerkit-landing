# Briefing de tradução (um arquivo por idioma em `src/i18n/`)

Você vai criar UM arquivo novo de tradução da landing do StreamerKit (servidor de live IRL para streamers de Twitch, Kick e YouTube). Não mexa em nenhum outro arquivo. Não rode servidor. Não faça commit.

## De onde partir
- `src/i18n/en.ts`: estrutura exata e tom de voz (copie a estrutura chave por chave).
- `src/i18n/pt.ts`: texto original em português, para tirar dúvida de sentido. Os comentários explicam o formato das chaves compostas.
- `src/i18n/faq-official.ts`: perguntas frequentes oficiais em inglês (`FAQ_OFFICIAL.en`) e a ordem desta página (`FAQ_ORDER`).

## O que entregar
Arquivo `src/i18n/<arquivo>.ts` com:
```ts
import type { Dict } from './pt'

export const <nome>: Dict = { ... }
```
- TODAS as chaves do `en.ts`, na mesma ordem, com o mesmo formato (arrays do mesmo tamanho, objetos com as mesmas chaves).
- `faq.items`: escreva as 9 perguntas e respostas por extenso no arquivo, traduzidas de `FAQ_OFFICIAL.en`, na ordem de `FAQ_ORDER` (ou seja: índices 0, 7, 1, 2, 4, 5, 3, 6, 8 do oficial). Não importe `faq-official.ts`.

## Regras de tradução
1. Tradução natural, como um streamer daquele país fala. Nada de tradução literal dura. Tom direto, informal, tratamento informal (du, tu, etc.).
2. NÃO traduza: StreamerKit, SRTLA, SRTLA bonding, BRB, OBS, OBS Studio, ingest/Ingests, Twitch, Kick, YouTube, Discord, PiP, H.265, HEVC, RTMP, SRT, IRL, IRL Pro, Larix, Larix Broadcaster, iPhone, Android, Windows, Wi-Fi, 4G, 5G, Mbps, Mb/s, Pix Automático, "Servidor do Marco", "Canvas" (nome do recurso), "widgets", "overlays", "mod/mods" (se o idioma usa o termo; senão, o equivalente local de moderador).
3. Mantenha os marcadores entre chaves exatamente como estão: `{n}`, `{v}`, `{l}`, `{z}`, `{cam}`, `{name}`.
4. Preços continuam em real (R$), só muda o formato do número conforme o idioma (ver tabela). Exemplo em alemão: `R$ 119,90`; em japonês: `R$119.90`.
5. `canvas.place` fica `'CONSOLAÇÃO, SÃO PAULO, SP'`. `canvas.speed` fica `'5 KM/H'`. Apelidos do chat (leo_zx, bia.mp4, tutu77, gabs, nandaa, rafa_irl) ficam. "Anápolis" fica.
6. `hero.off` e `hero.on` são títulos gigantes de 3 linhas. Cada linha tem de ser CURTA: no máximo 11 caracteres em idiomas de alfabeto latino, no máximo 6 caracteres em japonês, coreano e chinês. Sentido: off = "Sua live / caiu. / De novo." (a 2ª linha é a palavra de impacto); on = "Sua live / continua / no ar.".
7. `final.title`: 2 linhas curtas (até 14 caracteres latinos, até 8 asiáticos). Sentido: "O sinal cai. / A live fica."
8. `canvas.youBadge`: no máximo 2 ou 3 caracteres (ex.: "ME", "ICH", "MOI", "IO", "自分" não, use 2 caracteres).
9. `nav.items`: 5 rótulos curtos de menu (até 16 caracteres cada).
10. `hero.chat`: mensagens de chat de live, curtíssimas e com gíria real daquele idioma (equivalentes de "lol", "F", "caiu?"). Mesma quantidade de itens em cada lista.
11. `pricing.currencyNote`: traduza "Prices in Brazilian reais (BRL). At checkout you can pay in your local currency."
12. Não use o caractere travessão longo "—". Não use emoji.
13. Strings com apóstrofo: use aspas duplas no TypeScript.

## Tabela por idioma
| arquivo | nome da constante | meta.lang | meta.ogLocale | num.decimal | num.thousands | formato de preço |
|---|---|---|---|---|---|---|
| de.ts | de | de | de_DE | ',' | '.' | 119,90 · 1.199,00 · 99,92 · 499,90 · 4.999,00 · 416,58 |
| fr.ts | fr | fr | fr_FR | ',' | '\u202f' | 119,90 · 1 199,00 · 99,92 · 499,90 · 4 999,00 · 416,58 (use espaço fino '\u202f' no milhar) |
| it.ts | it | it | it_IT | ',' | '.' | 119,90 · 1.199,00 · 99,92 · 499,90 · 4.999,00 · 416,58 |
| ja.ts | ja | ja | ja_JP | '.' | ',' | 119.90 · 1,199.00 · 99.92 · 499.90 · 4,999.00 · 416.58 |
| ko.ts | ko | ko | ko_KR | '.' | ',' | 119.90 · 1,199.00 · 99.92 · 499.90 · 4,999.00 · 416.58 |
| zh.ts | zh | zh-Hans | zh_CN | '.' | ',' | 119.90 · 1,199.00 · 99.92 · 499.90 · 4,999.00 · 416.58 (chinês simplificado) |

## Validação obrigatória
1. Rode `npx tsc -b` dentro de `H:\Projetos\streamerkit-landing`. Seu arquivo tem de ficar sem erro (erros em arquivos de outros idiomas, se aparecerem, não são seus: outros tradutores estão trabalhando ao mesmo tempo).
2. Releia `hero.off`, `hero.on` e `final.title` e conte os caracteres de cada linha.
3. Confira que nenhum marcador `{...}` sumiu ou foi traduzido.

## Devolva
Relatório enxuto em português: arquivo criado, resultado do tsc no seu arquivo, as 3 linhas de `hero.off` e `hero.on` com a contagem de caracteres, e qualquer termo em que você ficou em dúvida.
