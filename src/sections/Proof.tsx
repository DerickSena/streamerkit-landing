import { Reveal } from '../components/ui'
import { useT } from '../i18n'

/** Streamers que autorizaram citar o nome (a classe .label mostra em caixa alta). */
const STREAMERS = [
  'jon vlogs',
  'tota',
  'dona',
  'sheviii2k',
  'kosky',
  'fontinellerj',
  'jhowrj',
  'andreachinii',
  'cerol',
  'diegohiga',
  'moicano',
  'mctuto',
]

function Names({ copy = false }: { copy?: boolean }) {
  return (
    <ul className={`proof-names${copy ? ' proof-copy' : ''}`} aria-hidden={copy || undefined}>
      {STREAMERS.map((name) => (
        <li key={name} className="label flex items-center whitespace-nowrap text-paper/80">
          {name}
          <span aria-hidden="true" className="proof-dot mx-5 h-1 w-1 flex-none rounded-full bg-live sm:mx-6" />
        </li>
      ))}
    </ul>
  )
}

/** Faixa de prova logo abaixo do topo: números de uso e quem já transmite. */
export function Proof() {
  const t = useT()
  return (
    <section aria-labelledby="prova-titulo" className="relative py-10 sm:py-14 lg:py-16">
      <div className="shell grid items-center gap-x-12 gap-y-9 lg:grid-cols-12">
        <ul className="grid grid-cols-2 gap-6 sm:gap-10 lg:col-span-5">
          {t.proof.stats.map((s, i) => (
            <li key={s.label}>
              <Reveal delay={i * 0.06} y={20}>
                <p className="display text-[clamp(3.6rem,15vw,6rem)] whitespace-nowrap tabular-nums text-paper">{s.value}</p>
                <p className="label mt-3 max-w-[13rem] text-mute">{s.label}</p>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delay={0.1} y={20} className="min-w-0 lg:col-span-7">
          <h2 id="prova-titulo" className="label mb-4 flex items-center gap-3 text-live">
            <span className="h-px w-8 bg-live" />
            {t.proof.title}
          </h2>
          <div className="proof-marquee relative overflow-hidden rounded-xl py-4 shadow-[inset_0_0_0_1px_rgb(247_238_236/0.08)]">
            <div className="proof-track">
              <Names />
              <Names copy />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
