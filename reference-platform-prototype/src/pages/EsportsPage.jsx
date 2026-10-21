import { Gamepad2, Search } from 'lucide-react'
import { useState } from 'react'
import { navigate } from '../router.js'

const fixtures = {
  LOL: [['星河竞技', '霓虹军团', '职业挑战赛', '今天 19:00'], ['银翼', '暗影峡谷', '大师邀请赛', '明天 18:00']],
  CS2: [['北极星', '电流', '先锋公开赛', '今天 21:30'], ['狂潮', '方舟', '大师赛', '明天 16:00']],
  DOTA2: [['远征者', '晨曦', '传奇联赛', '明天 20:00']],
  VAL: [['蓝图', '夜航', '无畏巡回赛', '今天 22:00']],
}
export default function EsportsPage() {
  const [game, setGame] = useState('LOL')
  const [phase, setPhase] = useState('全部')
  return <div className="sports-page"><header className="page-heading"><div><span className="eyebrow">ESPORTS ARENA</span><h1>电竞赛事</h1><p>项目、赛程和对阵均为演示内容</p></div><Gamepad2 size={29} color="#4287de" /></header><div className="esports-feature"><Gamepad2 size={38} /><div><span>FEATURED TOURNAMENTS</span><h2>下一场对决，从这里开始。</h2><p>选择你关注的电竞项目，浏览演示赛程。</p></div></div><div className="market-tabs">{Object.keys(fixtures).map((name) => <button key={name} className={game === name ? 'is-active' : ''} onClick={() => setGame(name)}>{name}</button>)}</div><div className="sports-toolbar"><div className="sports-toolbar__tabs">{['全部','滚球','即将'].map((name) => <button key={name} className={phase === name ? 'is-active' : ''} onClick={() => setPhase(name)}>{name}</button>)}</div><button className="esport-ball-link" onClick={() => navigate('/sports/esport-ball')}>电竞体育赛程 →</button></div>{phase === '滚球' ? <div className="empty-state"><Search size={28} /><strong>当前没有直播中的{game}赛事</strong><span>试试其他项目或切换即将开赛。</span></div> : <div className="esport-fixtures">{fixtures[game].map(([home,away,competition,time]) => <article className="esport-fixture" key={home}><span className="eyebrow">{competition} · {time}</span><div><strong>{home}</strong><span>VS</span><strong>{away}</strong></div><button onClick={() => navigate('/games/demo-esports/esports-stage')}>查看演示赛场 →</button></article>)}</div>}</div>
}
