import type { ReactNode } from 'react'
import { IconDiscord, IconInstagram, IconTiktok, IconXLogo } from '../components/icons'
import { LINKS } from '../lib/site'

export function Footer() {
  const social = [
    ['Discord', LINKS.discord, IconDiscord],
    ['Instagram', LINKS.instagram, IconInstagram],
    ['X', LINKS.x, IconXLogo],
    ['TikTok', LINKS.tiktok, IconTiktok],
  ] as const
  return (
    <footer className="relative overflow-hidden pb-28 pt-16 sm:pb-12">
      <div className="shell">
        <div className="hairline mb-12" />
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))]">
          <div>
            <img src="/logo-horizontal-light.svg" alt="StreamerKit" width={134} height={36} loading="lazy" className="h-9 w-auto" />
            <p className="mt-4 max-w-[20rem] text-[0.9375rem] leading-relaxed text-mute">
              O StreamerKit mantém lives IRL no ar quando o sinal cai. Também conhecido como Servidor do Marco.
            </p>
          </div>
          <FootCol title="Produto">
            <FootLink href="#bonding">Como segura a live</FootLink>
            <FootLink href="#controle">Controle remoto</FootLink>
            <FootLink href="#canvas">Canvas com widgets</FootLink>
            <FootLink href="#planos">Planos</FootLink>
          </FootCol>
          <FootCol title="Conta e ajuda">
            <FootLink href={LINKS.login}>Entrar</FootLink>
            <FootLink href={LINKS.help}>Central de ajuda</FootLink>
            <FootLink href={LINKS.support}>Suporte</FootLink>
            <FootLink href="#duvidas">Perguntas frequentes</FootLink>
          </FootCol>
          <FootCol title="Redes">
            {social.map(([n, h, I]) => (
              <a
                key={n}
                href={h}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-9 items-center gap-2.5 text-[0.9375rem] text-mute transition-colors duration-200 hover:text-paper"
              >
                <I className="h-4 w-4" /> {n}
              </a>
            ))}
          </FootCol>
        </div>
      </div>

      {/* nome gigante, de ponta a ponta */}
      <p
        aria-hidden="true"
        className="display pointer-events-none mt-14 select-none whitespace-nowrap text-center text-[21.5vw] leading-[0.8] text-transparent"
        style={{ WebkitTextStroke: '1px rgb(247 238 236 / 0.16)' }}
      >
        StreamerKit
      </p>

      <div className="shell mt-8 flex flex-col gap-4 text-[0.8125rem] text-dim lg:flex-row lg:items-center lg:justify-between">
        <p>© 2026 StreamerKit. Todos os direitos reservados.</p>
        <nav aria-label="Idiomas" className="flex flex-wrap gap-x-5 gap-y-2">
          <span className="font-semibold text-paper">Português</span>
          <a href={LINKS.en} className="transition-colors hover:text-paper">
            English
          </a>
          <a href={LINKS.es} className="transition-colors hover:text-paper">
            Español (España)
          </a>
          <a href={LINKS.es419} className="transition-colors hover:text-paper">
            Español (Latinoamérica)
          </a>
        </nav>
        <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-2">
          <a href={LINKS.privacy} className="transition-colors hover:text-paper">
            Política de Privacidade
          </a>
          <a href={LINKS.terms} className="transition-colors hover:text-paper">
            Termos de Serviço
          </a>
        </nav>
      </div>
    </footer>
  )
}

function FootCol({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="label mb-3 text-dim">{title}</p>
      <div className="flex flex-col">{children}</div>
    </div>
  )
}

function FootLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="flex min-h-9 items-center text-[0.9375rem] text-mute transition-colors duration-200 hover:text-paper">
      {children}
    </a>
  )
}
