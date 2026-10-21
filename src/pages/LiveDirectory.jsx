import { Radio, Tv2 } from 'lucide-react'
import { useState } from 'react'
import { filterEvents, sportLabels } from '../data/events.js'
import { EventRow } from './SportsList.jsx'

export default function LiveDirectory({ onSelect, onFocus }) {
  const [sport, setSport] = useState('all')
  const visible = filterEvents({ stream: true }).filter((event) => sport === 'all' || event.sport === sport)
  return <div className="sports-page"><header className="page-heading"><div><span className="eyebrow">LIVE CENTER</span><h1>体育直播</h1><p>正在进行的赛事与示例画面</p></div><Radio color="#e25c62" /></header><div className="market-tabs"><button className={sport === 'all' ? 'is-active' : ''} onClick={() => setSport('all')}>全部</button>{[...new Set(filterEvents({ stream: true }).map((event) => event.sport))].map((value) => <button key={value} className={sport === value ? 'is-active' : ''} onClick={() => setSport(value)}>{sportLabels[value]}</button>)}</div><div className="live-directory__grid">{visible.map((event) => <section className="live-directory__item" key={event.id}><button className="live-directory__preview" onClick={() => onFocus(event)}><Tv2 size={25} /><span>点击查看直播预览</span><small>非实时画面</small></button><EventRow event={event} onSelect={onSelect} /></section>)}</div></div>
}
