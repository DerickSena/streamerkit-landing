import { MotionConfig } from 'motion/react'
import { LocaleProvider, type Dict, type Locale } from './i18n'
import { Nav } from './sections/Nav'
import { Hero } from './sections/Hero'
import { Pains } from './sections/Pains'
import { Bonding } from './sections/Bonding'
import { Remote } from './sections/Remote'
import { CanvasDemo } from './sections/CanvasDemo'
import { Bento } from './sections/Bento'
import { Steps } from './sections/Steps'
import { Pricing } from './sections/Pricing'
import { Faq } from './sections/Faq'
import { FinalCta } from './sections/FinalCta'
import { Footer } from './sections/Footer'
import { StickyCta } from './sections/StickyCta'

export default function App({ locale, dict }: { locale: Locale; dict: Dict }) {
  return (
    <LocaleProvider locale={locale} dict={dict}>
      <MotionConfig reducedMotion="user">
        <Nav />
        <main id="conteudo">
          <Hero />
          <Pains />
          <Bonding />
          <Remote />
          <CanvasDemo />
          <Bento />
          <Steps />
          <Pricing />
          <Faq />
          <FinalCta />
        </main>
        <Footer />
        <StickyCta />
      </MotionConfig>
    </LocaleProvider>
  )
}
