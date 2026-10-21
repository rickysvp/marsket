const fixedRoutes = {
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

export function resolveRoute(pathname) {
  const path = pathname === '/' ? '/sports' : pathname.replace(/\/$/, '')
  if (fixedRoutes[path]) return { page: fixedRoutes[path], params: {} }

  const event = path.match(/^\/sports\/event\/([^/]+)$/)
  if (event) return { page: 'sport-event', params: { id: decodeURIComponent(event[1]) } }

  const game = path.match(/^\/games\/([^/]+)\/([^/]+)$/)
  if (game) return {
    page: 'game',
    params: { providerId: decodeURIComponent(game[1]), gameId: decodeURIComponent(game[2]) },
  }

  const sport = path.match(/^\/sports\/(football|basketball|tennis|table-tennis|badminton|baseball|esport-ball)$/)
  if (sport) return { page: 'sports-list', params: { sport: sport[1] } }
  return { page: 'not-found', params: {} }
}

export function navigate(path) {
  window.history.pushState(null, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}
