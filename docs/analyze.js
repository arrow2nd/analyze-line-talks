export function analyze(talks) {
  const data = new Map();

  for (const { date, time, user, message } of talks) {
    // ユーザを追加
    if (!data.has(user)) {
      data.set(user, {
        count: 0,
        chars: 0,
        wordMatches: new Map(),
        byDate: new Map(),
        byTime: new Map(),
      });
    }

    const userData = data.get(user);

    // 通数
    userData.count++;

    // 文字数
    userData.chars += [...message].length;

    // 日付別の通数
    const byDateCount = userData.byDate.get(date) ?? 0;
    userData.byDate.set(date, byDateCount + 1);

    // 時間別の通数
    const hour = time.slice(0, 2);
    const byTimeCount = userData.byTime.get(hour) ?? 0;
    userData.byTime.set(hour, byTimeCount + 1);
  }

  return data;
}
