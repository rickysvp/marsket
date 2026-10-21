import { Maximize2, MessageCircle, Volume2, VolumeX, X } from 'lucide-react'
import { useState } from 'react'

export default function MediaPanel({ title = '赛事直播', subtitle = '选择赛事，查看直播预览', onClose, mobileOpen }) {
  const [muted, setMuted] = useState(true)
  const [tab, setTab] = useState('media')
  return <aside className={`media-panel ${mobileOpen ? 'media-panel--mobile-open' : ''}`}>
    <div className="media-panel__top"><div><span className="eyebrow">LIVE CENTER</span><strong>{title}</strong></div><button className="icon-button media-panel__close" aria-label="关闭媒体面板" onClick={onClose}><X size={17} /></button></div>
    <div className="media-panel__tabs"><button className={tab === 'media' ? 'is-active' : ''} onClick={() => setTab('media')}>直播预览</button><button className={tab === 'chat' ? 'is-active' : ''} onClick={() => setTab('chat')}>聊天室</button></div>
    {tab === 'media' && <div className="media-stage" role="img" aria-label="演示直播画面">
      <div className="media-stage__court"><span className="court-ring" /><span className="court-midline" /><span className="court-dot" /></div>
      <div className="media-stage__gradient" />
      <div className="media-stage__copy"><span className="live-badge"><span /> DEMO LIVE</span><h3>精彩赛场<br />随时开场</h3><p>{subtitle}</p></div>
      <div className="media-stage__controls"><button aria-label={muted ? '取消静音' : '静音'} onClick={() => setMuted(!muted)}>{muted ? <VolumeX size={18} /> : <Volume2 size={18} />}</button><span>预览画面 · 非实时直播</span><button aria-label="放大画面" onClick={(event) => event.currentTarget.closest('.media-stage')?.requestFullscreen?.()}><Maximize2 size={17} /></button></div>
    </div>}
    <div className="chat-panel"><div className="chat-panel__heading"><MessageCircle size={17} /><strong>赛场讨论</strong><span>演示</span></div><div className="chat-panel__empty"><MessageCircle size={42} strokeWidth={1} /><strong>还没有新消息</strong><small>聊天室仅展示界面，不连接实时服务。</small></div><div className="chat-panel__input"><input placeholder="演示模式下暂不发送消息" disabled /><button disabled>发送</button></div></div>
  </aside>
}
