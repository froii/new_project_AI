import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const ROOTS = ["app", "components"];
// Hairlines and hover nudges: rounding them to whole px changes how they look.
const SMALL_PX = 4;
const REM_PX = 16;
// rem is allowed where it should follow the reader's font size.
const REM_OK = /^(font-size|font|background(-.+)?|--step-.+)$/;

const cssFiles = async (dir) =>
  (await readdir(dir, { recursive: true }))
    .filter((file) => file.endsWith(".css"))
    .map((file) => join(dir, file));

function check(source) {
  const css = source.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, " "));
  const problems = [];
  const lineOf = (index) => css.slice(0, index).split("\n").length;
  for (const at of css.matchAll(/@(?:media|container)[^{]*\d(r?em)\b/g)) {
    problems.push(`${lineOf(at.index)}: breakpoint in ${at[1]}, use px`);
  }
  for (const decl of css.matchAll(/([\w-]+)\s*:\s*([^;{}]+);/g)) {
    const [, property, value] = decl;
    const line = lineOf(decl.index);
    for (const [, number] of value.matchAll(/(-?\d*\.\d+)px/g)) {
      if (Math.abs(number) >= SMALL_PX)
        problems.push(`${line}: ${property}: ${number}px is fractional`);
    }
    if (REM_OK.test(property)) continue;
    for (const [, number] of value.matchAll(/(-?\d*\.?\d+)rem/g)) {
      if (Math.abs(number) * REM_PX >= SMALL_PX)
        problems.push(`${line}: ${property}: ${number}rem, use whole px`);
    }
  }
  return problems;
}

let failed = 0;
for (const file of (await Promise.all(ROOTS.map(cssFiles))).flat()) {
  for (const problem of check(await readFile(file, "utf8"))) {
    console.error(`${file}:${problem}`);
    failed++;
  }
}
if (failed) {
  console.error(`\n${failed} CSS unit problem(s). Rules: CLAUDE.md, "CSS units".`);
  process.exit(1);
}
