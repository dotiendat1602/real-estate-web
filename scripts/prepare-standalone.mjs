import fs from "node:fs";
import path from "node:path";

const standaloneDir = path.join(".next", "standalone");

if (!fs.existsSync(standaloneDir)) {
  console.error(
    "Missing .next/standalone. Run next build with output: 'standalone' first."
  );
  process.exit(1);
}

function copyIfExists(from, to) {
  if (!fs.existsSync(from)) return;
  fs.rmSync(to, { recursive: true, force: true });
  fs.cpSync(from, to, { recursive: true });
}

copyIfExists(
  path.join(".next", "static"),
  path.join(standaloneDir, ".next", "static")
);
copyIfExists("public", path.join(standaloneDir, "public"));

console.log("Standalone server assets prepared.");
