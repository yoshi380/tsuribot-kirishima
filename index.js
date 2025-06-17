const express = require('express');
const axios = require('axios');
require('dotenv').config();

const getFishingInfo = require('./getFishingInfo');

const app = express();
app.use(express.json());

app.post('/webhook', async (req, res) => {
  const events = req.body.events;
  for (const event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      const text = event.message.text;
      let reply = '「今日」か「明日」って言ってね！';
      if (text.includes('今日')) reply = await getFishingInfo(false);
      if (text.includes('明日')) reply = await getFishingInfo(true);
      await replyToUser(event.replyToken, reply);
    }
  }
  res.status(200).send('OK');
});

async function replyToUser(token, message) {
  const url = 'https://api.line.me/v2/bot/message/reply';
  await axios.post(url, {
    replyToken: token,
    messages: [{ type: 'text', text: message }]
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
    }
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
