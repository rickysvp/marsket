import { CalendarDays, Search } from 'lucide-react'
import { useState } from 'react'

const sportsStates = ['全部','提前结算','现场','未结','已结','取消']
const gameStates = ['全部','未结','已结']
export default function RecordsPage() {
  const [kind,setKind] = useState('体育')
  const [state,setState] = useState('全部')
  const [date,setDate] = useState('近 7 天')
  return <div className="account-page"><header className="page-heading"><div><span className="eyebrow">HISTORY CENTER</span><h1>记录</h1><p>筛选与空态的界面演示</p></div><CalendarDays size={26} color="#4488d8" /></header><div className="record-kind">{['体育','游戏'].map((name) => <button key={name} className={kind === name ? 'is-active' : ''} onClick={() => { setKind(name);setState('全部') }}>{name}</button>)}</div><div className="record-filters"><div>{(kind === '体育' ? sportsStates : gameStates).map((name) => <button key={name} className={state === name ? 'is-active' : ''} onClick={() => setState(name)}>{name}</button>)}</div><select value={date} onChange={(event) => setDate(event.target.value)} aria-label="日期范围">{['今天','近 7 天','近 30 天'].map((name) => <option key={name}>{name}</option>)}</select></div><div className="records-empty"><Search size={40} strokeWidth={1} /><h2>暂无{kind}记录</h2><p>{state} · {date}，当前为演示账户。</p><small>没有连接真实订单或个人数据。</small></div></div>
}
