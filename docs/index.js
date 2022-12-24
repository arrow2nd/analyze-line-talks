import { analyze } from "./analyze.js";

const fileInput = document.getElementById("file");

fileInput.addEventListener("change", (e) => {
  const file = e.target.files?.[0];
  if (!file) {
    console.error("Load faild");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target?.result;
    if (typeof text !== "string") {
      console.error("Empty");
      return;
    }

    const data = analyze(text);
    const userNames = Array.from(data.keys());
    const values = Array.from(data.values());

    createPieChart(
      "chart-total-count",
      "通数",
      userNames,
      values.map(({ count }) => count),
    );

    createPieChart(
      "chart-total-chars",
      "文字数",
      userNames,
      values.map(({ chars }) => chars),
    );

    createBarChart(data, "chart-bydate", "byDate");
    createBarChart(data, "chart-bytime", "byTime");
  };

  reader.readAsText(file);
});

/**
 * @param {string} id ID
 * @param {string} label グラフのラベル
 * @param {string[]} labels チャートのラベル
 * @param {number[]} data チャートのデータ
 */
function createPieChart(id, label, labels, data) {
  const ctx = document.getElementById(id);

  new Chart(ctx, {
    type: "pie",
    data: {
      labels,
      datasets: [{ label, data }],
    },
  });
}

/**
 * @param {any} d トーク履歴分析結果
 * @param {string} ID
 * @param {string} 表示するデータのフィールド名
 */
function createBarChart(d, id, fieldName) {
  // キーになる値を重複させずにマージする
  let dateLabels = [];
  for (const v of d.values()) {
    dateLabels = Array.from(new Set([...dateLabels, ...v[fieldName].keys()]));
  }

  const datasets = [];
  for (const [label, value] of d) {
    const data = [];

    for (const date of dateLabels) {
      const count = value[fieldName].get(date) ?? 0;
      data.push(count);
    }

    datasets.push({ label, data });
  }

  const ctx = document.getElementById(id);
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: dateLabels.sort((a, b) => a > b),
      datasets,
    },
    options: {
      plugins: {
        zoom: {
          zoom: {
            wheel: { enabled: true },
            pinch: { enabled: true },
            drag: { enabled: true },
            mode: "x",
          },
        },
      },
    },
  });
}
