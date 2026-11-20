# Pendências (confirmar com o dono do StreamerKit)

## Prova social (respondida, falta aplicar na página)
A página ainda não mostra depoimento nem número de uso. O dono já mandou (ver "Respostas do dono" no fim):
- [x] Quantos streamers usam hoje e quantas horas de live.
- [x] Streamers que autorizam citar o nome (12 nomes; sem print nem clipe).
- [x] Depoimentos curtos (3, todos de streamer; nenhum de moderador).
- [ ] Tamanho do Discord (não respondeu).
Com isso, entra uma faixa de prova logo abaixo do topo e um bloco antes dos planos.

## Textos e fatos a validar
- [x] "Cobrança em real: cartão ou Pix Automático": confirmado.
- [ ] "Também conhecido como Servidor do Marco" no rodapé (está nos dados do site atual; o Dérick tirou a pergunta do formulário, segue como está).
- [ ] Rótulos dos planos: "Para começar" (Básico) e "PC desligado" (Avançado): o dono prefere mudar, falta dizer para qual.
- [x] Gírias do chat da simulação: o Dérick conferiu e disse que parecem reais (2026-11-19).
- [x] Rótulo "Só aqui": vale no controle remoto (só o StreamerKit faz). No canvas não vale (outros também fazem): trocar.
- [x] "Seus moderadores podem editar junto com você" (canvas): confirmado.
- [x] Teste grátis: sim, 7 dias. Vira a frase embaixo do botão.

## Números da simulação (são ilustrativos, não promessa)
- Bonding: 4G 2,4 + 5G 3,6 + Wi-Fi 2,0 Mbps, alvo de 6,0 Mbps.
- Placar, viewers e local do canvas são os mesmos exemplos do site atual.

## Mídia de teste (trocar por vídeo real do produto quando houver)
| Nº | Onde | Arquivo | O que é |
|---|---|---|---|
| Vídeo 1 | Topo e monitor do bonding | `show.mp4` | plateia filmando show |
| Vídeo 2 | Controle remoto, câmera traseira | `lanterna.mp4` | motoqueiro de capacete (sem e com flash) |
| Vídeo 3 | Controle remoto, câmera frontal e PiP | `festa.mp4` | amigos na festa, selfie |
| Vídeo 4 | Canvas com widgets | `rua.mp4` | rua à noite, de dentro do carro |
| Vídeo 5 | Preview das câmeras e PiP | `moto.mp4` | moto seguindo na avenida |
| Vídeo 6 | Preview das câmeras | `praia.mp4` | calçadão com palmeiras |
O ideal é gravar a tela do app real e uma live real do StreamerKit.

## Técnica
- [ ] Google Analytics (G-E7CW2J8C3R) e Cloudflare Insights do site atual não foram colocados aqui. Entram na publicação.
- [ ] Imagem de compartilhamento (og:image) aponta para a do site atual. Fazer uma nova com o título "Sua live caiu. De novo."
- [ ] Medir no ar: cliques em "Escolher um plano" por seção, e quantos ligam o interruptor do topo.
- [ ] Rodar o Lighthouse no celular depois de publicado (meta: 90+).
- [ ] Prévia na Vercel: o `vercel.json` manda o Google não indexar (`X-Robots-Tag: noindex`), para a prévia não competir com o site oficial. Tirar essa linha quando a página virar a oficial.

