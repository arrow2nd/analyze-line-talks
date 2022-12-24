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

    console.log(analyze(talks));
  };

  reader.readAsText(file);
});
