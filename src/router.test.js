import { describe, expect, it } from 'vitest'
import { resolveRoute } from './router.js'

describe('resolveRoute', () => {
  const mainRoutes = {
    '/sports': 'sports-home',
    '/sports/live': 'live-directory',
    '/esports': 'esports',
    '/casino': 'casino',
    '/board': 'board',
    '/lottery': 'lottery',
    '/slots': 'slots',
    '/jackpots': 'jackpots',
    '/account': 'account',
    '/records': 'records',
  }

  for (const [path, page] of Object.entries(mainRoutes)) {
    it(`resolves ${path} to ${page}`, () => {
      expect(resolveRoute(path)).toEqual({ page, params: {} })
    })
  }

  it('resolves sports category and event deep links', () => {
    expect(resolveRoute('/sports/football')).toEqual({ page: 'sports-list', params: { sport: 'football' } })
    expect(resolveRoute('/sports/event/e1')).toEqual({ page: 'sport-event', params: { id: 'e1' } })
  })

  it('keeps provider identity in a game deep link', () => {
    expect(resolveRoute('/games/p1/g1')).toEqual({ page: 'game', params: { providerId: 'p1', gameId: 'g1' } })
  })

  it('returns not-found for an unknown path', () => {
    expect(resolveRoute('/nowhere')).toEqual({ page: 'not-found', params: {} })
  })
})
