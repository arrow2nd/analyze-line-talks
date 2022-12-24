import { parse } from "./line2json.js";

export async function analyze(text) {
  const inappropriateWords = {
    sexual: await fetchInappropriateWords("Sexual"),
    offensive: await fetchInappropriateWords("Offensive"),
  };

  const talks = parse(text);
  const data = new Map();

  for (const { date, time, user, message } of talks) {
    // ユーザを追加
    if (!data.has(user)) {
      data.set(user, {
        count: 0,
        chars: 0,
        sexualWords: new Map(),
        offensiveWords: new Map(),
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

    // 不適切ワードのカウント
    for (const key of Object.keys(inappropriateWords)) {
      for (const word of inappropriateWords[key]) {
        if (!message.includes(word)) continue;

        const count = userData[`${key}Words`].get(word) ?? 0;
        userData[`${key}Words`].set(word, count + 1);
      }
    }
  }

  return data;
}

/**
 * @param {string} fileName ファイル名
 */
async function fetchInappropriateWords(fileName) {
  const res = await fetch(
    `https://raw.githubusercontent.com/MosasoM/inappropriate-words-ja/master/${fileName}.txt`,
  );

  const text = await res.text();
  return text.split("\n").map((e) => e.trim()).filter((e) => e !== "");
}
