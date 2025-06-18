const fs = require('fs');
const path = require('path');

function parsehigh1time(line) {
  const hour = line.substring(32, 34).trim();
  const minute = line.substring(34, 36).trim();
  if (!hour || !minute) return null;
  return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
}

async function gethightide(targetdate) {
  const file = path.join(__dirname, '..', 'data', 'KG.txt');
  const raw = fs.readFileSync(file, 'utf-8');
  const lines = raw.split('\n');

  for (const line of lines) {
    const date = line.substring(6, 16).trim(); // e.g., "2025/06/17"
    if (date === targetdate) {
      const time = parsehigh1time(line);
      if (time) return time;
    }
  }

  throw new Error(`満潮データが見つかりません: ${targetdate}`);
}

module.exports = gethightide;
