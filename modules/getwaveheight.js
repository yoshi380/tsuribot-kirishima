const axios = require('axios');

async function getwaveheight() {
  const apiKey = process.env.STORMGLASS_API_KEY;
  const lat = 31.5;  // 霧島市・錦江湾あたり
  const lng = 130.6;

  const today = new Date().toISOString().split('T')[0];

  const url = `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=waveHeight&start=${today}&end=${today}`;

  try {
    const response = await axios.get(url, {
      headers: { Authorization: apiKey }
    });

    const waves = response.data.hours;
    if (!waves || waves.length === 0) throw new Error('波データなし');

    const wave = waves[9]?.waveHeight?.noaa; // 朝9時頃の波高を想定
    return wave ? wave.toFixed(1) : '不明';
  } catch (err) {
    console.error('getwaveheightエラー:', err.message);
    return '不明';
  }
}

module.exports = getwaveheight;
