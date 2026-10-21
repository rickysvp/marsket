import { CalendarDays, ChevronDown, ChevronRight, Radio, Search, Star, Tv2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { events, filterEvents, sportLabels } from '../data/events.js'
import { navigate } from '../router.js'

const sportOrder = ['football', 'basketball', 'tennis', 'table-tennis', 'esport-ball', 'badminton', 'baseball']

export function SportPicker({ current, onChoose }) {
  return <div className="sport-picker" aria-label="运动分类">{sportOrder.map((sport) => <button key={sport} className={current === sport ? 'is-active' : ''} onClick={() => onChoose(sport)}><span className="sport-picker__orb">{sportLabels[sport].slice(0, 1)}</span>{sportLabels[sport]}</button>)}</div>
}

export function EventRow({ event, onSelect }) {
  const compactMarkets = event.markets.slice(0, 3)
  return <article className="event-row">
    <div className="event-row__identity">
      <span className={`event-status ${event.phase === 'live' ? 'event-status--live' : ''}`}>{event.phase === 'live' ? <Radio size={11} /> : <CalendarDays size={11} />}{event.startLabel}</span>
      <button className="event-row__match" onClick={() => navigate(`/sports/event/${event.id}`)}><strong>{event.home}</strong><span>VS</span><strong>{event.away}</strong><ChevronRight size={14} /></button>
      <div className="event-row__meta"><span>{event.period}</span>{event.score && <b>{event.score}</b>}{event.stream && <Tv2 size={13} />}<span>{event.markets.length * 8}+ 盘口</span></div>
    </div>
    <div className="event-row__markets">{compactMarkets.map((market) => <div key={market.id} className="event-market"><span className="event-market__label">{market.group}</span><div>{market.selections.slice(0, 2).map((selection) => <button key={selection.id} onClick={() => onSelect?.(event, market, selection) || navigate(`/sports/event/${event.id}`)} title={`${market.name} ${selection.label} · 演示赔率`}><small>{selection.line ? `${selection.label} ${selection.line}` : selection.label}</small><strong>{selection.odds.toFixed(2)}</strong></button>)}</div></div>)}</div>
  </article>
}

export function LeagueList({ items, onSelect }) {
  const leagues = [...new Set(items.map((event) => event.competition))]
  return <div className="league-list">{leagues.map((league) => <section key={league} className="league-section"><div className="league-section__heading"><span className="league-section__mark" /><strong>{league}</strong><span>{items.filter((event) => event.competition === league).length} 场</span><ChevronDown size={15} /></div>{items.filter((event) => event.competition === league).map((event) => <EventRow key={event.id} event={event} onSelect={onSelect} />)}</section>)}</div>
}

export default function SportsList({ sport, onSelect }) {
  const [phase, setPhase] = useState('all')
  const [query, setQuery] = useState('')
  const [windowHours, setWindowHours] = useState(0)
  const [favorites, setFavorites] = useState(false)
  const visible = useMemo(() => filterEvents({ sport, phase: phase === 'early' ? 'upcoming' : phase, query, windowHours, favorites }), [sport, phase, query, windowHours, favorites])
  return <div className="sports-page">
    <header className="page-heading"><div><span className="eyebrow">SPORTS CENTER / {sport?.toUpperCase()}</span><h1>{sportLabels[sport] || '体育赛事'}</h1><p>赛程、比分与盘口预览 · 全部为演示数据</p></div><span className="page-heading__count">{events.filter((event) => event.sport === sport).length} <small>场赛事</small></span></header>
    <SportPicker current={sport} onChoose={(next) => navigate(`/sports/${next}`)} />
    <div className="sports-toolbar"><div className="sports-toolbar__tabs">{[['all', '联赛'], ['live', '滚球'], ['upcoming', '即将'], ['early', '早盘']].map(([value, label]) => <button key={value} className={phase === value ? 'is-active' : ''} onClick={() => { setPhase(value); setWindowHours(0) }}>{label}</button>)}</div><button className={`toolbar-icon ${favorites ? 'is-active' : ''}`} onClick={() => setFavorites(!favorites)} title="仅看收藏"><Star size={17} fill={favorites ? 'currentColor' : 'none'} /></button></div>
    <div className="sports-search-row"><label className="search-box"><Search size={17} /><input data-global-search placeholder="搜索联赛或队伍" value={query} onChange={(event) => setQuery(event.target.value)} /><span>⌘ K</span></label>{(phase === 'upcoming' || phase === 'early') && <div className="time-filters">{[0, 3, 6, 12, 24].map((hour) => <button key={hour} className={windowHours === hour ? 'is-active' : ''} onClick={() => setWindowHours(hour)}>{hour || '全部'}{hour ? 'h' : ''}</button>)}</div>}</div>
    {visible.length ? <LeagueList items={visible} onSelect={onSelect} /> : <div className="empty-state"><Search size={32} /><strong>没有符合条件的赛事</strong><span>试试其他运动、时段或搜索词。</span><button onClick={() => { setQuery(''); setWindowHours(0); setFavorites(false); setPhase('all') }}>清除筛选</button></div>}
  </div>
}
