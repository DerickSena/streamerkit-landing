import type { ReactNode } from 'react'
import { IconDiscord, IconInstagram, IconTiktok, IconXLogo } from '../components/icons'
import { LINKS } from '../lib/site'
import { LOCALES, useLocale, useT } from '../i18n'
import { rememberLocale } from '../components/LangSwitcher'

const PRODUCT_HREFS = ['#bonding', '#controle', '#canvas', '#planos']

export function Footer() {
  const t = useT()
  const locale = useLocale()
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
              {t.footer.blurb}
            </p>
          </div>
          <FootCol title={t.footer.product}>
            {t.footer.productLinks.map((label, i) => (
              <FootLink key={PRODUCT_HREFS[i]} href={PRODUCT_HREFS[i]}>
                {label}
              </FootLink>
            ))}
          </FootCol>
          <FootCol title={t.footer.account}>
            <FootLink href={LINKS.login}>{t.nav.login}</FootLink>
            <FootLink href={LINKS.help}>{t.footer.help}</FootLink>
            <FootLink href={LINKS.support}>{t.footer.support}</FootLink>
            <FootLink href="#duvidas">{t.footer.faq}</FootLink>
          </FootCol>
          <FootCol title={t.footer.social}>
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
        <p>{t.footer.rights}</p>
        <nav aria-label={t.nav.langAria} className="flex flex-wrap gap-x-5 gap-y-2">
          {LOCALES.map((l) =>
            l.id === locale ? (
              <span key={l.id} className="font-semibold text-paper">
                {l.label}
              </span>
            ) : (
              <a
                key={l.id}
                href={l.path}
                hrefLang={l.hreflang[0]}
                lang={l.hreflang[0]}
                onClick={() => rememberLocale(l.id)}
                className="transition-colors hover:text-paper"
              >
                {l.label}
              </a>
            ),
          )}
        </nav>
        <nav aria-label={t.footer.legalAria} className="flex flex-wrap gap-x-5 gap-y-2">
          <a href={LINKS.privacy} className="transition-colors hover:text-paper">
            {t.footer.privacy}
          </a>
          <a href={LINKS.terms} className="transition-colors hover:text-paper">
            {t.footer.terms}
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
