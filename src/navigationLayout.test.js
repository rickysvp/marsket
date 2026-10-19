import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('Marsket navigation layout', () => {
  it('renders the primary navigation inside the top bar instead of a left sidebar', () => {
    const appSource = readFileSync(new URL('./App.jsx', import.meta.url), 'utf8')
    const topbarStart = appSource.indexOf('<header className="topbar">')
    const navStart = appSource.indexOf('className="primary-nav"')
    const sidebarStart = appSource.indexOf('<aside className={`sidebar')

    expect(topbarStart).toBeGreaterThan(-1)
    expect(navStart).toBeGreaterThan(topbarStart)
    expect(navStart).toBeLessThan(sidebarStart === -1 ? Number.POSITIVE_INFINITY : sidebarStart)
    expect(appSource).toContain('<Footer onNavigate={navigate} />')
    expect(appSource).not.toContain('更新时间 2026.10.19')
    expect(appSource).not.toContain('MARKET / 01')
    expect(appSource).not.toContain('MY PORTFOLIO / 02')
    expect(appSource).not.toContain('MARKET RANKING / 03')
    expect(appSource).not.toContain('className="back-link"')
    expect(appSource).not.toContain('kicker="MARKETS"')
    expect(appSource).not.toContain('kicker="MY PORTFOLIO"')
    expect(appSource).not.toContain('kicker="RANKINGS"')
  })
})
