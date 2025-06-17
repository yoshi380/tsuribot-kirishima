// getWaveHeight.js

const axios = require('axios');

const API_KEY = '768a5a7c-4b72-11f0-89b2-0242ac130006';
const LAT = 31.7425;
const LNG = 130.7683;

async function getWaveHeight() {
  const now = new Date().toISOString();

  try {
    const response = await axios.get('https://api.stormglass.io/v2/weather/point', {
      params: {
        lat: LAT,
        lng: LNG,
        params: 'waveHeight',
        source: 'noaa',
        start: now,
        end: now,
      },
      headers: {
        Authorization: API_KEY
      }
    });

    const data = response.data;
    const wave = data.hours?.[0]?.waveHeight?.noaa;

    if (wave !== undefined) {
      return `${wave.toFixed(1)} m`;
    } else {
      return 'データ取得失敗';
    }

  } catch (error) {
    console.error('波高データ取得エラー:', error.message);
    return '取得エラー';
  }
}

module.exports = { getWaveHeight };
