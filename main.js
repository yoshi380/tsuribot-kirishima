// main.js（LINE Bot対応版：今日 or 明日 を切り替え可能）
require('dotenv').config();
const axios = require('axios');
const getHighTide = require('./modules/getHighTide');
const getFishingIndex = require('./modules/getFishingIndex');

// 緯度経度（霧島市）
const lat = 31.7408;
const lon = 130.7629;

// 📅 日付文字列を生成（offset: 0=今日, 1=明日）
function getDateStr(offset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
}

// 💬 コメント生成（釣り指数に応じたコメント）
function getFishingComment(index) {
  switch (index) {
    case '◎': return '今日は最高の釣り日和！道具を忘れずに！';
    case '◯': return '穏やかな海。チャンスあり！';
    case '△': return 'やや風あり。朝夕に短時間勝負がおすすめ';
    case '×': return '強風注意。今日はやめないか？';
    default: return '不明な条件です。';
  }
}

// 🎣 メイン処理（offsetで今日/明日を切替）
async function getFishingInfo(offset = 0) {
  const dateStr = getDateStr(offset);
  const label = offset === 0 ? '今日' : '明日';

  try {
    // 🌊 満潮データ
    const tides = await getHighTide(dateStr);

    // 🌤 風速データ取得
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;
    const res = await axios.get(url);
    const wind = parseFloat(res.data.wind.speed).toFixed(1);
    const wave = (wind * 0.3).toFixed(1); // 想定波高
    const index = getFishingIndex(wind);
    const comment = getFishingComment(index);

    // 🖨 出力
    console.log('==============================');
    console.log(`📅 ${label}の釣り情報（霧島市・錦江湾）`);
    console.log(`風速：${wind} m/s`);
    console.log(`波の高さ：${wave} m（想定）`);
    console.log(`釣り指数：${index} ／ ${comment}`);
    if (tides.length === 0) {
      console.log(`満潮時刻：不明`);
    } else {
      console.log(`満潮時刻：${tides.join(' / ')}`);
    }
    console.log('==============================');
  } catch (err) {
    console.error('実行エラー:', err.message);
  }
}

// ✅ 実行：引数で0=今日, 1=明日 を選べる
const arg = process.argv[2];
const offset = arg === 'tomorrow' ? 1 : 0;
getFishingInfo(offset);
