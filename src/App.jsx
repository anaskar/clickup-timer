import { useEffect, useMemo, useState } from 'react'
import { DateTime, Duration } from 'luxon'

/** Brand vars used via CSS custom properties (set here for safety) */
const BRAND = {
  ink: '#0B0E14',      // canvas
  panel: '#121722',    // cards
  purple: '#7B68EE',
  pink: '#FD71AF',
  sky: '#49CCF9',
  yellow: '#FFC800',
}

function useCountdown(target) {
  const [now, setNow] = useState(DateTime.now())
  useEffect(() => {
    const id = setInterval(() => setNow(DateTime.now()), 1000)
    return () => clearInterval(id)
  }, [])
  return useMemo(() => {
    let diff = target.diff(now, ['days','hours','minutes','seconds']).shiftTo('days','hours','minutes','seconds')
    if (diff.toMillis() < 0) diff = Duration.fromObject({ days:0, hours:0, minutes:0, seconds:0 })
    return {
      days: Math.floor(diff.days),
      hours: Math.floor(diff.hours),
      minutes: Math.floor(diff.minutes),
      seconds: Math.floor(diff.seconds),
    }
  }, [now, target])
}

function TimeBlock({ label, value }) {
  return (
    <div className="flex flex-col items-center rounded-2xl px-4 py-3 bg-white/5 border border-white/10">
      <div className="text-4xl md:text-5xl font-extrabold tabular-nums text-white">
        {String(value).padStart(2,'0')}
      </div>
      <div className="text-[10px] uppercase tracking-wide text-white/60 mt-1">{label}</div>
    </div>
  )
}

function CountdownCard({ title, subtitle, target }) {
  const t = useMemo(() => target.setZone('America/Los_Angeles'), [target])
  const { days, hours, minutes, seconds } = useCountdown(t)

  return (
    <div className="w-full rounded-3xl p-6 md:p-8 bg-[color:var(--panel)]/70 backdrop-blur-xl border border-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight drop-shadow-[0_0_24px_rgba(123,104,238,0.55)]">
          {title}
        </h2>
        {subtitle && <span className="text-sm text-white/70">{subtitle}</span>}
      </div>

      <div className="grid grid-cols-4 gap-3 md:gap-4 mt-6 max-w-xl">
        <TimeBlock label="Days"    value={days} />
        <TimeBlock label="Hours"   value={hours} />
        <TimeBlock label="Minutes" value={minutes} />
        <TimeBlock label="Seconds" value={seconds} />
      </div>

      <div className="mt-6 h-px w-full bg-gradient-to-r from-[color:var(--purple)] via-[color:var(--pink)] to-[color:var(--sky)] opacity-60" />
      <div className="mt-3 text-xs text-white/70">
        Target: {t.toFormat("MMM dd, yyyy 'at' hh:mm:ss a 'PT'")}
      </div>
    </div>
  )
}

export default function App() {
  // Targets (PT)
  const endOfQ3   = DateTime.fromISO('2025-10-31T23:59:59', { zone: 'America/Los_Angeles' })
  const endOfFY26 = DateTime.fromISO('2026-01-31T23:59:59', { zone: 'America/Los_Angeles' })

  // Ensure CSS variables exist even if index.css wasn’t updated yet
  useEffect(() => {
    const r = document.documentElement
    r.style.setProperty('--ink', BRAND.ink)
    r.style.setProperty('--panel', BRAND.panel)
    r.style.setProperty('--purple', BRAND.purple)
    r.style.setProperty('--pink', BRAND.pink)
    r.style.setProperty('--sky', BRAND.sky)
    r.style.setProperty('--yellow', BRAND.yellow)
  }, [])

  return (
    <div className="min-h-screen w-full bg-[color:var(--ink)] text-white">
      {/* Soft radial accents (like Brain/MAX) */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0"
             style={{
               background: `
                 radial-gradient(800px 600px at 15% 10%, rgba(123,104,238,0.20), transparent 60%),
                 radial-gradient(700px 500px at 85% 20%, rgba(253,113,175,0.15), transparent 60%),
                 radial-gradient(900px 700px at 30% 90%, rgba(73,204,249,0.12), transparent 60%)
               `
             }} />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 md:py-14">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-[0_0_24px_rgba(123,104,238,0.55)]">
            ClickUp • Every Second Counts
          </h1>
          <span className="text-xs md:text-sm text-white/70">Live, second-by-second</span>
        </header>

        <section className="mt-8 grid gap-6">
          <CountdownCard
            title="Countdown to End of Q3"
            subtitle="Q3 ends Oct 31, 2025 at 11:59:59 PM PT"
            target={endOfQ3}
          />
          <CountdownCard
            title="Countdown to End of FY'26"
            subtitle="FY'26 ends Jan 31, 2026 at 11:59:59 PM PT"
            target={endOfFY26}
          />
        </section>

        <footer className="mt-10 md:mt-14 text-xs text-white/60">
          Built with vibes and urgency. Times anchored to America/Los_Angeles (PT).
        </footer>
      </div>
    </div>
  )
}
