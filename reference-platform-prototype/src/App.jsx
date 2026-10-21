import { useEffect, useState } from 'react'
import { resolveRoute } from './router.js'
import Shell from './components/Shell.jsx'
import SportsHome from './pages/SportsHome.jsx'
import SportsList from './pages/SportsList.jsx'
import SportEvent from './pages/SportEvent.jsx'
import LiveDirectory from './pages/LiveDirectory.jsx'
import EsportsPage from './pages/EsportsPage.jsx'
import GameLobbies from './pages/GameLobbies.jsx'
import GameDetail from './pages/GameDetail.jsx'
import JackpotPage from './pages/JackpotPage.jsx'
import LotteryPage from './pages/LotteryPage.jsx'
import AccountPage from './pages/AccountPage.jsx'
import RecordsPage from './pages/RecordsPage.jsx'
import { navigate } from './router.js'
import BetSlip from './components/BetSlip.jsx'
import { useSlip } from './state/useSlip.js'
import './styles/tokens.css'
import './styles/layout.css'
import './styles/sports.css'
import './styles/games.css'
import './styles/account.css'
import './styles/responsive.css'

export default function App() {
  const [route, setRoute] = useState(() => resolveRoute(window.location.pathname))
  const [focusedEvent, setFocusedEvent] = useState(null)
  const slip = useSlip()
  useEffect(() => {
    const update = () => setRoute(resolveRoute(window.location.pathname))
    window.addEventListener('popstate', update)
    return () => window.removeEventListener('popstate', update)
  }, [])
  let content
  if (route.page === 'sports-home') content = <SportsHome onSelect={slip.select} />
  else if (route.page === 'sports-list') content = <SportsList key={route.params.sport} sport={route.params.sport} onSelect={slip.select} />
  else if (route.page === 'sport-event') content = <SportEvent key={route.params.id} id={route.params.id} onSelect={slip.select} />
  else if (route.page === 'live-directory') content = <LiveDirectory onSelect={slip.select} onFocus={setFocusedEvent} />
  else if (route.page === 'esports') content = <EsportsPage />
  else if (['casino','board','slots'].includes(route.page)) content = <GameLobbies key={route.page} type={route.page} />
  else if (route.page === 'game') content = <GameDetail key={`${route.params.providerId}/${route.params.gameId}`} {...route.params} />
  else if (route.page === 'jackpots') content = <JackpotPage />
  else if (route.page === 'lottery') content = <LotteryPage />
  else if (route.page === 'account') content = <AccountPage />
  else if (route.page === 'records') content = <RecordsPage />
  else content = <div className="page-placeholder"><span className="eyebrow">PAGE NOT FOUND</span><h1>这页暂时找不到</h1><p>返回首页，继续探索竞界互动原型。</p><button onClick={() => navigate('/sports')}>返回首页 →</button></div>
  return <Shell path={window.location.pathname} sidePanel={slip.open ? <BetSlip slip={slip} /> : null} mediaTitle={focusedEvent && route.page === 'live-directory' ? `${focusedEvent.home} VS ${focusedEvent.away}` : route.page === 'live-directory' ? '体育直播' : '精选赛事'} mediaSubtitle={focusedEvent && route.page === 'live-directory' ? `${focusedEvent.competition} · 示例预览` : undefined}>{content}</Shell>
}
