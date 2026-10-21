import { describe, expect, it } from 'vitest'
import { events, filterEvents, getEvent } from './events.js'
import { games, filterGames, getGame, rankSlotGames } from './games.js'

describe('sports sample catalog', () => {
  it('covers every sports navigation category with unique event and selection IDs', () => {
    const sports = ['football', 'basketball', 'tennis', 'table-tennis', 'badminton', 'baseball', 'esport-ball']
    for (const sport of sports) expect(events.some((event) => event.sport === sport), sport).toBe(true)
    expect(new Set(events.map((event) => event.id)).size).toBe(events.length)
    for (const event of events) {
      expect(Number.isNaN(Date.parse(event.startAt)), event.id).toBe(false)
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

  it('connects each main esports title to a match detail with markets', () => {
    for (const title of ['LOL', 'CS2', 'DOTA2', 'VAL']) {
      const found = filterEvents({ sport: 'esports', gameTitle: title })
      expect(found.length, title).toBeGreaterThan(0)
      expect(getEvent(found[0].id)?.markets[0]?.selections.length).toBeGreaterThan(1)
    }
  })

  it('电竞项目下可按联赛进一步筛选', () => {
    const lol = filterEvents({ sport: 'esports', gameTitle: 'LOL' })
    expect(new Set(lol.map((event) => event.competition)).size).toBeGreaterThan(1)
    const league = lol[0].competition
    expect(filterEvents({ sport: 'esports', gameTitle: 'LOL', competition: league }).every((event) => event.competition === league)).toBe(true)
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
  it('热赔率排序独立于 RTP，最高回报单独按 RTP', () => {
    const slots = filterGames({ type: 'slots' })
    expect(rankSlotGames(slots, '热赔率')[0].oddsHeat).toBe(Math.max(...slots.map((game) => game.oddsHeat)))
    expect(rankSlotGames(slots, '冷赔率')[0].oddsHeat).toBe(Math.min(...slots.map((game) => game.oddsHeat)))
    expect(rankSlotGames(slots, '最高回报')[0].rtp).toBe(Math.max(...slots.map((game) => game.rtp)))
    expect(slots.map((game) => game.id)).not.toEqual(rankSlotGames(slots, '热赔率').map((game) => game.id))
  })
  it('提供可用和暂不可用的游戏承载状态', () => {
    expect(games.some((game) => game.available === false)).toBe(true)
    expect(games.some((game) => game.available === true)).toBe(true)
    expect(filterGames({ type: 'casino' }).some((game) => game.speed === '极速')).toBe(true)
  })
})
