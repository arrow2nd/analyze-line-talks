import { parse } from "./line2json.js";

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

    createTotalSendChart(talks);
  };

  reader.readAsText(file);
});

function createTotalSendChart(talks) {
  const labels = new Map();
  for (const { user } of talks) {
    const count = labels.get(user) ?? 0;
    labels.set(user, count + 1);
  }

  const ctx = document.getElementById("chart-sends-sum");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: Array.from(labels.keys()),
      datasets: [{
        label: "通数",
        data: Array.from(labels.values()),
        borderWidth: 1,
      }],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}
