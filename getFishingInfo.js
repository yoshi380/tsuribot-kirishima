// getFishingInfo.js

const axios = require('axios');

const STORMGLASS_API_KEY = '768a5a7c-4b72-11f0-89b2-0242ac130006';
const LAT = 31.7425;
const LNG = 130.7683;

// 波の高さを取得（朝6時で固定）
async function getWaveHeight(targetDate) {
  const date = new Date(targetDate);
  date.setHours(6, 0, 0);
  const isoTime = date.toISOString();

  try {
    const res = await axios.get('https://api.stormglass.io/v2/weather/point', {
      params: {
        lat: LAT,
        lng: LNG,
        params: 'waveHeight',
        source: 'noaa',
        start: isoTime,
        end: isoTime,
      },
      headers: {
        Authorization: STORMGLASS_API_KEY,
      },
    });

    const wave = res.data.hours?.[0]?.waveHeight?.noaa;
    return (wave !== undefined && wave !== null && !isNaN(wave))
      ? `${wave.toFixed(1)} m`
      : '不明';
  } catch (err) {
    console.error('🌊 波高取得エラー:', err.message);
    return '取得エラー';
  }
}

// メイン処理（返信文生成）
module.exports = async function getFishingInfo(day) {
  try {
    const today = new Date();
    const targetDate = new Date(today);

    if (day === 'tomorrow') {
      targetDate.setDate(today.getDate() + 1);
    }

    const waveHeight = await getWaveHeight(targetDate);

    const message = `
📅 ${day === 'today' ? '【今日の釣り情報】' : '【明日の釣り情報】'} @霧島市・錦江湾
🌊 波の高さ：${waveHeight}
🌕 潮：中潮（仮）
🌀 風速：2.5m/s（仮）
🎯 釣り指数：◯
🕖 釣れる時間帯：05:00〜08:00

💬 ヒトコト：まぁまぁイケる日！潮と風を見て動こう！
`.trim();

    return message;
  } catch (err) {
    console.error('🐟 getFishingInfo全体エラー:', err);
    return '情報の取得に失敗しました…';
  }
};
