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
- [x] Gírias do chat da simulação: o Dérick conferiu e disse que parecem reais (2026-11-19).
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

## Idiomas (2026-11-19: 10 idiomas)
Português, inglês, espanhol (Espanha e América Latina), alemão, francês, italiano, japonês, coreano e chinês simplificado.
- [ ] Pedir para alguém nativo ler cada idioma. Só o inglês e o espanhol têm perguntas frequentes e termos vindos do site atual; alemão, francês, italiano, japonês, coreano e chinês foram traduzidos por IA, sem revisão humana.
- [ ] `/de/`, `/fr/`, `/it/`, `/ja/`, `/ko/` e `/zh/` são endereços novos: o site atual só tem `/`, `/en/`, `/es/` e `/es-419/`.
- [ ] Política de Privacidade, Termos e Suporte apontam para as páginas em português em todos os idiomas.
- [ ] A imagem de compartilhamento é a mesma (em português) em todos os idiomas.
- [ ] Japonês, coreano e chinês usam a fonte do aparelho (a fonte da marca não tem esses caracteres), então o título muda um pouco de aparelho para aparelho.
- [x] Idioma automático (decidido pelo Dérick em 2026-11-19: fica pelo idioma do navegador): só age na página raiz, na primeira visita. Idioma sem tradução cai no inglês. A escolha do seletor fica guardada e vence. Robôs do Google não são redirecionados.

## Formulário para o dono responder (2026-11-19)
- Página: `/briefing/` (arquivo `public/briefing/index.html`, HTML simples, fora do React). Não aparece no menu nem no Google.
- As respostas vão para o n8n da VPS do Dérick: fluxo "StreamerKit: respostas do formulário" (id `6rSaPBInzYuDrKmk`), que grava na tabela de dados `streamerkit_briefing`. Não há senha: o endereço do webhook está no HTML da página.
- Se o envio falhar, a própria página mostra as respostas para a pessoa copiar e mandar por mensagem.
- Quando a página virar a oficial, apagar a pasta `public/briefing/` e desligar o fluxo no n8n.
