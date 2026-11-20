// Tudo que é link, preço e texto de negócio fica aqui (uma fonte só).
// Os dados vêm do site atual, https://streamerkit.net, lido em 2026-11-19.

export const LINKS = {
  login: 'https://live.streamerkit.net',
  plans: 'https://live.streamerkit.net/plans',
  plan: (plan: 'basic' | 'advanced', interval: 'month' | 'year') =>
    `https://live.streamerkit.net/plans?plan=${plan}&interval=${interval}`,
  help: 'https://help.streamerkit.net',
  discord: 'https://discord.gg/N7ZcUt7epv',
  instagram: 'https://www.instagram.com/streamer.kit/',
  x: 'https://x.com/streamer_kit',
  tiktok: 'https://www.tiktok.com/@streamer.kit',
  privacy: 'https://streamerkit.net/privacy-policy/',
  terms: 'https://streamerkit.net/terms-of-service/',
  support: 'https://streamerkit.net/suporte/',
  en: 'https://streamerkit.net/en/',
  es: 'https://streamerkit.net/es/',
  es419: 'https://streamerkit.net/es-419/',
}

export type Interval = 'month' | 'year'

export const PLANS = [
  {
    id: 'basic' as const,
    name: 'Básico',
    tagline: 'Para entrar ao vivo da rua com o OBS do seu PC.',
    price: { month: '119,90', year: '1.199,00' },
    perMonthOnYear: '99,92',
    features: [
      { text: '1 ingest (1 celular ou câmera por vez)', on: true },
      { text: 'OBS no seu PC, com o plugin do StreamerKit (Windows)', on: true },
      { text: 'OBS na nuvem controlado pelo navegador', on: false },
      { text: 'Biblioteca de mídia para overlays e vídeos', on: false },
    ],
  },
  {
    id: 'advanced' as const,
    name: 'Avançado',
    tagline: 'PC desligado: o OBS roda na nuvem e você controla pelo navegador.',
    price: { month: '499,90', year: '4.999,00' },
    perMonthOnYear: '416,58',
    features: [
      { text: '2 ingests (2 celulares ou câmeras ao mesmo tempo)', on: true },
      { text: 'OBS na nuvem controlado pelo navegador', on: true },
      { text: 'Biblioteca de mídia para overlays e vídeos', on: true },
      { text: 'Também funciona com o OBS do seu PC', on: true },
    ],
  },
]

export const INCLUDED_IN_BOTH = [
  'SRTLA bonding (4G + 5G + Wi-Fi)',
  'Cena de BRB automática',
  'Multistream para até 4 destinos',
  'Canvas com widgets',
  'Controle remoto do app',
  'Preview das câmeras',
  'Dashboard com estatísticas em tempo real',
]

export const FAQ = [
  {
    q: 'O que é um servidor de live IRL?',
    a: 'É o serviço que recebe a transmissão do seu celular pela internet móvel, mantém o vídeo estável e entrega ao OBS, que envia para as plataformas. O StreamerKit faz isso com SRTLA bonding, ingests no Brasil, nos EUA e na Europa, OBS no seu PC ou na nuvem e multistream para Twitch, Kick e YouTube.',
  },
  {
    q: 'Funciona com 4G ou 5G fraco?',
    a: 'O SRTLA distribui a transmissão entre todas as suas conexões e o SRT reenvia pacotes perdidos, então a live aguenta sinal fraco. O H.265 reduz os dados necessários e o ingest mais próximo encurta a distância. Se todas as conexões caírem, o OBS troca para a sua cena de BRB e a live continua no ar.',
  },
  {
    q: 'O que é SRTLA bonding?',
    a: 'SRTLA divide uma transmissão SRT entre várias conexões ao mesmo tempo, como 4G, 5G e Wi-Fi. Se uma conexão cai ou piora, as outras seguram a live, e o SRT reenvia os pacotes perdidos.',
  },
  {
    q: 'Meus moderadores podem controlar meu celular durante a live?',
    a: 'Sim, com o app StreamerKit no iPhone. Pelo dashboard, os moderadores com permissão trocam entre a câmera frontal e a traseira, ajustam o zoom, ligam o PiP com as duas câmeras, mutam o microfone, ligam a lanterna, ajustam o bitrate, recarregam os widgets e iniciam ou param o envio. Com IRL Pro ou Larix a live funciona normalmente, mas sem o controle remoto.',
  },
  {
    q: 'Preciso deixar o PC ligado?',
    a: 'No Básico, sim: o OBS roda no seu PC com o plugin do StreamerKit (Windows), então o PC precisa ficar ligado durante toda a live. No Avançado, o OBS roda nos nossos servidores e você liga pelo dashboard, então o PC pode ficar desligado.',
  },
  {
    q: 'Quais apps funcionam?',
    a: 'No iPhone, o app StreamerKit. No Android e em outros aparelhos, IRL Pro, Larix Broadcaster ou qualquer app ou encoder que envie SRT ou SRTLA, incluindo o OBS Studio. A página Ingests mostra um QR code que carrega as configurações no IRL Pro e no Larix.',
  },
  {
    q: 'Como coloco overlays e widgets na live IRL?',
    a: 'Pelo navegador, de dois jeitos. No canvas com widgets você monta placar, mapa com sua localização, espectadores, desafios, QR code, textos, imagens, vídeos e páginas de alertas e chat, e o canvas entra no OBS como uma fonte de navegador, no seu PC ou na nuvem. Com o app StreamerKit, você também cola o link de qualquer overlay, como alertas e metas, uma vez na página Celular do dashboard, ajusta posição e tamanho arrastando, e o celular desenha o widget sobre a câmera quando conecta.',
  },
  {
    q: 'Posso transmitir na Twitch, Kick e YouTube ao mesmo tempo?',
    a: 'Sim. Em todos os planos você transmite para até 4 destinos ao mesmo tempo, incluindo Twitch, Kick, YouTube e RTMP personalizado. Você entra com sua conta da Twitch ou da Kick.',
  },
  {
    q: 'Qual a diferença entre o Básico e o Avançado?',
    a: 'Os dois planos têm SRTLA bonding, a cena de BRB automática, multistream, canvas com widgets, controle remoto do app e preview das câmeras. O Básico (R$ 119,90/mês) tem 1 ingest e funciona com o OBS do seu PC. O Avançado (R$ 499,90/mês) tem 2 ingests, um OBS na nuvem controlado pelo navegador e a biblioteca de mídia. No plano anual você paga R$ 1.199,00 (Básico) ou R$ 4.999,00 (Avançado), o preço de 10 meses.',
  },
]

export const fmtInt = (n: number) => Math.round(n).toLocaleString('pt-BR')
export const fmtMbps = (n: number) => n.toFixed(1).replace('.', ',')
