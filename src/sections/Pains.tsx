import { Reveal, SectionHead } from '../components/ui'
import { IconArrow } from '../components/icons'

const PAINS = [
  {
    title: 'Lugar lotado derruba o sinal',
    text: 'Em show, estádio e bloco de rua, milhares de celulares disputam a mesma antena. Com uma conexão só, qualquer oscilação vira imagem quadrada na tela de quem assiste.',
    fix: 'SRTLA bonding',
    href: '#bonding',
  },
  {
    title: 'Caiu a conexão, acabou a live',
    text: 'Sem plano B, a transmissão encerra, o canal fica offline e quem estava assistindo vai para outra live. Voltar ao ar é começar do zero.',
    fix: 'BRB automático',
    href: '#bonding',
  },
  {
    title: 'Você sai do rolê para mexer no celular',
    text: 'Trocar de câmera, dar zoom, mutar o mic, acender a lanterna. Cada ajuste é você parado olhando para a tela em vez de fazer a live.',
    fix: 'Sua equipe controla de longe',
    href: '#controle',
  },
  {
    title: 'PC ligado em casa, torcendo para dar certo',
    text: 'O OBS fica rodando no seu quarto enquanto você está na rua. Se a luz ou a internet de casa cair, a live cai junto e ninguém está lá para religar.',
    fix: 'OBS na nuvem',
    href: '#planos',
  },
]

export function Pains() {
  return (
    <section className="section" aria-labelledby="dores-titulo">
      <div className="shell">
        <SectionHead
          id="dores-titulo"
          kicker="O problema"
          title={
            <>
              Live IRL com um chip só é <span className="text-live">live na sorte</span>.
            </>
          }
        >
          Você conhece a cena: a live está no melhor momento, o sinal oscila e pronto. Não é falta de conteúdo, é falta
          de estrutura.
        </SectionHead>

        <ol className="mt-14 lg:mt-20">
          {PAINS.map((p, i) => (
            <li key={p.title}>
              <Reveal delay={i * 0.05} y={22}>
                <a
                  href={p.href}
                  className="group relative grid gap-x-10 gap-y-3 border-t border-paper/10 py-7 transition-colors duration-300 hover:bg-paper/[0.025] sm:py-9 lg:grid-cols-[5rem_minmax(0,1.15fr)_minmax(0,1fr)_auto] lg:items-center lg:px-4"
                >
                  <span className="absolute inset-x-0 top-[-1px] h-px origin-left scale-x-0 bg-live transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
                  <span className="num text-sm text-dim transition-colors duration-300 group-hover:text-live">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="subhead text-[clamp(1.6rem,3.4vw,2.35rem)] text-paper">{p.title}</h3>
                  <p className="max-w-[34rem] text-[0.9875rem] leading-relaxed text-mute lg:text-base">{p.text}</p>
                  <span className="mt-2 inline-flex w-fit items-center gap-2.5 rounded-full bg-paper/[0.06] py-2 pl-3.5 pr-3 text-sm font-medium text-paper ring-1 ring-paper/10 transition-[background-color,box-shadow] duration-300 group-hover:bg-cta group-hover:ring-cta lg:mt-0">
                    <span className="label !tracking-[0.1em] text-dim transition-colors duration-300 group-hover:text-white/80">
                      Resolve
                    </span>
                    {p.fix}
                    <IconArrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </a>
              </Reveal>
            </li>
          ))}
        </ol>
        <div className="border-t border-paper/10" />
      </div>
    </section>
  )
}
