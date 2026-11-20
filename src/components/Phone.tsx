import type { ReactNode } from 'react'
import {
  IconBell,
  IconCamera,
  IconGauge,
  IconGear,
  IconGlobe,
  IconGrid,
  IconMic,
  IconMicOff,
  IconMonitor,
  IconPip,
  IconReload,
  IconStealth,
  IconTorch,
} from './icons'
import { useFmt, useT } from '../i18n'

/** iPhone deitado, feito em CSS. O conteúdo da tela entra como children. */
export function Phone({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`phone ${className}`}>
      <div className="phone-body">
        <div className="phone-screen">
          {children}
          <div className="phone-glare" />
        </div>
        <div className="phone-island" />
      </div>
    </div>
  )
}

export type LinkStat = { id: string; label: string; pct: number; color: string; up: boolean }

type PanelProps = {
  bitrate: number
  history: number[]
  links: LinkStat[]
  timer?: string
  muted?: boolean
  torch?: boolean
  pip?: boolean
  sending?: boolean
  reloading?: boolean
  micLevel?: number
}

/** Coluna direita do app StreamerKit: bitrate, conexões somadas e atalhos. */
export function AppPanel({
  bitrate,
  history,
  links,
  timer = '1:24:07',
  muted = false,
  torch = false,
  pip = false,
  sending = true,
  reloading = false,
  micLevel = 0.6,
}: PanelProps) {
  const t = useT()
  const fmt = useFmt()
  const low = bitrate < 1.2
  const max = 8
  const pts = history
    .map((v, i) => `${(i / Math.max(1, history.length - 1)) * 100},${22 - Math.min(1, v / max) * 20}`)
    .join(' ')
  const live = links.filter((l) => l.up && l.pct > 0)
  return (
    <div className="app-panel" aria-hidden="true">
      <div className="flex items-center gap-[0.7cqw] text-[1.25cqw] font-semibold leading-none">
        <span className="rounded-[0.4cqw] bg-white px-[0.45cqw] py-[0.2cqw] text-[0.95cqw] font-bold text-black">80</span>
        <span>21:47</span>
      </div>

      <div className="flex items-end justify-between">
        <div className="flex items-baseline gap-[0.45cqw] leading-none">
          <span
            className="num text-[2.05cqw] font-bold transition-colors duration-300"
            style={{ color: !sending ? '#9c9ca6' : low ? '#ff453a' : '#fff' }}
          >
            {fmt.mbps(sending ? bitrate : 0)}
          </span>
          <span className="text-[1cqw] text-[#9c9ca6]">Mbps</span>
        </div>
        <span className="grid h-[2.3cqw] w-[2.3cqw] place-items-center rounded-[0.7cqw] bg-[#24242a]">
          <IconGear style={{ width: '1.3cqw', height: '1.3cqw' }} />
        </span>
      </div>

      <svg viewBox="0 0 100 24" preserveAspectRatio="none" className="h-[2cqw] w-full">
        <polyline
          points={pts}
          fill="none"
          stroke={low ? '#ff453a' : '#f2f2f5'}
          strokeWidth="1.4"
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
        />
      </svg>

      {/* barra das conexões somadas */}
      <div className="flex h-[0.5cqw] w-full gap-[0.2cqw] overflow-hidden rounded-full bg-[#24242a]">
        {links.map((l) => (
          <span
            key={l.id}
            className="h-full rounded-full transition-[flex-grow,opacity] duration-500"
            style={{ flexGrow: l.up ? Math.max(l.pct, 0.001) : 0, flexBasis: 0, background: l.color, opacity: l.up ? 1 : 0 }}
          />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-x-[0.9cqw] gap-y-[0.2cqw] text-[0.86cqw] leading-none text-[#9c9ca6]">
        {links.map((l) => (
          <span key={l.id} className="inline-flex items-center gap-[0.3cqw]" style={{ opacity: l.up ? 1 : 0.45 }}>
            <i className="inline-block h-[0.5cqw] w-[0.5cqw] rounded-full" style={{ background: l.up ? l.color : '#ff453a' }} />
            {l.label}
            <b className="num font-semibold text-white">{l.up ? `${Math.round(l.pct)}%` : t.common.down}</b>
          </span>
        ))}
        {live.length === 0 && <span className="text-[#ff453a]">{t.common.noSignal}</span>}
      </div>

      <div className="flex items-center gap-[0.6cqw] text-[1.05cqw] font-semibold leading-none">
        {muted ? (
          <IconMicOff style={{ width: '1.2cqw', height: '1.2cqw', color: '#ff453a' }} />
        ) : (
          <IconMic style={{ width: '1.2cqw', height: '1.2cqw', color: '#30d158' }} />
        )}
        <span>Built-in</span>
        <span className="ml-auto h-[0.42cqw] w-[4.2cqw] overflow-hidden rounded-full bg-[#24242a]">
          <span
            className="block h-full rounded-full bg-[#30d158] transition-[width] duration-200"
            style={{ width: `${muted ? 0 : micLevel * 100}%` }}
          />
        </span>
      </div>

      <div className="grid grid-cols-3 gap-[0.55cqw]">
        <Key icon={<IconCamera />} label="Snapshot" />
        <Key icon={<IconReload style={reloading ? { animation: 'spin 0.8s linear infinite' } : undefined} />} label="Reload" on={reloading} />
        <Key icon={<IconGauge />} label="Bitrate" />
        <Key icon={<IconBell />} label="Alerts" />
        <Key icon={<IconStealth />} label="Stealth" />
        <Key icon={<IconGrid />} label="Widgets" />
        <Key icon={<IconPip />} label="PiP" on={pip} />
        <Key icon={<IconGlobe />} label="Translate" />
        <Key icon={<IconMonitor />} label="OBS" />
        <Key icon={muted ? <IconMicOff /> : <IconMic />} label="Mute" warn={muted} />
        <Key icon={<IconTorch />} label="Torch" on={torch} />
        <Key icon={<IconMic />} label="Mic" />
      </div>

      <div
        className="mt-auto flex items-center justify-center gap-[0.6cqw] rounded-[1cqw] py-[0.75cqw] text-[1.05cqw] font-semibold leading-none transition-colors duration-300"
        style={{
          background: sending ? 'rgb(255 69 58 / 0.14)' : '#24242a',
          boxShadow: sending ? 'inset 0 0 0 0.12cqw #ff453a' : 'none',
          color: sending ? '#ff6b5e' : '#9c9ca6',
        }}
      >
        <span>{sending ? 'End' : 'Start'}</span>
        <span className="num">{timer}</span>
      </div>
    </div>
  )
}

function Key({ icon, label, on, warn }: { icon: ReactNode; label: string; on?: boolean; warn?: boolean }) {
  return (
    <div className="app-key" data-on={on ? 'true' : undefined} data-warn={warn ? 'true' : undefined}>
      {icon}
      <span>{label}</span>
    </div>
  )
}
