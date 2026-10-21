import { describe, expect, it } from 'vitest'
import { events, filterEvents, getEvent } from './events.js'
import { games, filterGames, getGame } from './games.js'

describe('sports sample catalog', () => {
  it('covers every sports navigation category with unique event and selection IDs', () => {
    const sports = ['football', 'basketball', 'tennis', 'table-tennis', 'badminton', 'baseball', 'esport-ball']
    for (const sport of sports) expect(events.some((event) => event.sport === sport), sport).toBe(true)
    expect(new Set(events.map((event) => event.id)).size).toBe(events.length)
    for (const event of events) {
      expect(event.markets.length, event.id).toBeGreaterThan(0)
      expect(new Set(event.markets.flatMap((market) => market.selections.map((selection) => selection.id))).size)
        .toBe(event.markets.flatMap((market) => market.selections).length)
    }
  })

  it('filters by sport, phase and a team or competition query', () => {
    expect(filterEvents({ sport: 'basketball' }).every((event) => event.sport === 'basketball')).toBe(true)
    expect(filterEvents({ phase: 'live' }).every((event) => event.phase === 'live')).toBe(true)
    expect(filterEvents({ query: '海港' }).some((event) => event.home.includes('海港'))).toBe(true)
  })

  it('applies an upcoming time window without hiding live games from other views', () => {
    expect(filterEvents({ phase: 'upcoming', windowHours: 3 })).toEqual([])
    expect(filterEvents({ phase: 'upcoming', windowHours: 12 }).some((event) => event.id === 'f2')).toBe(true)
  })

  it('returns the same event used by deep links', () => {
    expect(getEvent(events[0].id)).toBe(events[0])
    expect(getEvent('missing')).toBeUndefined()
  })
})

describe('游戏目录', () => {
  it('供应商与游戏组合唯一，三种类型均有详情', () => {
    expect(new Set(games.map((game) => `${game.providerId}/${game.id}`)).size).toBe(games.length)
    for (const type of ['casino', 'board', 'slots']) expect(games.some((game) => game.type === type)).toBe(true)
    expect(getGame('evo', 'baccarat-1')?.name).toBe('经典百家乐')
  })
  it('按类别、供应商和搜索筛选', () => {
    expect(filterGames({ type: 'board', providerId: 'jdb' }).every((game) => game.type === 'board' && game.providerId === 'jdb')).toBe(true)
    expect(filterGames({ query: '麻将' }).some((game) => game.name.includes('麻将'))).toBe(true)
    expect(filterGames({ type: 'slots', tag: '热门' }).every((game) => game.type === 'slots')).toBe(true)
  })
})
