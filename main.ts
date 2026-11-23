// The Vacuum's Alibi: One Line, 200 Characters
// Entry: the deadpan excuse a robot vacuum gives for missing a spot.
// The program writes the line to /output/entry.txt, exactly as the
// judge will read it — one line, 100 characters, no trailing newline.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const ALIBI =
  "I did not miss the spot. I conducted a thorough survey and concluded the dust has squatter's rights.";

const OUT_PATH = "/output/entry.txt";

// The gate requires 1-200 characters of UTF-8 text, not only whitespace.
if (ALIBI.length === 0 || ALIBI.length > 200) {
  throw new Error(`Alibi must be 1-200 characters, got ${ALIBI.length}`);
}
if (ALIBI.trim().length === 0) {
  throw new Error("Alibi must not be only whitespace");
}

// One line: no line breaks anywhere in the text.
if (/[\r\n]/.test(ALIBI)) {
  throw new Error("Alibi must be a single line");
}

// The punch sits at the end: the line must end with a period.
if (!ALIBI.endsWith(".")) {
  throw new Error("Alibi must end with a period");
}

// The gate counts characters, but the leaderboard's Size column shows
// bytes: keep the byte length inside the same 200 cap so the entry can
// never be longer on the board than the gate allowed.
const byteLength = Buffer.byteLength(ALIBI, "utf8");
if (byteLength > 200) {
  throw new Error(`Alibi must be at most 200 bytes, got ${byteLength}`);
}

// No leading or trailing whitespace and no doubled spaces: every word
// earns its place, and the judge reads exactly the line as written.
if (ALIBI !== ALIBI.trim() || ALIBI.includes("  ")) {
  throw new Error("Alibi must have no leading/trailing whitespace or double spaces");
}

// Guard the joke against silent drift: the deadpan denial, the survey,
// and the punchline phrase must all still be there.
const REQUIRED_PHRASES = [
  "I did not miss the spot",
  "thorough survey",
  "squatter's rights",
];
for (const phrase of REQUIRED_PHRASES) {
  if (!ALIBI.includes(phrase)) {
    throw new Error(`Alibi is missing required phrase: ${phrase}`);
  }
}

mkdirSync(dirname(OUT_PATH), { recursive: true });
writeFileSync(OUT_PATH, ALIBI, "utf8");

// Read back what was written and confirm it is byte-identical to the
// alibi, so a partial write or encoding slip can never reach the judge.
const written = readFileSync(OUT_PATH, "utf8");
if (written !== ALIBI) {
  throw new Error("Verification failed: /output/entry.txt differs from the alibi");
}
console.log(`Wrote ${ALIBI.length} characters to ${OUT_PATH}`);
