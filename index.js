const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const getfishinginfo = require('./modules/getfishinginfo.js');

const app = express();
app.use(express.json());

app.post('/webhook', async (req, res) => {
  const events = req.body.events;

  for (const event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      const text = event.message.text;
      let replytext = '';

      if (text.includes('今日')) {
        replytext = await getfishinginfo('today');
      } else if (text.includes('明日')) {
        replytext = await getfishinginfo('tomorrow');
      } else {
        replytext = '「今日」か「明日」で聞いてみてね！';
      }

      await replytouser(event.replyToken, replytext);
    }
  }

  res.status(200).send('ok');
});

async function replytouser(replytoken, message) {
  const url = 'https://api.line.me/v2/bot/message/reply';
  const headers = {
    'content-type': 'application/json',
    'authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
  };

  const body = {
    replyToken: replytoken,
    messages: [{ type: 'text', text: message }]
  };

  try {
    await axios.post(url, body, { headers });
  } catch (err) {
    console.error('lineへの返信エラー:', err.response?.data || err.message);
  }
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 サーバー起動！ http://localhost:${port}`));
