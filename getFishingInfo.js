// getFishingInfo.js

module.exports = async function getFishingInfo(day) {
  // 呼び出しログ（Renderログで見える用）
  console.log('💡 getFishingInfo() 呼び出し:', day);

  if (day === 'today') {
    return `
📅 【今日の釣り情報】@霧島市・錦江湾
🌊 波の高さ：テスト 0.5m
🌕 潮：中潮（仮）
🌀 風速：2.5m/s（仮）
🎯 釣り指数：◯
🕖 釣れる時間帯：05:00〜08:00

💬 ヒトコト：今日は穏やか！釣り日和！
    `.trim();
  } else if (day === 'tomorrow') {
    return `
📅 【明日の釣り情報】@霧島市・錦江湾
🌊 波の高さ：テスト 0.7m
🌕 潮：中潮（仮）
🌀 風速：2.5m/s（仮）
🎯 釣り指数：◯
🕖 釣れる時間帯：05:00〜08:00

💬 ヒトコト：明日は曇り、朝イチが狙い目！
    `.trim();
  } else {
    return '⚠ 日付指定が不明です（today/tomorrow）';
  }
};
