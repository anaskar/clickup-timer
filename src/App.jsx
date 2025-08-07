import { useEffect, useMemo, useState } from 'react'
import { DateTime, Duration } from 'luxon'

const colors = {
  primary: '#7B68EE',
  hotPink: '#FD71AF',
  sky: '#49CCF9',
  yellow: '#FFC800',
  ink: '#292D34',
  white: '#FFFFFF',
}

function useCountdown(target) {
  const [now, setNow] = useState(DateTime.now())

  useEffect(() => {
    const id = setInterval(() => setNow(DateTime.now()), 1000)
    return () => clearInterval(id)
  }, [])

  return useMemo(() => {
    let diff = target.diff(now, ['days','hours','minutes','seconds']).shiftTo('days','hours','minutes','seconds')
    if (diff.toMillis() < 0) diff = Duration.fromObject({ days: 0, hours: 0, minutes: 0, seconds: 0 })
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
    <div className="flex flex-col items-center rounded-2xl shadow-md px-4 py-3 bg-white/80 backdrop-blur">
      <div className="text-4xl md:text-5xl font-bold tabular-nums text-[color:var(--ink)]">
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-xs uppercase tracking-wide text-[color:var(--ink)]/70">{label}</div>
    </div>
  )
}

function CountdownCard({ title, subtitle, target }) {
  const t = useMemo(() => target.setZone('America/Los_Angeles'), [target])
  const { days, hours, minutes, seconds } = useCountdown(t)

  return (
    <div className="w-full rounded-3xl p-6 md:p-8 bg-gradient-to-br from-[color:var(--primary)] via-[color:var(--hotPink)] to-[color:var(--sky)] text-white shadow-xl">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
        <h2 className="text-2xl md:text-3xl font-extrabold drop-shadow-sm">{title}</h2>
        {subtitle && <span className="text-sm opacity-90">{subtitle}</span>}
      </div>

      <div className="grid grid-cols-4 gap-3 md:gap-4 mt-6 max-w-xl">
        <TimeBlock label="Days" value={days} />
        <TimeBlock label="Hours" value={hours} />
        <TimeBlock label="Minutes" value={minutes} />
        <TimeBlock label="Seconds" value={seconds} />
      </div>

      <div className="mt-4 text-xs opacity-90">
        Target: {t.toFormat("MMM dd, yyyy 'at' hh:mm:ss a 'PT'")}
      </div>
    </div>
  )
}

export default function App() {
  const endOfQ3 = DateTime.fromISO('2025-10-31T23:59:59', { zone: 'America/Los_Angeles' })
  const endOfFY26 = DateTime.fromISO('2026-01-31T23:59:59', { zone: 'America/Los_Angeles' })

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--primary', colors.primary)
    root.style.setProperty('--hotPink', colors.hotPink)
    root.style.setProperty('--sky', colors.sky)
    root.style.setProperty('--yellow', colors.yellow)
    root.style.setProperty('--ink', colors.ink)
  }, [])

  return (
    <div className="min-h-screen w-full bg-[color:var(--ink)] text-white">
      <div className="max-w-5xl mx-auto px-4 py-10 md:py-14">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-extrabold">
            ClickUp • Time to Win
          </h1>
          <div className="text-xs md:text-sm opacity-80">Live, second-by-second</div>
        </header>

        <section className="mt-8 grid gap-6">
          <CountdownCard
            title={'Countdown to End of Q3'}
            subtitle={'Q3 ends Oct 31, 2025 at 11:59:59 PM PT'}
            target={endOfQ3}
          />
          <CountdownCard
            title={"Countdown to End of FY'26"}
            subtitle={"FY'26 ends Jan 31, 2026 at 11:59:59 PM PT"}
            target={endOfFY26}
          />
        </section>

        <footer className="mt-10 md:mt-14 text-xs opacity-70">
          Built with React + Tailwind + Luxon. Times are anchored to America/Los_Angeles (PT).
        </footer>
      </div>
    </div>
  )
}