## Idiomas (2026-11-19: 10 idiomas)
Português, inglês, espanhol (Espanha e América Latina), alemão, francês, italiano, japonês, coreano e chinês simplificado.
- [ ] Pedir para alguém nativo ler cada idioma. Só o inglês e o espanhol têm perguntas frequentes e termos vindos do site atual; alemão, francês, italiano, japonês, coreano e chinês foram traduzidos por IA, sem revisão humana.
- [ ] `/de/`, `/fr/`, `/it/`, `/ja/`, `/ko/` e `/zh/` são endereços novos: o site atual só tem `/`, `/en/`, `/es/` e `/es-419/`.
- [ ] Política de Privacidade, Termos e Suporte apontam para as páginas em português em todos os idiomas.
- [ ] A imagem de compartilhamento é a mesma (em português) em todos os idiomas.
- [ ] Japonês, coreano e chinês usam a fonte do aparelho (a fonte da marca não tem esses caracteres), então o título muda um pouco de aparelho para aparelho.
- [x] Idioma automático (decidido pelo Dérick em 2026-11-19: fica pelo idioma do navegador): só age na página raiz, na primeira visita. Idioma sem tradução cai no inglês. A escolha do seletor fica guardada e vence. Robôs do Google não são redirecionados.

## Respostas do dono (formulário, 2026-11-19)
O dono respondeu uma vez. O formulário saiu do ar no mesmo dia.
- Streamers usando hoje: 100. Horas de live pelo servidor: 20 mil. Discord: não informou.
- Pode citar: jon vlogs, tota, dona, sheviii2k, kosky, fontinellerj, jhowrj, andreachinii, cerol, diegohiga, moicano, mctuto.
- Depoimentos: "Isso não é hack, isso é StreamerKit!" (zanolini); "O único servidor no mundo com tradução ao vivo" (JonVlogs); "StreamerKit resolveu tudo que eu precisava nas minhas lives" (sheviii2k).
- Cartão e Pix Automático em real: sim. Mods editam o canvas junto: sim.
- Selos "Para começar" e "PC desligado": prefere mudar (não disse para qual).
- Controle do celular pelo mod: só o StreamerKit faz. Canvas com widgets: outros também fazem.
- Teste grátis: 7 dias.
- Vídeos reais: vai mandar para o Dérick.

## Tradução ao vivo (2026-11-20)
O dono mandou vídeos e o Dérick apontou a tradução ao vivo como a maior inovação. Entrou a seção "Você fala. O chat lê na língua dele.", com um trecho de live real do JonVlogs e um painel de teste (idioma da audiência, posição e tamanho da legenda).
- [ ] As falas do vídeo vieram de transcrição automática e a tradução foi feita por IA. Alguém precisa ouvir o clipe com som e conferir, em português principalmente.
- [ ] A legenda da página é desenhada pelo site (não é a saída do StreamerKit); há uma linha avisando isso embaixo do vídeo. Confirmar com o dono se está bom assim.
- [x] Superbet (casa de aposta) e Cimed (nos dois ombros) foram tiradas da camisa do JonVlogs no vídeo, quadro a quadro (2026-11-20). BDJ, Kick e o escudo continuam aparecendo.
- [ ] Idiomas da audiência: o painel real mostra a lista de idiomas falados (português, inglês, espanhol, francês, árabe). A lista de idiomas de legenda não foi confirmada; a página oferece português, inglês, espanhol, francês e o idioma da própria página.
- [ ] O clipe é um reel de 720 px com upscale por IA para 1080p. Se o dono tiver o arquivo original da live, a qualidade melhora de verdade.
- Depois do simulador de bonding entrou a tabela "Conexões", interativa e ligada ao simulador (o vídeo gravado do painel saiu, o Dérick não gostou).
- [ ] Os números da tabela (latência, RTT, divisão do uso, efeito da prioridade) são ilustrativos. Confirmar com o dono se a prioridade funciona assim (mais prioridade, mais uso).

## O que falta depois das respostas
- [x] Aplicado na página (2026-11-19): faixa de prova (100 streamers, 20 mil horas), nomes, depoimentos, "7 dias grátis", canvas sem "Só aqui".
- [ ] Novos nomes para os selos dos planos.
- [ ] zanolini tem depoimento, mas não está na lista de quem pode citar: confirmar.
- [x] Tradução ao vivo virou seção própria (2026-11-20).
- [ ] Número de membros do Discord.
- [x] Vídeos reais recebidos (2026-11-19): tela do painel e 3 clipes. Usados: clipe do JonVlogs na estrada e a tabela de conexões.
