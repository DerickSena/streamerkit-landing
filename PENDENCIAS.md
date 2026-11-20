# Pendências (confirmar com o dono do StreamerKit)

## Prova social (o que mais pesa na conversão e ainda não existe na página)
A página não tem nenhum depoimento nem número de uso, porque nada foi inventado. Pedir ao dono:
- [ ] Quantos streamers usam hoje, ou quantas horas de live já passaram pelo servidor.
- [ ] 2 ou 3 streamers conhecidos que usam e autorizam citar o nome (com print ou clipe).
- [ ] Um depoimento curto de streamer e um de moderador.
- [ ] Tamanho do Discord (número de membros).
Com isso, entra uma faixa de prova logo abaixo do topo e um bloco antes dos planos.

## Textos e fatos a validar
- [ ] "Cobrança em real: cartão ou Pix Automático" (tirado da nota de rodapé dos planos do site atual).
- [ ] "Também conhecido como Servidor do Marco" no rodapé (está nos dados do site atual; confirmar se quer mostrar).
- [ ] Rótulos dos planos: "Para começar" (Básico) e "PC desligado" (Avançado).
- [ ] Gírias do chat da simulação ("caiu?", "F", "travou", "lagou aqui"): validar com quem faz live.
- [ ] Rótulo "Só aqui" no controle remoto e no canvas: vem da frase do site atual ("o que você só encontra aqui"). Concorrentes têm controle remoto e overlay parecidos (Moblin, IRLhosting), então confirmar se a frase se sustenta ou trocar por "Diferencial".
- [ ] "Seus moderadores podem editar junto com você" (canvas): também vem do site atual.
- [ ] Existe teste grátis, garantia ou reembolso? Se existir, vira a frase embaixo do botão (reduz o risco de quem está em dúvida).

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

## Idiomas (feito em 2026-11-19: português, inglês, espanhol da Espanha e da América Latina)
- [ ] Pedir para alguém nativo ler o inglês e o espanhol. As perguntas frequentes e os termos (ingest, cloud OBS, "en directo", "en vivo") vieram do site atual; o resto foi traduzido agora.
- [ ] Política de Privacidade, Termos e Suporte apontam para as páginas em português nos 4 idiomas. Trocar pelos endereços de cada idioma, se existirem.
- [ ] A imagem de compartilhamento é a mesma (em português) nos 4 idiomas.
- [ ] Idioma automático: só age na página raiz. Primeira visita com navegador em inglês vai para /en/, em espanhol da Espanha para /es/, outro espanhol para /es-419/, qualquer outro idioma para /en/. Português fica. A escolha feita no seletor fica guardada e vence. Robôs do Google não são redirecionados. Confirmar se ele prefere por país (IP) em vez de idioma do navegador.
- [ ] Quer outros idiomas (francês, alemão)? É criar um arquivo novo em `src/i18n/` copiando o `en.ts`.
