import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const DIR = "messages/uk";
const DICT = "scripts/uk-dictionary.txt";
const API = "https://api.languagetool.org/v2/check";

/* The anonymous tier caps a request at 20KB. Chunks stay well under it so one
   long file cannot push a batch over on its own. */
const CHUNK = 8000;
const GAP = "\n\n";

function strings(value, path, out) {
  if (typeof value === "string") out.push({ path, text: value });
  else if (Array.isArray(value)) value.forEach((v, i) => strings(v, `${path}[${i}]`, out));
  else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) strings(v, path ? `${path}.${k}` : k, out);
  }
  return out;
}

/* ICU placeholders and plural forms are markup, not prose: left in, every one
   of them comes back as an unknown word. */
const isMarkup = (text) => /\{[^}]*(plural|select)/.test(text);
const clean = (text) => text.replace(/\{[^}]*\}/g, "…");

async function dictionary() {
  try {
    const raw = await readFile(DICT, "utf8");
    return new Set(
      raw
        .split("\n")
        .map((line) => line.trim().toLowerCase())
        .filter((line) => line && !line.startsWith("#")),
    );
  } catch {
    return new Set();
  }
}

async function check(text) {
  const response = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ language: "uk-UA", text }),
  });
  if (!response.ok) throw new Error(`LanguageTool ${response.status} ${response.statusText}`);
  return (await response.json()).matches ?? [];
}

const files = (await readdir(DIR)).filter((name) => name.endsWith(".json"));
const entries = [];
for (const name of files) {
  const parsed = JSON.parse(await readFile(join(DIR, name), "utf8"));
  for (const entry of strings(parsed, "", [])) {
    if (!isMarkup(entry.text)) entries.push({ ...entry, file: `${DIR}/${name}` });
  }
}

/* One request per string would be 400 of them against a 20/min limit. Batched,
   with the offset of each entry kept so a match maps back to its key. */
const batches = [];
let batch = [];
let length = 0;
for (const entry of entries) {
  const text = clean(entry.text);
  if (length + text.length > CHUNK && batch.length > 0) {
    batches.push(batch);
    batch = [];
    length = 0;
  }
  batch.push({ ...entry, at: length, length: text.length, clean: text });
  length += text.length + GAP.length;
}
if (batch.length > 0) batches.push(batch);

const allow = await dictionary();
const findings = [];

for (const group of batches) {
  for (const match of await check(group.map((entry) => entry.clean).join(GAP))) {
    const owner = group.find((e) => match.offset >= e.at && match.offset < e.at + e.length);
    if (!owner) continue;
    const word = owner.clean.slice(match.offset - owner.at, match.offset - owner.at + match.length);
    if (allow.has(word.toLowerCase())) continue;
    findings.push({ owner, word, message: match.message });
  }
}

for (const { owner, word, message } of findings) {
  console.log(`${owner.file} ${owner.path}\n  "${word}" - ${message}\n`);
}

console.log(
  findings.length === 0
    ? `uk: ${entries.length} strings, no findings`
    : `uk: ${findings.length} findings in ${entries.length} strings`,
);
process.exit(findings.length === 0 ? 0 : 1);
