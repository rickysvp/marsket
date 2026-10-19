import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('Marsket account experience', () => {
  it('includes a local demo login flow', () => {
    const appSource = readFileSync(new URL('./App.jsx', import.meta.url), 'utf8')

    expect(appSource).toContain('function Login')
    expect(appSource).toContain("rickysvp")
    expect(appSource).toContain('marsket-auth')
    expect(appSource).toContain("path === '/portfolio' || path === '/profile'")
    expect(appSource).toContain('退出登录')
  })

  it('uses one account concept for navigation and the account page', () => {
    const appSource = readFileSync(new URL('./App.jsx', import.meta.url), 'utf8')
    const profileSource = appSource.slice(appSource.indexOf('function Profile'))

    expect(appSource).not.toContain("{ label: '个人设置'")
    expect(appSource).toContain('aria-label="我的账户"')
    expect(appSource).toContain('kicker="ACCOUNT"')
    expect(appSource).toContain('ACCOUNT BREAKDOWN')
    expect(appSource).toContain('持仓明细')
    expect(appSource).toContain('当前市值')
    expect(appSource).toContain('最近交易')
    expect(profileSource).not.toContain('持仓明细')
    expect(profileSource).toContain('资产概览')
  })
})
