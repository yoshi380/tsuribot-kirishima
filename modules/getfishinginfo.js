const getwindspeed = require('./getwindspeed');
const getwaveheight = require('./getwaveheight');
const gethightide = require('./gethightide');

function getfishingindex(wind, wave) {
  if (wind <= 2 && wave <= 0.5) return '◎';
  if (wind <= 4 && wave <= 1.0) return '◯';
  if (wind <= 6 && wave <= 1.5) return '△';
  return '×';
}

function gettimerange(hightidetime) {
  const [hour, minute] = hightidetime.split(':').map(Number);
  const date = new Date();
  date.setHours(hour, minute);

  const start = new Date(date.getTime() - 90 * 60000);
  const end = new Date(date.getTime() + 90 * 60000);

  const format = (d) =>
    `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  return `${format(start)}〜${format(end)}`;
}

async function getfishinginfo(target) {
  const istoday = target === 'today';
  const date = new Date();
  if (!istoday) date.setDate(date.getDate() + 1);
  const datestr = date.toISOString().split('T')[0];

  try {
    const [wind, wave, hightide] = await Promise.all([
      getwindspeed(),
      getwaveheight(),
      gethightide(datestr)
    ]);

    const index = getfishingindex(wind, wave);
    const timerange = gettimerange(hightide);
    const comment =
      index === '◎' ? '釣り日和！' :
      index === '◯' ? 'まぁまぁイケる日！潮と風を見て動こう！' :
      index === '△' ? 'ちょっと厳しいかも？' : '今日は見送りかな…';

    return `
📍【${istoday ? '今日' : '明日'}の釣り情報】@霧島市・錦江湾
🌊 波の高さ：${wave}m
🌀 風速：${wind}m/s
🎯 釣り指数：${index}
🕐 釣れる時間帯：${timerange}
💬 ヒトコト：${comment}
    `.trim();
  } catch (e) {
    console.error('getfishinginfo エラー:', e);
    return '⚠️ 情報の取得に失敗しました。';
  }
}

module.exports = getfishinginfo;
