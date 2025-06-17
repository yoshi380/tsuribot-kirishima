async function getWaveHeight(targetDate) {
  const date = new Date(targetDate);
  date.setHours(6, 0, 0);
  const isoTime = date.toISOString();

  try {
    const res = await axios.get('https://api.stormglass.io/v2/weather/point', {
      params: {
        lat: 31.7425,
        lng: 130.7683,
        params: 'waveHeight',
        start: isoTime,
        end: isoTime,
      },
      headers: {
        Authorization: '768a5a7c-4b72-11f0-89b2-0242ac130006',
      },
    });

    const waveData = res.data.hours?.[0]?.waveHeight;
    console.log('🌊 waveData:', waveData);

    // 優先順位：noaa → icon → sg → meteo
    const wave =
      waveData?.noaa ??
      waveData?.icon ??
      waveData?.sg ??
      waveData?.meteo;

    return (wave !== undefined && wave !== null && !isNaN(wave))
      ? `${wave.toFixed(1)} m`
      : 'データなし';

  } catch (err) {
    console.error('🌊 波高取得エラー:', err.response?.data || err.message);
    return '取得エラー';
  }
}
