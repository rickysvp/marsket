import { BookOpen, CalendarDays, CircleHelp, Ticket } from 'lucide-react'
import { useState } from 'react'

const tabs = [['大厅',Ticket],['投注记录',CalendarDays],['开奖历史',CalendarDays],['彩票规则',BookOpen]]
export default function LotteryPage() {
  const [tab,setTab] = useState('大厅')
  return <div className="games-page"><header className="page-heading"><div><span className="eyebrow">LOTTERY CENTER</span><h1>彩票</h1><p>入口与界面结构示意</p></div><Ticket size={28} color="#4488d8" /></header><div className="lottery-notice"><CircleHelp size={20} /><div><strong>玩法资料待核实</strong><span>参考页面未展示可验证的玩法、奖期或规则。此处只演示导航与空态，不提供选号或购买功能。</span></div></div><div className="lottery-tabs">{tabs.map(([name,Icon]) => <button key={name} className={tab === name ? 'is-active' : ''} onClick={() => setTab(name)}><Icon size={17} />{name}</button>)}</div><div className="lottery-empty"><Ticket size={45} strokeWidth={1} /><h2>{tab}</h2><p>{tab === '大厅' ? '彩票大厅的实际玩法暂未确认。' : `${tab}的具体资料暂未确认。`}</p><span>演示页面 · 待真实资料完善</span></div></div>
}
