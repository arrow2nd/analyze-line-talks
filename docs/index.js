import { analyze } from "./analyze.js";

let chartObjects = [];

document.getElementById("file").addEventListener("change", (e) => {
  const file = e.target.files?.[0];
  if (!file) {
    console.error("Load failed");
    return;
  }

  const reader = new FileReader();

  reader.onload = async (e) => {
    const text = e.target?.result;
    if (typeof text !== "string") {
      console.error("Empty");
      return;
    }

    const data = await analyze(text);
    const userNames = Array.from(data.keys());
    const values = Array.from(data.values());

    destroyCharts();

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

    createBarChart(data, "chart-sexual-words", "sexualWords");
    createBarChart(data, "chart-offensive-words", "offensiveWords");
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

  const c = new Chart(ctx, {
    type: "pie",
    data: {
      labels,
      datasets: [{ label, data }],
    },
  });

  chartObjects.push(c);
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
  const c = new Chart(ctx, {
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

  chartObjects.push(c);
}

function destroyCharts() {
  for (const c of chartObjects) {
    c.destroy();
  }

  chartObjects = [];
}
