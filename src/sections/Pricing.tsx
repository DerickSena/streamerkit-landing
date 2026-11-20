import { useState } from 'react'
import { Reveal, SectionHead, spot } from '../components/ui'
import { IconArrow, IconCheck, IconX } from '../components/icons'
import { INCLUDED_IN_BOTH, LINKS, PLANS, type Interval } from '../lib/site'

export function Pricing() {
  const [interval, setCycle] = useState<Interval>('month')
  const year = interval === 'year'

  return (
    <section id="planos" className="section" aria-labelledby="planos-titulo">
      <div className="shell">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHead id="planos-titulo" kicker="Planos" title="Escolha o seu e entre ao vivo.">
            A diferença é quantos celulares ou câmeras transmitem ao mesmo tempo (ingests) e se você quer o OBS na
            nuvem.
          </SectionHead>

          <Reveal delay={0.1} className="flex-none">
            <div className="seg !bg-ink-raised !p-1.5 !shadow-[inset_0_0_0_1px_rgb(247_238_236/0.12)]" role="group" aria-label="Ciclo de cobrança">
              <button type="button" aria-pressed={!year} onClick={() => setCycle('month')} className="!min-h-11 px-5">
                Mensal
              </button>
              <button type="button" aria-pressed={year} onClick={() => setCycle('year')} className="flex !min-h-11 items-center justify-center gap-2 px-5">
                Anual
                <span
                  className="rounded-full px-2 py-0.5 text-[0.6875rem] font-bold leading-tight transition-colors duration-200"
                  style={{ background: year ? '#d92b21' : 'rgb(255 42 28 / 0.18)', color: year ? '#fff' : '#ff8a7f' }}
                >
                  2 meses grátis
                </span>
              </button>
            </div>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-4 lg:mt-14 lg:grid-cols-2">
          {PLANS.map((p, i) => {
            const hero = p.id === 'advanced'
            return (
              <Reveal key={p.id} delay={i * 0.08}>
                <article
                  onPointerMove={spot}
                  className="card card-spot flex h-full flex-col p-6 sm:p-8"
                  style={
                    hero
                      ? {
                          background: 'linear-gradient(160deg, #3a100d 0%, #1d0807 55%)',
                          boxShadow: 'inset 0 0 0 1px rgb(255 42 28 / 0.55), 0 40px 90px -40px rgb(255 42 28 / 0.45)',
                        }
                      : undefined
                  }
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="headline text-[2.5rem] text-paper">{p.name}</h3>
                    <p
                      className="label rounded-full px-3 py-1.5"
                      style={hero ? { background: '#d92b21', color: '#fff' } : { boxShadow: 'inset 0 0 0 1px rgb(247 238 236 / 0.2)', color: '#b8a3a0' }}
                    >
                      {hero ? 'PC desligado' : 'Para começar'}
                    </p>
                  </div>
                  <p className="mt-2 max-w-[26rem] text-[0.9375rem] leading-relaxed text-mute lg:min-h-[3.25rem]">{p.tagline}</p>

                  <div className="mt-7 flex items-end gap-2" aria-live="polite">
                    <span className="mb-2 text-lg font-medium text-mute">R$</span>
                    <span key={interval} className="display text-[clamp(4.25rem,13vw,6rem)] text-paper" style={{ animation: 'price-in 0.45s cubic-bezier(0.16,1,0.3,1)' }}>
                      {p.price[interval]}
                    </span>
                    <span className="mb-2 text-base text-mute">/{year ? 'ano' : 'mês'}</span>
                  </div>
                  <p className="mt-1.5 min-h-[1.5rem] text-sm text-dim">
                    {year ? `Equivale a R$ ${p.perMonthOnYear} por mês. Você paga 10 e usa 12.` : 'No anual, 2 meses saem de graça.'}
                  </p>

                  <a href={LINKS.plan(p.id, interval)} className={`btn mt-7 w-full ${hero ? 'btn-primary' : 'btn-ghost'}`}>
                    Escolher {p.name}
                    <IconArrow className="h-5 w-5" />
                  </a>

                  <ul className="mt-7 grid gap-3 border-t border-paper/10 pt-7 text-[0.9375rem]">
                    {p.features.map((f) => (
                      <li key={f.text} className="flex items-start gap-3" style={{ color: f.on ? '#f7eeec' : '#8f7a77' }}>
                        <span
                          className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full"
                          style={{ background: f.on ? 'rgb(48 209 88 / 0.16)' : 'rgb(247 238 236 / 0.07)', color: f.on ? '#30d158' : '#8f7a77' }}
                        >
                          {f.on ? <IconCheck className="h-3 w-3" /> : <IconX className="h-3 w-3" />}
                        </span>
                        <span>
                          <span className={f.on ? '' : 'line-through decoration-paper/25'}>{f.text}</span>
                          {!f.on && <span className="ml-2 whitespace-nowrap">(só no Avançado)</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            )
          })}
        </div>

        <Reveal className="mt-4">
          <div className="card p-6 sm:p-8">
            <p className="label text-dim">Os dois planos incluem</p>
            <ul className="mt-4 flex flex-wrap gap-x-7 gap-y-3 text-[0.9375rem] text-paper">
              {INCLUDED_IN_BOTH.map((t) => (
                <li key={t} className="flex items-center gap-2.5">
                  <IconCheck className="h-4 w-4 flex-none text-ok" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <p className="mt-6 max-w-[52rem] text-sm leading-relaxed text-dim">
          Você entra com a sua conta da Twitch ou da Kick. Nos planos mensais, cada ingest extra custa R$&nbsp;49,90 por
          mês, com cobrança proporcional, em assinaturas elegíveis no cartão e no Pix Automático.
        </p>
      </div>
    </section>
  )
}
