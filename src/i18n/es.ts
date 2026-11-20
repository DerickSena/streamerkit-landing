// Espanhol da Espanha. Parte do texto da América Latina (es419.ts) e troca o vocabulário
// pelo que o site atual usa em https://streamerkit.net/es/: "móvil", "en directo", "PC", "vídeo".
// O que não dá para trocar palavra por palavra (gênero, expressões) vai nos ajustes do fim.
import type { Dict } from './pt'
import { es419 } from './es419'
import { FAQ_OFFICIAL, FAQ_ORDER } from './faq-official'

const TROCAS: [RegExp, string][] = [
  [/celulares/g, 'móviles'],
  [/Celular\b/g, 'Móvil'],
  [/celular/g, 'móvil'],
  [/EN VIVO/g, 'EN DIRECTO'],
  [/En vivo/g, 'En directo'],
  [/en vivo/g, 'en directo'],
  [/\bVideo\b/g, 'Vídeo'],
  [/\bvideo(s?)\b/g, 'vídeo$1'],
  [/([Ee])n tu computadora/g, '$1n tu PC'],
  [/de tu computadora/g, 'de tu PC'],
  [/ corre /g, ' funciona '],
  [/transmisiones IRL/g, 'directos IRL'],
  [/al aire/g, 'en directo'],
  [/armados/g, 'montados'],
]

function adaptar<T>(valor: T): T {
  if (typeof valor === 'string') return TROCAS.reduce((s, [de, para]) => s.replace(de, para), valor as string) as T
  if (Array.isArray(valor)) return valor.map(adaptar) as T
  if (valor && typeof valor === 'object') {
    return Object.fromEntries(Object.entries(valor).map(([k, v]) => [k, adaptar(v)])) as T
  }
  return valor
}

const base = adaptar(es419)

export const es: Dict = {
  ...base,
  meta: { ...base.meta, lang: 'es-ES', ogLocale: 'es_ES' },
  num: { decimal: ',', thousands: '' },
  hero: {
    ...base.hero,
    off: ['Tu directo', 'se cayó.', 'Otra vez.'],
    on: ['Tu directo', 'sigue', 'en el aire.'],
    ledeOff: {
      ...base.hero.ledeOff,
      long: 'Concierto lleno, todo el mundo colgado de la misma antena, y tu única SIM no aguanta. ',
      short: 'Una sola SIM no aguanta un concierto lleno. ',
    },
    switch: { ...base.hero.switch, offSub: 'Una SIM 4G, sola' },
    chat: { ...base.hero.chat, drop: ['va a tirones', 'lag por aquí', 'se ve todo pixelado', 'el bitrate está cayendo'] },
  },
  pains: {
    ...base.pains,
    title: ['Emitir IRL con una sola SIM es ', 'emitir a la suerte', '.'],
    items: base.pains.items.map((item, i) =>
      i === 3
        ? {
            ...item,
            title: 'El PC encendido en casa, cruzando los dedos',
            text: 'OBS se queda funcionando en tu habitación mientras tú estás en la calle. Si se va la luz o el internet de tu casa, el directo se cae también y no hay nadie para reiniciarlo.',
          }
        : item,
    ),
  },
  canvas: {
    ...base.canvas,
    videoLabel: 'Vídeo de ejemplo: una calle de ciudad de noche vista desde dentro del coche',
  },
  bento: {
    ...base.bento,
    title: 'Todo tu directo IRL en un solo lugar.',
    cams: {
      ...base.bento.cams,
      text: 'Cada cámara aparece en directo en el panel, con el bitrate que está llegando. El equipo ve lo que entra antes de emitirlo.',
    },
    obs: {
      ...base.bento.obs,
      text: 'Un OBS Studio completo funciona en nuestros servidores y lo controlas desde el navegador. El PC de tu casa puede quedarse apagado.',
      pcOff: 'PC apagado',
    },
    h265: { ...base.bento.h265, line2: 'Menos datos de tu tarifa.' },
  },
  pricing: {
    ...base.pricing,
    plans: {
      ...base.pricing.plans,
      advanced: {
        ...base.pricing.plans.advanced,
        badge: 'PC apagado',
        tagline: 'PC apagado: OBS funciona en la nube y lo controlas desde el navegador.',
      },
    },
  },
  faq: { ...base.faq, items: FAQ_ORDER.map((i) => ({ ...FAQ_OFFICIAL.es[i] })) },
  footer: {
    ...base.footer,
    blurb: 'StreamerKit mantiene tus directos IRL en el aire cuando se cae la señal. También conocido como Servidor do Marco.',
  },
}
