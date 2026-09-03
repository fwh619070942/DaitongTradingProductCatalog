import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const sourceDir = join(root, "public/images/catalog");
const outputDir = join(root, "public/images/catalog-web");

if (!existsSync(sourceDir)) {
  throw new Error(`Missing source directory: ${sourceDir}`);
}

mkdirSync(outputDir, { recursive: true });

const images = readdirSync(sourceDir)
  .filter((fileName) => /\.(jpe?g|png|webp)$/i.test(fileName))
  .sort((a, b) => {
    const aNumber = Number(a.match(/_(\d+)_2_gemini/)?.[1] ?? 0);
    const bNumber = Number(b.match(/_(\d+)_2_gemini/)?.[1] ?? 0);

    return aNumber - bNumber || a.localeCompare(b);
  });

let totalBytes = 0;

for (const fileName of images) {
  const sourcePath = join(sourceDir, fileName);
  const outputPath = join(outputDir, fileName);
  const result = spawnSync(
    "sips",
    ["-Z", "900", "-s", "format", "jpeg", "-s", "formatOptions", "78", sourcePath, "--out", outputPath],
    { encoding: "utf8" },
  );

  if (result.status !== 0) {
    throw new Error(`Failed to optimize ${fileName}: ${result.stderr || result.stdout}`);
  }

  totalBytes += statSync(outputPath).size;
}

console.log(`Optimized ${images.length} images to ${(totalBytes / 1024 / 1024).toFixed(1)} MB`);
