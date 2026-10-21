import { Gamepad2, Search } from 'lucide-react'
import { useState } from 'react'
import { filterEvents } from '../data/events.js'
import { navigate } from '../router.js'
import { EventRow } from './SportsList.jsx'

const titles = ['LOL', 'CS2', 'DOTA2', 'VAL']
const views = ['联赛', '滚球', '早盘', '串场', '冠军', '赛果']

export default function EsportsPage({ onSelect }) {
  const [game, setGame] = useState('LOL')
  const [view, setView] = useState('联赛')
  const [league, setLeague] = useState('all')
  const matches = filterEvents({ sport: 'esports', gameTitle: game })
  const leagues = [...new Set(matches.map((event) => event.competition))]
  const byPhase = view === '滚球' ? matches.filter((event) => event.phase === 'live') : view === '早盘' ? matches.filter((event) => event.phase === 'upcoming') : view === '联赛' || view === '串场' ? matches : []
  const visible = league === 'all' ? byPhase : byPhase.filter((event) => event.competition === league)
  const chooseGame = (title) => { setGame(title); setLeague('all') }
  return <div className="sports-page">
    <header className="page-heading"><div><span className="eyebrow">ESPORTS ARENA</span><h1>电竞赛事</h1><p>项目、赛程与盘口均为演示内容</p></div><Gamepad2 size={29} color="#4287de" /></header>
    <div className="esports-feature"><Gamepad2 size={38} /><div><span>FEATURED TOURNAMENTS</span><h2>下一场对决，从这里开始。</h2><p>选择电竞项目，浏览示例对阵与盘口。</p></div></div>
    <div className="market-tabs">{titles.map((name) => <button key={name} className={game === name ? 'is-active' : ''} onClick={() => chooseGame(name)}>{name}</button>)}</div>
    <div className="sports-toolbar"><div className="sports-toolbar__tabs">{views.map((name) => <button key={name} className={view === name ? 'is-active' : ''} onClick={() => setView(name)}>{name}</button>)}</div><button className="esport-ball-link" onClick={() => navigate('/sports/esport-ball')}>电竞体育赛程 →</button></div>
    <div className="esports-filters"><label>联赛 <select aria-label="电竞联赛" value={league} onChange={(event) => setLeague(event.target.value)}><option value="all">全部联赛</option>{leagues.map((name) => <option key={name} value={name}>{name}</option>)}</select></label><span>{visible.length} 场演示赛事</span></div>
    {visible.length ? <div className="esport-fixtures">{visible.map((event) => <section className="esport-fixture" key={event.id}><span className="eyebrow">{event.competition} · {event.period}</span><EventRow event={event} onSelect={onSelect} /></section>)}</div> : <div className="empty-state"><Search size={28} /><strong>当前没有{game}的{view}赛事</strong><span>试试其他项目、联赛或赛程标签。</span></div>}
  </div>
}
