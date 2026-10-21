export const sportLabels = {
  football: '足球', basketball: '篮球', tennis: '网球', 'table-tennis': '乒乓球',
  badminton: '羽毛球', baseball: '棒球', 'esport-ball': '电竞体育', esports: '电竞',
}

const rawEvents = [
  { id: 'f1', sport: 'football', competition: '亚洲冠军精英联赛', home: '上海海港', away: '横滨水手', phase: 'live', period: '上半场 34′', score: '1 : 0', startLabel: '进行中', stream: true, favorite: true, markets: [
    ['全场独赢', '独赢', [['主胜', 1.72], ['平局', 3.45], ['客胜', 4.85]]], ['让球', '让球', [['上海海港', 1.88, '-0.5'], ['横滨水手', 1.94, '+0.5']]], ['总进球', '总分', [['大', 1.86, '2.5'], ['小', 1.96, '2.5']]], ['上半场总进球', '半场', [['大', 1.91, '1.5'], ['小', 1.89, '1.5']]],
  ] },
  { id: 'f2', sport: 'football', competition: '欧洲冠军联赛', home: '科莫', away: '曼联', phase: 'upcoming', period: '今晚 23:45', score: null, startLabel: '9 小时后', stream: false, favorite: false, markets: [
    ['全场独赢', '独赢', [['主胜', 2.34], ['平局', 3.85], ['客胜', 2.90]]], ['亚洲让球', '让球', [['科莫', 1.84, '+0.5'], ['曼联', 1.96, '-0.5']]], ['总进球', '总分', [['大', 1.91, '2.5'], ['小', 1.91, '2.5']]],
  ] },
  { id: 'f3', sport: 'football', competition: '欧洲冠军联赛', home: '里尔', away: '加拉塔萨雷', phase: 'upcoming', period: '今晚 23:45', score: null, startLabel: '9 小时后', stream: false, favorite: true, markets: [
    ['全场独赢', '独赢', [['主胜', 2.28], ['平局', 3.70], ['客胜', 3.10]]], ['总进球', '总分', [['大', 1.84, '2.5'], ['小', 1.98, '2.5']]],
  ] },
  { id: 'b1', sport: 'basketball', competition: '东亚篮球邀请赛', home: '湾区蓝鲸', away: '京都飞隼', phase: 'live', period: '第二节 07:42', score: '42 : 38', startLabel: '进行中', stream: true, favorite: false, markets: [
    ['获胜者', '独赢', [['湾区蓝鲸', 1.54], ['京都飞隼', 2.36]]], ['让分', '让球', [['湾区蓝鲸', 1.82, '-3.5'], ['京都飞隼', 1.88, '+3.5']]], ['全场总分', '总分', [['大', 1.90, '164.5'], ['小', 1.80, '164.5']]], ['主队得分', '球队', [['大', 1.86, '82.5'], ['小', 1.84, '82.5']]], ['上半场让分', '半场', [['湾区蓝鲸', 1.80, '-1.5'], ['京都飞隼', 1.90, '+1.5']]],
  ] },
  { id: 'b2', sport: 'basketball', competition: '国际篮球巡回赛', home: '马尼拉海鹰', away: '首尔骑士', phase: 'upcoming', period: '明日 18:30', score: null, startLabel: '明日', stream: false, favorite: false, markets: [
    ['获胜者', '独赢', [['马尼拉海鹰', 1.78], ['首尔骑士', 2.05]]], ['全场总分', '总分', [['大', 1.86, '158.5'], ['小', 1.86, '158.5']]],
  ] },
  { id: 't1', sport: 'tennis', competition: '亚洲公开赛 · 男单', home: '林昀', away: '顾舟', phase: 'live', period: '第二盘 · 第 6 局', score: '6–4  2–3', startLabel: '进行中', stream: true, favorite: false, markets: [
    ['获胜者', '独赢', [['林昀', 1.62], ['顾舟', 2.24]]], ['让局', '让球', [['林昀', 1.86, '-1.5'], ['顾舟', 1.88, '+1.5']]], ['总局数', '总分', [['大', 1.94, '22.5'], ['小', 1.78, '22.5']]],
  ] },
  { id: 'p1', sport: 'table-tennis', competition: '城市挑战赛 · 男单', home: '陈子昂', away: '黄立', phase: 'live', period: '第三局', score: '2 : 1', startLabel: '进行中', stream: false, favorite: false, markets: [
    ['获胜者', '独赢', [['陈子昂', 1.44], ['黄立', 2.62]]], ['让分', '让球', [['陈子昂', 1.82, '-4.5'], ['黄立', 1.88, '+4.5']]], ['总分', '总分', [['大', 1.91, '76.5'], ['小', 1.81, '76.5']]],
  ] },
  { id: 'd1', sport: 'badminton', competition: '羽联超级赛 · 女单', home: '周苒', away: '金夏恩', phase: 'upcoming', period: '明日 11:00', score: null, startLabel: '明日', stream: false, favorite: false, markets: [
    ['获胜者', '独赢', [['周苒', 1.71], ['金夏恩', 2.12]]], ['总局数', '总分', [['大', 1.94, '2.5'], ['小', 1.78, '2.5']]],
  ] },
  { id: 'a1', sport: 'baseball', competition: '洲际棒球冠军赛', home: '东京风暴', away: '台北领航者', phase: 'upcoming', period: '明日 19:00', score: null, startLabel: '明日', stream: false, favorite: false, markets: [
    ['获胜者', '独赢', [['东京风暴', 1.76], ['台北领航者', 2.06]]], ['总分', '总分', [['大', 1.86, '8.5'], ['小', 1.86, '8.5']]],
  ] },
  { id: 'eb1', sport: 'esport-ball', competition: '电竞足球 · 8 分钟联赛', home: '曼城 (NOVA)', away: '巴黎 (RIFT)', phase: 'live', period: '05:12', score: '2 : 1', startLabel: '进行中', stream: true, favorite: false, markets: [
    ['获胜者', '独赢', [['曼城 (NOVA)', 1.66], ['平局', 3.72], ['巴黎 (RIFT)', 3.10]]], ['总进球', '总分', [['大', 1.84, '4.5'], ['小', 1.94, '4.5']]],
  ] },
  { id: 'eb2', sport: 'esport-ball', competition: '电竞篮球 · 4×5 分钟联赛', home: '洛杉矶 (VECTOR)', away: '波士顿 (ECHO)', phase: 'upcoming', period: '今晚 21:10', score: null, startLabel: '6 小时后', stream: false, favorite: false, markets: [
    ['获胜者', '独赢', [['洛杉矶 (VECTOR)', 1.82], ['波士顿 (ECHO)', 1.98]]], ['总分', '总分', [['大', 1.88, '79.5'], ['小', 1.88, '79.5']]],
  ] },
  { id: 'es1', sport: 'esports', gameTitle: 'LOL', competition: '星际挑战赛 · LOL', home: '星河竞技', away: '霓虹军团', phase: 'live', period: 'BO3 · 第 2 局', score: '1 : 0', startLabel: '进行中', stream: true, favorite: true, markets: [
    ['比赛获胜者','独赢',[['星河竞技',1.58],['霓虹军团',2.28]]],['地图数量','总分',[['大',1.82,'2.5'],['小',1.92,'2.5']]],['下一局获胜者','单局',[['星河竞技',1.69],['霓虹军团',2.08]]],
  ] },
  { id: 'es2', sport: 'esports', gameTitle: 'CS2', competition: '先锋公开赛 · CS2', home: '北极星', away: '电流', phase: 'upcoming', period: 'BO3 · 今晚 21:30', score: null, startLabel: '今晚', stream: false, favorite: false, markets: [
    ['比赛获胜者','独赢',[['北极星',1.88],['电流',1.92]]],['地图数量','总分',[['大',1.86,'2.5'],['小',1.86,'2.5']]],
  ] },
  { id: 'es3', sport: 'esports', gameTitle: 'DOTA2', competition: '传奇联赛 · DOTA2', home: '远征者', away: '晨曦', phase: 'upcoming', period: 'BO3 · 明日 20:00', score: null, startLabel: '明日', stream: false, favorite: false, markets: [
    ['比赛获胜者','独赢',[['远征者',1.74],['晨曦',2.02]]],['总击杀','总分',[['大',1.87,'49.5'],['小',1.83,'49.5']]],
  ] },
  { id: 'es4', sport: 'esports', gameTitle: 'VAL', competition: '无畏巡回赛 · VAL', home: '蓝图', away: '夜航', phase: 'upcoming', period: 'BO3 · 今晚 22:00', score: null, startLabel: '今晚', stream: false, favorite: false, markets: [
    ['比赛获胜者','独赢',[['蓝图',1.66],['夜航',2.16]]],['地图数量','总分',[['大',1.90,'2.5'],['小',1.80,'2.5']]],
  ] },
  { id: 'es5', sport: 'esports', gameTitle: 'LOL', competition: '大师邀请赛 · LOL', home: '银翼', away: '暗影峡谷', phase: 'upcoming', period: 'BO5 · 明日 18:00', score: null, startLabel: '明日', stream: false, favorite: false, markets: [
    ['比赛获胜者','独赢',[['银翼',1.81],['暗影峡谷',1.99]]],['地图数量','总分',[['大',1.88,'3.5'],['小',1.84,'3.5']]],
  ] },
]

