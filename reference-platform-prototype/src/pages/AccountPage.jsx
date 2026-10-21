import { Bell, ChevronRight, CircleHelp, Cog, CreditCard, Gift, History, LifeBuoy, ShieldCheck, UserRound, Wallet } from 'lucide-react'
import { useState } from 'react'
import { navigate } from '../router.js'

const groups = [
  ['常用功能', [['记录','/records',History],['优惠广场',null,Gift],['消息中心',null,Bell]]],
  ['钱包', [['充值',null,Wallet],['提现',null,CreditCard],['资金记录',null,History]]],
  ['设置与帮助', [['游戏设置',null,Cog],['系统设置',null,ShieldCheck],['帮助中心',null,LifeBuoy]]],
]
export default function AccountPage() {
  const [notice,setNotice] = useState('')
  return <div className="account-page"><div className="account-hero"><div className="account-avatar"><UserRound size={27} /></div><div><span className="eyebrow">MY SPACE</span><h1>我的竞界</h1><p>演示账户 · 不连接真实用户资料</p></div></div><div className="balance-panel"><span>演示余额</span><strong>¥ 0.00</strong><small>此处仅展示界面，不支持充值、提现或账户绑定。</small></div>{notice && <div className="account-notice"><CircleHelp size={16}/>{notice}<button onClick={() => setNotice('')}>关闭</button></div>}{groups.map(([heading,links]) => <section className="account-group" key={heading}><h2>{heading}</h2><div>{links.map(([name,path,Icon]) => <button key={name} onClick={() => path ? navigate(path) : setNotice(`${name}为演示入口，暂不采集个人信息或执行资金操作。`)}><Icon size={19} /><span>{name}</span><ChevronRight size={16} /></button>)}</div></section>)}</div>
}
