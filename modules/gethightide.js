const axios = require('axios');
const cheerio = require('cheerio');

async function getHighTide(dateStr) {
  const url = 'https://www.data.jma.go.jp/kaiyou/db/tide/suisan/suisan.php?stn=KG';

  try {
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);

    let highTideTimes = [];

    $('table tr').each((i, row) => {
      const columns = $(row).find('td');
      const dateText = $(columns[0]).text().trim();

      if (dateText.includes(dateStr)) {
        const time1 = $(columns[1]).text().trim();
        const level1 = $(columns[2]).text().trim();
        const time2 = $(columns[3]).text().trim();
        const level2 = $(columns[4]).text().trim();

        if (time1 !== '＊' && level1 !== '＊') highTideTimes.push({ time: time1, level: level1 });
        if (time2 !== '＊' && level2 !== '＊') highTideTimes.push({ time: time2, level: level2 });
      }
    });

    if (highTideTimes.length === 0) {
      throw new Error('満潮データが見つかりませんでした');
    }

    return highTideTimes[0].time;

  } catch (e) {
    console.error('getHighTideスクレイピングエラー:', e.message);
    return '取得失敗';
  }
}

module.exports = getHighTide;
