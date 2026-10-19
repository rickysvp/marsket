import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('Marsket account experience', () => {
  it('uses one account concept for navigation and the account page', () => {
    const appSource = readFileSync(new URL('./App.jsx', import.meta.url), 'utf8')

    expect(appSource).not.toContain("{ label: '个人设置'")
    expect(appSource).toContain('aria-label="我的账户"')
    expect(appSource).toContain('ACCOUNT OVERVIEW')
    expect(appSource).toContain('ACCOUNT BREAKDOWN')
    expect(appSource).toContain('持仓明细')
    expect(appSource).toContain('当前市值')
    expect(appSource).toContain('最近交易')
  })
})
