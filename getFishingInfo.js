const axios = require('axios');
require('dotenv').config();

function getFishingIndex(windSpeed) {
  if (windSpeed <= 2) return '◎';
  if (windSpeed <= 4) return '◯';
  if (windSpeed <= 6) return '△';
  return '×';
}

function getFishingTimeRange(highTideTime) {
  const [hour, minute] = highTideTime.split(':').map(Number);
  const date = new Date();
  date.setHours(hour, minute);

  const start = new Date(date.getTime() - 90 * 60000);
  const end = new Date(date.getTime() + 90 * 60000);

  const format = (d) =>
    `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  return `${format(start)}〜${format(end)}`;
}

function getWeekdayName(date) {
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  return days[date.getDay()];
}

function getComment(index) {
  const comments = {
    '◎': '朝まずめ狙いでチヌがくるかも！早起きしてみよ♪',
    '◯': 'まぁまぁイケる日！潮と風を見て動こう！',
    '△': 'ちょっと渋そう…場所選び大事！',
    '×': '今日はやめとこ💦安全第一！',
  };
  return comments[index];
}

async function getWaveHeight(targetDateStr) {
  const apiKey = process.env.STORMGLASS_API_KEY;
  const lat = 31.7339;
  const lon = 130.7631;
  const isoDate = `${targetDateStr}T06:00:00+09:00`;

  const url = `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lon}&params=waveHeight&start=${isoDate}&end=${isoDate}`;

  try {
    const res = await axios.get(url, {
      headers: { Authorization: apiKey },
    });

    const height = res.data.hours[0]?.waveHeight?.sg;
    return height ? `${height.toFixed(1)}m` : '不明';
  } catch (err) {
    console.error('波情報取得失敗:', err.message);
    return '不明';
  }
}

async function getFishingInfo(isTomorrow = false) {
  const weatherApiKey = process.env.OPENWEATHER_API_KEY;
  const lat = 31.7339;
  const lon = 130.7631;

  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric&lang=ja`;

  try {
    const res = await axios.get(url);
    const targetDate = new Date();
    if (isTomorrow) targetDate.setDate(targetDate.getDate() + 1);

    const targetStr = targetDate.toISOString().slice(0, 10);
    const forecast = res.data.list.find(
      (item) => item.dt_txt.startsWith(targetStr) && item.dt_txt.includes('06:00')
    );

    const dateStr = `${targetDate.getMonth() + 1}月${targetDate.getDate()}日（${getWeekdayName(targetDate)}）`;
    const weather = forecast ? forecast.weather[0].description : '不明';
    const windSpeed = forecast ? forecast.wind.speed : 0;
    const highTideTime = '06:30'; // 仮固定、後で差し替え可能
    const index = getFishingIndex(windSpeed);
    const timeRange = getFishingTimeRange(highTideTime);
    const comment = getComment(index);
    const wave = await getWaveHeight(targetStr);

    return `📍【${isTomorrow ? '明日' : '今日'}の釣り情報】${dateStr} @霧島市・錦江湾
🌤 天気：${weather}
🕖 満潮：${highTideTime}ごろ
💨 風速：${windSpeed.toFixed(1)}m/s
🌊 波高：${wave}

🎯 釣り指数：${index}
🕐 釣れる時間帯：${timeRange}

💬 ヒトコト：${comment}`;
  } catch (err) {
    console.error('天気データ取得エラー:', err.message);
    return '釣り情報の取得に失敗しました💦';
  }
}

module.exports = getFishingInfo;
