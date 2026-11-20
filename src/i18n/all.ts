// Todos os idiomas de uma vez. Só o build (prerender.mjs, via entry-server.tsx) usa este arquivo;
// o navegador baixa um idioma por vez, pelos LOADERS de index.tsx.
import type { Dict, Locale } from './index'
import { pt } from './pt'
import { en } from './en'
import { es419 } from './es419'
import { es } from './es'
import { de } from './de'
import { fr } from './fr'
import { it } from './it'
import { ja } from './ja'
import { ko } from './ko'
import { zh } from './zh'

export const DICTS: Record<Locale, Dict> = { pt, en, es, 'es-419': es419, de, fr, it, ja, ko, zh }
