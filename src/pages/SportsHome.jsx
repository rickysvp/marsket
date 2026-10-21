import { ArrowUpRight, ChevronRight, Radio, Sparkles, Trophy } from 'lucide-react'
import { events, filterEvents, sportLabels } from '../data/events.js'
import { navigate } from '../router.js'
import { EventRow, SportPicker } from './SportsList.jsx'

export default function SportsHome({ onSelect }) {
  const focus = events.find((event) => event.id === 'f2')
  const live = filterEvents({ phase: 'live' }).slice(0, 3)
  const upcoming = filterEvents({ phase: 'upcoming' }).slice(0, 3)
  return <div className="sports-page sports-home">
    <section className="sports-hero"><div className="sports-hero__copy"><div className="sports-hero__tag"><Radio size={13} /> MATCHDAY / 今日焦点</div><h1>每个瞬间，<br /><em>都值得关注。</em></h1><p>赛事、盘口和直播汇聚一处。当前展示为交互演示。</p><button onClick={() => navigate(`/sports/event/${focus.id}`)}>查看焦点赛事 <ArrowUpRight size={17} /></button></div><div className="sports-hero__arena"><span className="sports-hero__circle" /><span className="sports-hero__line" /><span className="sports-hero__glow" /><div className="hero-match"><small>欧洲冠军联赛 · 今晚 23:45</small><div><strong>{focus.home}</strong><b>VS</b><strong>{focus.away}</strong></div><span>更多盘口即将开启</span></div></div></section>
    <section className="home-section"><div className="section-heading"><div><span className="eyebrow">EXPLORE SPORTS</span><h2>赛事分类</h2></div><button onClick={() => navigate('/sports/football')}>查看全部 <ChevronRight size={16} /></button></div><SportPicker current={null} onChoose={(sport) => navigate(`/sports/${sport}`)} /></section>
    <section className="home-section"><div className="section-heading"><div><span className="eyebrow">HAPPENING NOW</span><h2>正在进行 <span className="live-count">{filterEvents({ phase: 'live' }).length} LIVE</span></h2></div><button onClick={() => navigate('/sports/live')}>进入直播 <ChevronRight size={16} /></button></div><div className="home-events">{live.map((event) => <EventRow key={event.id} event={event} onSelect={onSelect} />)}</div></section>
    <section className="home-section smart-picks"><div className="section-heading"><div><span className="eyebrow">SMART PICKS / 演示推荐</span><h2>智选观察</h2></div><Sparkles size={18} /></div><div className="smart-picks__body"><Trophy size={25} /><div><strong>焦点对阵组合</strong><p>浏览热门赛事中的代表性盘口，了解串场选择方式。</p></div><button onClick={() => navigate('/sports/football')}>浏览赛事 <ChevronRight size={16} /></button></div></section>
    <section className="home-section"><div className="section-heading"><div><span className="eyebrow">COMING UP</span><h2>即将开赛</h2></div><button onClick={() => navigate('/sports/football')}>全部赛程 <ChevronRight size={16} /></button></div><div className="home-events">{upcoming.map((event) => <EventRow key={event.id} event={event} onSelect={onSelect} />)}</div></section>
    <footer className="prototype-footer">竞界 · 多品类互动原型 <span>示例赛事、赔率和画面仅用于功能演示</span></footer>
  </div>
}
