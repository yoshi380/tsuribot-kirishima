// getFishingInfo.js

module.exports = async function getFishingInfo(day) {
  console.log('💡 getFishingInfo() 呼び出し：', day);

  if (day === 'today') {
    return '✅ テスト返信：今日は晴れ、釣り日和！';
  } else if (day === 'tomorrow') {
    return '✅ テスト返信：明日は曇り、朝イチが狙い目！';
  } else {
    return '⚠ 日付指定が不明です';
  }
};
