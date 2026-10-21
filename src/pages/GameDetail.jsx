import { AlertCircle, ArrowLeft, LoaderCircle, Maximize2, Play, Volume2, VolumeX } from 'lucide-react'
import { useEffect, useState } from 'react'
import { filterGames, getGame } from '../data/games.js'
import { navigate } from '../router.js'
import { GameCard } from './GameLobbies.jsx'

export default function GameDetail({ providerId, gameId }) {
  const game = getGame(providerId, gameId)
  const [muted, setMuted] = useState(true)
  const [phase, setPhase] = useState('cover')
  useEffect(() => {
    if (phase !== 'loading') return undefined
    const timer = setTimeout(() => setPhase('ready'), 650)
    return () => clearTimeout(timer)
  }, [phase])
  if (!game) return <div className="empty-state"><strong>找不到这个游戏</strong><button onClick={() => navigate('/casino')}>返回游戏目录</button></div>
  const back = game.type === 'slots' ? '/slots' : game.type === 'board' ? '/board' : game.type === 'esports' ? '/esports' : '/casino'
  const related = filterGames({ type: game.type }).filter((item) => item.id !== game.id || item.providerId !== game.providerId).slice(0, 4)
  const unavailable = !game.available
  return <div className="games-page game-detail">
    <button className="back-link" onClick={() => navigate(back)}><ArrowLeft size={15} /> 返回目录</button>
    <div className="game-detail__title"><div><span className="eyebrow">DEMO GAME / {game.provider}</span><h1>{game.name}</h1><p>{game.category} · {game.provider} · 原创演示内容</p></div><span className="game-detail__status">{unavailable ? '暂不可用' : '演示模式'}</span></div>
    <div className={`game-stage game-stage--${game.cover}`}><div className="game-stage__rings" /><div className="game-stage__content"><span>竞界 · GAME STUDIO</span><div className="game-stage__glyph">{phase === 'loading' ? <LoaderCircle className="game-stage__spinner" size={65} /> : unavailable ? <AlertCircle size={70} /> : game.type === 'casino' ? '♠' : game.type === 'slots' ? '✦' : '◈'}</div><h2>{unavailable ? '演示桌台暂不可用' : phase === 'loading' ? '正在准备演示场景…' : phase === 'ready' ? '演示场景已开启' : game.name}</h2><p>{unavailable ? '这个示例用于展示供应商不可用时的回退状态。' : phase === 'ready' ? '这里展示原创界面占位，不连接第三方游戏或真实账户。' : phase === 'loading' ? '正在载入原创演示内容' : '点击下方按钮，查看游戏承载页的交互状态。'}</p>{unavailable ? <button onClick={() => navigate(back)}>浏览其他游戏</button> : <button disabled={phase === 'loading'} onClick={() => setPhase(phase === 'cover' ? 'loading' : 'cover')}><Play size={15} /> {phase === 'ready' ? '返回封面' : phase === 'loading' ? '载入中' : '开始演示'}</button>}</div><div className="game-stage__controls"><button aria-label={muted ? '取消静音' : '静音'} onClick={() => setMuted(!muted)}>{muted ? <VolumeX size={16} /> : <Volume2 size={16} />}</button><span>演示画面 · 无真实游戏</span><button aria-label="全屏" onClick={(event) => event.currentTarget.closest('.game-stage')?.requestFullscreen?.()}><Maximize2 size={16} /></button></div></div>
    <div className="game-detail__meta"><span>供应商 <strong>{game.provider}</strong></span><span>类型 <strong>{game.category}</strong></span><span>状态 <strong>{unavailable ? '暂不可用' : '演示可用'}</strong></span>{game.rtp && <span>示例 RTP <strong>{game.rtp}%</strong></span>}{game.volatility && <span>波动性 <strong>{game.volatility}</strong></span>}</div>
    <div className="games-heading"><div><span className="eyebrow">EXPLORE MORE</span><h2>更多游戏</h2></div></div><div className="game-grid">{related.map((item) => <GameCard game={item} key={`${item.providerId}/${item.id}`} />)}</div>
  </div>
}
