import { bundle } from "https://deno.land/x/emit@0.12.0/mod.ts";
import { minify } from "npm:terser@5.16.1";

const result = await bundle(
  new URL("https://deno.land/x/line2json@v0.1.2/mod.ts"),
  {
    type: "module",
    compilerOptions: {
      inlineSourceMap: false,
      sourceMap: false,
    },
  },
);

const { code } = await minify(result.code, { mangle: true });

if (code) {
  Deno.writeTextFileSync("./docs/line2json.js", code);
} else {
  console.error("Build faild");
}
