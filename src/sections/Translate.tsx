import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useInView, useReducedMotion } from 'motion/react'
import { Reveal, SectionHead } from '../components/ui'
import { CUES, type CapLang } from '../lib/captions'
import { LOCALES, fill, useLocale, useT, type Locale } from '../i18n'

/*
 * Tradução ao vivo: o vídeo do JonVlogs com a legenda desenhada por cima e um painel, cópia da tela
 * "Tradução ao Vivo" do produto, que troca o idioma, a posição e o tamanho da legenda.
 */

/** Páginas cujo idioma também tem legenda própria: o botão dele entra primeiro na lista. */
const OWN_CAPTION: Partial<Record<Locale, CapLang>> = { de: 'de', it: 'it', ja: 'ja', ko: 'ko', zh: 'zh' }

/** Idioma da legenda que já vem marcado. Na página em inglês mostra português, porque o vídeo é falado em inglês. */
function startLang(locale: Locale): CapLang {
  const own = OWN_CAPTION[locale]
  if (own) return own
  if (locale === 'es' || locale === 'es-419') return 'es'
  if (locale === 'fr') return 'fr'
  return 'pt'
}

type Pos = 'bottom' | 'top'

export function Translate() {
  const t = useT()
  const T = t.translate
  const locale = useLocale()
  const own = OWN_CAPTION[locale]
  const audience: { id: CapLang; label: string }[] = [
    ...(own ? [{ id: own, label: LOCALES.find((l) => l.id === locale)?.label ?? '' }] : []),
    { id: 'pt', label: T.langs.pt },
    { id: 'en', label: T.langs.en },
    { id: 'es', label: T.langs.es },
    { id: 'fr', label: T.langs.fr },
  ]
  const [on, setOn] = useState(true)
  const [lang, setLang] = useState<CapLang>(() => startLang(locale))
  const [pos, setPos] = useState<Pos>('bottom')
  const [size, setSize] = useState(24)
  const [muted, setMuted] = useState(true)
  const [idx, setIdx] = useState(-1)
  const wrap = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const inView = useInView(wrap, { margin: '120px 0px' })
  const reduce = useReducedMotion()

  useEffect(() => {
    const v = video.current
    if (!v) return
    if (inView && !reduce) v.play().catch(() => {})
    else v.pause()
  }, [inView, reduce])

  // Acompanha o tempo do vídeo e troca a fala só quando muda.
  useEffect(() => {
    if (!inView) return
    let raf = 0
    const tick = () => {
      const t = video.current?.currentTime ?? 0
      let found = -1
      for (let i = 0; i < CUES.length; i++) {
        if (t >= CUES[i].a && t < CUES[i].b + 0.35) found = i
      }
      setIdx((cur) => (cur === found ? cur : found))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView])

  const showing = on
  const cue = idx >= 0 ? CUES[idx] : null
  const prev = cue && idx > 0 && cue.a - CUES[idx - 1].b < 1.2 ? CUES[idx - 1] : null
  const audienceLabel = audience.find((a) => a.id === lang)?.label ?? ''

  return (
    <section id="traducao" className="section" aria-labelledby="traducao-titulo">
      <div className="shell">
        <SectionHead
          id="traducao-titulo"
          kicker={T.kicker}
          title={
            <>
              {T.title[0]} <span className="text-live">{T.title[1]}</span>
            </>
          }
        >
          {T.lede}
        </SectionHead>

        <div className="mt-10 grid items-start gap-x-10 gap-y-4 lg:mt-14 lg:grid-cols-12 lg:grid-rows-[auto_1fr]">
          {/* no celular o vídeo fica preso no topo enquanto a pessoa mexe no painel */}
          <Reveal className="max-lg:sticky max-lg:top-[4.25rem] max-lg:z-10 lg:col-span-7 xl:col-span-8">
            <div
              ref={wrap}
              className="cap-stage relative overflow-hidden rounded-2xl border border-line bg-ink-deep shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]"
              style={{ aspectRatio: '16 / 10', '--cap-fs': size } as CSSProperties}
            >
              <video
                ref={video}
                src="/media/traducao-rv.mp4"
                poster="/media/traducao-rv.webp"
                muted={muted}
                loop
                playsInline
                preload="metadata"
                className="absolute inset-0 h-full w-full object-cover"
                aria-label={T.videoLabel}
              />
              {showing && (
                <div className="cap" data-pos={pos}>
                  {prev && (
                    <p className="max-sm:hidden">
                      <span>{prev[lang]}</span>
                    </p>
                  )}
                  {cue && (
                    <p>
                      <span>{cue[lang]}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          </Reveal>

          <div className="lg:col-span-7 xl:col-span-8">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="label rounded-full bg-ink-raised px-3 py-2 text-mute">{T.audio}</span>
              <span className="label rounded-full bg-ink-raised px-3 py-2 text-mute">
                {showing ? fill(T.capIn, { l: audienceLabel }) : T.capOff}
              </span>
              <button
                type="button"
                onClick={() => setMuted((m) => !m)}
                aria-pressed={!muted}
                className="label rounded-full border border-brick px-3.5 py-2 text-paper transition-colors hover:bg-ink-raised"
              >
                {muted ? T.soundOn : T.soundOff}
              </button>
            </div>
            <p className="mt-4 max-w-[36rem] text-[0.8125rem] leading-relaxed text-dim">{T.note}</p>
          </div>

          <Reveal delay={0.1} className="max-lg:mt-4 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 xl:col-span-4 xl:col-start-9">
            <p className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.9375rem] text-mute">
              <span className="label flex items-center gap-2 text-live">
                <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-live" />
                {T.tryIt}
              </span>
              {T.tryText}
            </p>

            <div className="tl-panel">
              <h3 className="text-lg font-semibold text-[#f2edec]">{T.panel.title}</h3>

              <button type="button" role="switch" aria-checked={on} onClick={() => setOn((v) => !v)} className="mt-5 flex items-center gap-3 text-[0.9375rem] text-[#f2edec]">
                <span className="switch" />
                {T.panel.enable}
              </button>

              <fieldset className="mt-6" disabled={!on}>
                <legend className="tl-label">{T.panel.audience}</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {audience.map((a) => (
                    <button key={a.id} type="button" className="tl-chip" aria-pressed={lang === a.id} onClick={() => setLang(a.id)}>
                      {a.label}
                    </button>
                  ))}
                </div>

                <label className="tl-label mt-5 block" htmlFor="tl-pos">
                  {T.panel.position}
                </label>
                <select id="tl-pos" className="tl-select mt-2" value={pos} onChange={(e) => setPos(e.target.value as Pos)}>
                  <option value="bottom">{T.panel.bottom}</option>
                  <option value="top">{T.panel.top}</option>
                </select>

                <div className="mt-5 flex items-center justify-between">
                  <label className="tl-label" htmlFor="tl-size">
                    {T.panel.size}
                  </label>
                  <output htmlFor="tl-size" className="tl-label tabular-nums text-[#f2edec]">
                    {size}
                  </output>
                </div>
                <input
                  id="tl-size"
                  type="range"
                  className="tl-range mt-1"
                  min={16}
                  max={48}
                  step={1}
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  style={{ '--fill': `${((size - 16) / 32) * 100}%` } as CSSProperties}
                />
              </fieldset>
            </div>
            <p className="mt-4 text-[0.875rem] leading-relaxed text-dim">{T.after}</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
