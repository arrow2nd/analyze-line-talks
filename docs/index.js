import { parse } from "./line2json.js";
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

    const talks = parse(text);
    const analyzeData = analyze(talks);

    createTotalCountChart(analyzeData);
    createTotalCharsChart(analyzeData);
    createByDateChart(analyzeData);
  };

  reader.readAsText(file);
});

function createTotalCountChart(d) {
  const ctx = document.getElementById("chart-total-count");
  const data = Array.from(d.values()).map(({ count }) => count);

  new Chart(ctx, {
    type: "pie",
    data: {
      labels: Array.from(d.keys()),
      datasets: [{ label: "通数", data }],
    },
  });
}

function createTotalCharsChart(d) {
  const ctx = document.getElementById("chart-total-chars");
  const data = Array.from(d.values()).map((e) => e.chars);

  new Chart(ctx, {
    type: "pie",
    data: {
      labels: Array.from(d.keys()),
      datasets: [{ label: "通数", data }],
    },
  });
}

function createByDateChart(d) {
  // すべてのユーザの日付を重複させずにマージする
  let dateLabels = [];
  for (const v of d.values()) {
    dateLabels = Array.from(new Set([...dateLabels, ...v.byDate.keys()]));
  }

  const datasets = [];
  for (const [label, value] of d) {
    const data = [];

    for (const date of dateLabels) {
      const count = value.byDate.get(date) ?? 0;
      data.push(count);
    }

    datasets.push({ label, data });
  }

  const ctx = document.getElementById("chart-bydate");
  ctx.style.width = `${dateLabels.length * 12 * datasets.length}px`;

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
