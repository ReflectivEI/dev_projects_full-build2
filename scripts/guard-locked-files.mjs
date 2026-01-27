import fs from "node:fs";

const lockPath = "prompts/production.lock.json";
const allow = process.env.ALLOW_LOCKED_CHANGES === "true";

if (!fs.existsSync(lockPath)) {
  console.error(`❌ Missing ${lockPath}`);
  process.exit(1);
}

const lock = JSON.parse(fs.readFileSync(lockPath, "utf8"));
const locked = !!lock.locked;

const changedFiles = fs.readFileSync(0, "utf8")
  .trim()
  .split("\n")
  .filter(Boolean);

const protectedPrefixes = [
  "prompts/",
  "src/ai/",
  "src/prompts/",
  "src/agents/",
  "worker/",
  "functions/",
  "server/",
  "api/"
];

const touched = changedFiles.some(f =>
  protectedPrefixes.some(p => f.startsWith(p))
);

if (locked && touched && !allow) {
  console.error("\n❌ PRODUCTION LOCK ACTIVE");
  console.error("Protected files changed while prompts are locked.");
  console.error("Override intentionally with:");
  console.error("ALLOW_LOCKED_CHANGES=true git commit -m \"...\"");
  process.exit(2);
}

console.log("✅ Lock guard passed.");
