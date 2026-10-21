import { ArrowLeft, ChevronDown, Radio, Tv2 } from 'lucide-react'
import { useState } from 'react'
import { getEvent } from '../data/events.js'
import { navigate } from '../router.js'

export default function SportEvent({ id, onSelect }) {
  const event = getEvent(id)
  const [group, setGroup] = useState('全部')
  const [closed, setClosed] = useState([])
  if (!event) return <div className="empty-state"><strong>赛事不存在</strong><button onClick={() => navigate('/sports')}>返回体育首页</button></div>
  const groups = ['全部', ...new Set(event.markets.map((market) => market.group))]
  const visible = group === '全部' ? event.markets : event.markets.filter((market) => market.group === group)
  return <div className="sports-page event-detail"><button className="back-link" onClick={() => navigate(`/sports/${event.sport}`)}><ArrowLeft size={15} /> 返回{event.sportLabel}</button><div className="event-scoreboard"><div className="event-scoreboard__top"><span>{event.competition}</span><span>{event.phase === 'live' ? <><Radio size={12} /> 进行中</> : event.period}</span></div><div className="event-scoreboard__teams"><strong>{event.home}</strong><div><small>{event.phase === 'live' ? event.period : event.startLabel}</small><b>{event.score || 'VS'}</b><small>{event.phase === 'live' ? '实时比分演示' : event.period}</small></div><strong>{event.away}</strong></div><div className="event-scoreboard__bottom"><span>{event.sportLabel} · 演示赛事数据</span>{event.stream && <span><Tv2 size={14} /> 有直播预览</span>}</div></div><div className="market-heading"><div><span className="eyebrow">MARKET OVERVIEW</span><h2>全部盘口 <small>{event.markets.length}</small></h2></div><span>赔率仅用于演示</span></div><div className="market-tabs">{groups.map((name) => <button key={name} className={group === name ? 'is-active' : ''} onClick={() => setGroup(name)}>{name}</button>)}</div><div className="market-list">{visible.map((market) => <section className="market-card" key={market.id}><button className="market-card__title" onClick={() => setClosed((current) => current.includes(market.id) ? current.filter((id) => id !== market.id) : [...current, market.id])}><span><b>{market.name}</b><small>{market.group}</small></span><ChevronDown size={16} /></button>{!closed.includes(market.id) && <div className="market-card__options">{market.selections.map((selection) => <button key={selection.id} onClick={() => onSelect(event, market, selection)}><span>{selection.label} {selection.line}</span><strong>{selection.odds.toFixed(2)}</strong></button>)}</div>}</section>)}</div><div className="probability-note"><span>赔率分布示意</span><div>{event.markets[0].selections.map((selection) => <i key={selection.id} style={{ flex: 1 / selection.odds }} />)}</div><small>仅为界面演示，不代表预测结果。</small></div></div>
}
