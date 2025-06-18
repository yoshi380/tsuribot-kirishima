const axios = require('axios');

async function getwindspeed() {
  try {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        lat: 31.7315,  // 霧島市の緯度
        lon: 130.7631, // 霧島市の経度
        appid: process.env.OPENWEATHER_API_KEY,
        units: 'metric',
        lang: 'ja'
      }
    });

    const wind = response.data.wind.speed;
    return wind;
  } catch (error) {
    console.error('getwindspeed エラー:', error.response?.data || error.message);
    throw new Error('風速の取得に失敗しました');
  }
}

module.exports = getwindspeed;
