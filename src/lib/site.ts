// Links do produto ficam aqui (uma fonte só). Os textos, preços e perguntas
// agora ficam nos dicionários de idioma, em src/i18n/.
// Os links vêm do site atual, https://streamerkit.net, lido em 2026-11-19.

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
}

export type Interval = 'month' | 'year'
