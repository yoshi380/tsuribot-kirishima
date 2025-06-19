const axios = require('axios');
const cheerio = require('cheerio');

async function getHighTide(dateStr) {
  const url = 'https://www.data.jma.go.jp/kaiyou/db/tide/suisan/suisan.php?stn=KG';

  try {
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);

    let result = [];

    $('table tr').each((_, row) => {
      const tds = $(row).find('td');
      const date = $(tds[0]).text().trim();

      if (date.startsWith(dateStr)) {
        // 満潮①
        const time1 = $(tds[2]).text().trim();
        const tide1 = $(tds[3]).text().trim();

        // 満潮②
        const time2 = $(tds[4]).text().trim();
        const tide2 = $(tds[5]).text().trim();

        if (time1 && tide1) result.push(`${time1} / ${tide1}cm`);
        if (time2 && tide2) result.push(`${time2} / ${tide2}cm`);
      }
    });

    return result;
  } catch (err) {
    console.error('🌊 満潮取得エラー:', err.message);
    return [];
  }
}

module.exports = getHighTide;