const hoursUntil = { f2: 9, f3: 9, b2: 28, d1: 20, a1: 29, eb2: 6, es2: 6, es3: 29, es4: 7, es5: 27 }
const startAt = {
  f1: '2026-10-21T14:10:00+07:00', f2: '2026-10-21T23:45:00+07:00', f3: '2026-10-21T23:45:00+07:00',
  b1: '2026-10-21T14:20:00+07:00', b2: '2026-10-22T18:30:00+07:00', t1: '2026-10-21T13:45:00+07:00',
  p1: '2026-10-21T14:05:00+07:00', d1: '2026-10-22T11:00:00+07:00', a1: '2026-10-22T19:00:00+07:00',
  eb1: '2026-10-21T14:35:00+07:00', eb2: '2026-10-21T21:10:00+07:00', es1: '2026-10-21T13:55:00+07:00',
  es2: '2026-10-21T21:30:00+07:00', es3: '2026-10-22T20:00:00+07:00', es4: '2026-10-21T22:00:00+07:00',
  es5: '2026-10-22T18:00:00+07:00',
}

export const events = rawEvents.map((event) => ({
  ...event,
  sportLabel: sportLabels[event.sport],
  startAt: startAt[event.id],
  hoursUntil: hoursUntil[event.id] ?? 0,
  markets: event.markets.map(([name, group, options], marketIndex) => ({
    id: `${event.id}-m${marketIndex + 1}`,
    name, group,
    selections: options.map(([label, odds, line], optionIndex) => ({
      id: `${event.id}-m${marketIndex + 1}-s${optionIndex + 1}`,
      label, odds, line: line || null,
    })),
  })),
}))

export function filterEvents({ sport, gameTitle, competition, phase, query = '', stream, favorites, windowHours } = {}) {
  const search = query.trim().toLocaleLowerCase()
  return events.filter((event) => {
    if (sport && event.sport !== sport) return false
    if (gameTitle && event.gameTitle !== gameTitle) return false
    if (competition && event.competition !== competition) return false
    if (phase && phase !== 'all' && event.phase !== phase) return false
    if (stream && !event.stream) return false
    if (favorites && !event.favorite) return false
    if (windowHours && event.phase === 'upcoming' && event.hoursUntil > windowHours) return false
    return !search || [event.home, event.away, event.competition].some((value) => value.toLocaleLowerCase().includes(search))
  })
}

export function getEvent(id) { return events.find((event) => event.id === id) }
