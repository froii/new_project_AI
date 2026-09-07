import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const API = "https://api.languagetool.org/v2/check";
const CHUNK = 8000;
const GAP = "\n\n";

const targets = [
  {
    dir: "messages/en",
    language: "en-US",
    dict: "scripts/en-dictionary.txt",
    disabled: ["MUCH_COUNTABLE", "EN_ELLIPSIS"],
  },
  { dir: "messages/uk", language: "uk-UA", dict: "scripts/uk-dictionary.txt", disabled: [] },
];

function strings(value, path, out) {
  if (typeof value === "string") out.push({ path, text: value });
  else if (Array.isArray(value)) value.forEach((v, i) => strings(v, `${path}[${i}]`, out));
  else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) strings(v, path ? `${path}.${k}` : k, out);
  }
  return out;
}

const isMarkup = (text) => /\{[^}]*(plural|select)/.test(text);
const clean = (text) => text.replace(/\{[^}]*\}/g, "…");

async function dictionary(file) {
  try {
    const raw = await readFile(file, "utf8");
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

async function check(text, language, disabled) {
  const response = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ language, text, disabledRules: disabled.join(",") }),
  });
  if (!response.ok) throw new Error(`LanguageTool ${response.status} ${response.statusText}`);
  return (await response.json()).matches ?? [];
}

async function collect(dir) {
  const files = (await readdir(dir)).filter((name) => name.endsWith(".json"));
  const entries = [];
  for (const name of files) {
    const parsed = JSON.parse(await readFile(join(dir, name), "utf8"));
    for (const entry of strings(parsed, "", [])) {
      if (!isMarkup(entry.text)) entries.push({ ...entry, file: `${dir}/${name}` });
    }
  }
  return entries;
}

function batched(entries) {
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
  return batches;
}

let total = 0;
let failed = 0;

for (const target of targets) {
  const entries = await collect(target.dir);
  const allow = await dictionary(target.dict);
  const findings = [];

  for (const group of batched(entries)) {
    for (const match of await check(
      group.map((entry) => entry.clean).join(GAP),
      target.language,
      target.disabled,
    )) {
      const owner = group.find((e) => match.offset >= e.at && match.offset < e.at + e.length);
      if (!owner) continue;
      const at = match.offset - owner.at;
      const word = owner.clean.slice(at, at + match.length).toLowerCase();
      if (allow.has(word)) continue;
      if (match.rule?.issueType === "misspelling") {
        const tokens = word.split(/[^\p{L}\p{N}.@-]+/u).filter(Boolean);
        if (tokens.some((token) => allow.has(token))) continue;
      }
      findings.push({ owner, word, message: match.message });
    }
  }

  for (const { owner, word, message } of findings) {
    console.log(`${owner.file} ${owner.path}\n  "${word}" - ${message}\n`);
  }

  console.log(`${target.language}: ${entries.length} strings, ${findings.length} findings`);
  total += entries.length;
  failed += findings.length;
}

process.exit(failed === 0 ? 0 : 1);
