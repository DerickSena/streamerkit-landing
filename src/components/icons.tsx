import type { ReactNode, SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>

function Ico({ children, ...p }: P & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...p}
    >
      {children}
    </svg>
  )
}

export const IconArrow = (p: P) => (
  <Ico {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Ico>
)
export const IconArrowDown = (p: P) => (
  <Ico {...p}>
    <path d="M12 5v14M6 13l6 6 6-6" />
  </Ico>
)
export const IconCheck = (p: P) => (
  <Ico {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Ico>
)
export const IconX = (p: P) => (
  <Ico {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Ico>
)
export const IconPlus = (p: P) => (
  <Ico {...p}>
    <path d="M12 5v14M5 12h14" />
  </Ico>
)
export const IconEye = (p: P) => (
  <Ico {...p}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
    <circle cx="12" cy="12" r="2.8" />
  </Ico>
)
export const IconChat = (p: P) => (
  <Ico {...p}>
    <path d="M4 5.5h16v10.5H10l-4.5 3.5V16H4z" />
  </Ico>
)
export const IconCamera = (p: P) => (
  <Ico {...p}>
    <path d="M4 8h3.2l1.6-2.5h6.4L16.8 8H20v11H4z" />
    <circle cx="12" cy="13.2" r="3.3" />
  </Ico>
)
export const IconReload = (p: P) => (
  <Ico {...p}>
    <path d="M20 11.5a8 8 0 1 0-2.4 6.2" />
    <path d="M20 5.5v6h-6" />
  </Ico>
)
export const IconGauge = (p: P) => (
  <Ico {...p}>
    <path d="M4.5 17a8.5 8.5 0 1 1 15 0" />
    <path d="M12 14l4-5" />
  </Ico>
)
export const IconBell = (p: P) => (
  <Ico {...p}>
    <path d="M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 2H5z" />
    <path d="M10 20.5h4" />
  </Ico>
)
export const IconStealth = (p: P) => (
  <Ico {...p}>
    <path d="M3 12s3.2-5.5 9-5.5S21 12 21 12s-3.2 5.5-9 5.5S3 12 3 12z" />
    <path d="M4.5 19.5l15-15" />
  </Ico>
)
export const IconGrid = (p: P) => (
  <Ico {...p}>
    <rect x="4" y="4" width="6.5" height="6.5" rx="1.2" />
    <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.2" />
    <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.2" />
    <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.2" />
  </Ico>
)
export const IconPip = (p: P) => (
  <Ico {...p}>
    <rect x="3.5" y="5" width="17" height="14" rx="2" />
    <rect x="12" y="11.5" width="6" height="5" rx="1" fill="currentColor" stroke="none" />
  </Ico>
)
export const IconGlobe = (p: P) => (
  <Ico {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17M12 3.5c2.6 2.4 2.6 14.6 0 17M12 3.5c-2.6 2.4-2.6 14.6 0 17" />
  </Ico>
)
export const IconMonitor = (p: P) => (
  <Ico {...p}>
    <rect x="3.5" y="4.5" width="17" height="11.5" rx="1.8" />
    <path d="M9 20h6M12 16v4" />
  </Ico>
)
export const IconMic = (p: P) => (
  <Ico {...p}>
    <rect x="9" y="3.5" width="6" height="11" rx="3" />
    <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3" />
  </Ico>
)
export const IconMicOff = (p: P) => (
  <Ico {...p}>
    <path d="M15 10V6.5a3 3 0 0 0-5.6-1.5M9 9v2.5a3 3 0 0 0 4.6 2.5" />
    <path d="M5.5 11.5a6.5 6.5 0 0 0 10.6 5M18.5 11.5c0 .8-.1 1.5-.4 2.2M12 18v3M4 4l16 16" />
  </Ico>
)
export const IconTorch = (p: P) => (
  <Ico {...p}>
    <path d="M8 3.5h8v3.2l-2 3V20a.5.5 0 0 1-.5.5h-3A.5.5 0 0 1 10 20V9.7l-2-3z" />
    <path d="M8 6.7h8M12 12v2.5" />
  </Ico>
)
export const IconGear = (p: P) => (
  <Ico {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8" />
  </Ico>
)
export const IconFlip = (p: P) => (
  <Ico {...p}>
    <path d="M4 8.5h3l1.5-2h7l1.5 2h3v10H4z" />
    <path d="M9.5 13.5a2.7 2.7 0 0 1 4.8-1.4M14.5 13.5a2.7 2.7 0 0 1-4.8 1.4" />
  </Ico>
)
export const IconUser = (p: P) => (
  <Ico {...p}>
    <circle cx="12" cy="8.5" r="3.5" />
    <path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.200 1.900 7 5.500" />
  </Ico>
)
export const IconZoom = (p: P) => (
  <Ico {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16l4.500 4.500M8.500 11h5M11 8.500v5" />
  </Ico>
)
export const IconStop = (p: P) => (
  <Ico {...p}>
    <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" stroke="none" />
  </Ico>
)
export const IconPlay = (p: P) => (
  <Ico {...p}>
    <path d="M8 5.500v13l10.500-6.500z" fill="currentColor" stroke="none" />
  </Ico>
)
export const IconPin = (p: P) => (
  <Ico {...p}>
    <path d="M12 21s6.500-6 6.500-11a6.500 6.500 0 0 0-13 0c0 5 6.500 11 6.500 11z" />
    <circle cx="12" cy="10" r="2.300" />
  </Ico>
)
export const IconClock = (p: P) => (
  <Ico {...p}>
    <circle cx="12" cy="12" r="8.500" />
    <path d="M12 7.500V12l3 2" />
  </Ico>
)
export const IconSpeed = (p: P) => (
  <Ico {...p}>
    <path d="M13 3.500L5.500 13.500H11l-1 7 7.500-10H12z" />
  </Ico>
)
export const IconCloud = (p: P) => (
  <Ico {...p}>
    <path d="M7 18.500a4.500 4.500 0 0 1-.6-8.960A6 6 0 0 1 18 10.800a3.900 3.900 0 0 1-.5 7.700z" />
  </Ico>
)
export const IconSignal = (p: P) => (
  <Ico {...p}>
    <path d="M5 19v-3M10 19v-7M15 19V8M20 19V4" />
  </Ico>
)
export const IconWifi = (p: P) => (
  <Ico {...p}>
    <path d="M3 9.500a13 13 0 0 1 18 0M6 13a8.500 8.500 0 0 1 12 0M9 16.500a4.300 4.300 0 0 1 6 0" />
    <circle cx="12" cy="19.500" r="0.900" fill="currentColor" />
  </Ico>
)
export const IconShield = (p: P) => (
  <Ico {...p}>
    <path d="M12 3.500l7 2.500v5.500c0 4.500-3 7.800-7 9-4-1.200-7-4.500-7-9V6z" />
    <path d="M9 12l2.200 2.200L15.200 10" />
  </Ico>
)
export const IconPower = (p: P) => (
  <Ico {...p}>
    <path d="M12 3.500v8M7 6.500a7.500 7.500 0 1 0 10 0" />
  </Ico>
)
export const IconHand = (p: P) => (
  <Ico {...p}>
    <path d="M9 11V5.500a1.500 1.500 0 0 1 3 0V10m0-.5V4.500a1.500 1.500 0 0 1 3 0V10m0-3.500a1.500 1.500 0 0 1 3 0V14c0 4-2.500 6.500-6.500 6.500-3 0-4.500-1.200-6-3.700L3.800 13.500a1.500 1.500 0 0 1 2.500-1.700L9 14.500" />
  </Ico>
)
export const IconCursor = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...p}>
    <path d="M5 3.500l13.500 7.200-6 1.600-2.200 6.200z" fill="currentColor" stroke="#000" strokeWidth="1.200" strokeLinejoin="round" />
  </svg>
)

// Marcas das redes do rodapé (formas simples, sem logotipo oficial detalhado).
export const IconDiscord = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...p}>
    <path d="M19.300 5.600A16 16 0 0 0 15.300 4.300l-.5 1a14.600 14.600 0 0 0-5.600 0l-.5-1a16 16 0 0 0-4 1.300C2.100 9.500 1.400 13.300 1.700 17a16.300 16.300 0 0 0 5 2.500l1-1.700a10 10 0 0 1-1.700-.8l.4-.3a11.500 11.500 0 0 0 11.200 0l.4.3c-.5.300-1.100.600-1.700.800l1 1.700a16.300 16.300 0 0 0 5-2.500c.4-4.300-.7-8-3-11.400zM8.700 14.700c-1 0-1.800-.900-1.800-2s.800-2 1.800-2 1.800.900 1.800 2-.8 2-1.800 2zm6.600 0c-1 0-1.800-.900-1.800-2s.8-2 1.800-2 1.800.900 1.800 2-.8 2-1.800 2z" />
  </svg>
)
export const IconInstagram = (p: P) => (
  <Ico {...p}>
    <rect x="4" y="4" width="16" height="16" rx="4.500" />
    <circle cx="12" cy="12" r="3.600" />
    <circle cx="16.800" cy="7.200" r="0.800" fill="currentColor" />
  </Ico>
)
export const IconXLogo = (p: P) => (
  <Ico {...p}>
    <path d="M5 4.500l14 15M19 4.500l-14 15" />
  </Ico>
)
export const IconTiktok = (p: P) => (
  <Ico {...p}>
    <path d="M13.500 4v10.500a3.500 3.500 0 1 1-3.500-3.500M13.500 4c.3 2.500 2 4.200 4.500 4.500" />
  </Ico>
)
