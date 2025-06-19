function getFishingIndex(windSpeed) {
  if (windSpeed <= 2) return '◎';
  if (windSpeed <= 4) return '◯';
  if (windSpeed <= 6) return '△';
  return '×';
}

module.exports = getFishingIndex;
