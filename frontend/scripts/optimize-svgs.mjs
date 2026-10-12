// SPDX-License-Identifier: MPL-2.0

import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import {
  mkdir,
  readFile,
  readdir,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { optimize } from "svgo";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const imagesDir = path.join(root, "public", "images");
const cacheDir = path.join(root, "node_modules", ".cache");
const cacheFile = path.join(cacheDir, "svgo-hashes.json");

function hash(content) {
  return createHash("sha256").update(content).digest("hex");
}

async function findSvgFiles(directory) {
  const files = [];

  if (!existsSync(directory)) return files;

  const entries = await readdir(directory, {
    withFileTypes: true,
  });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await findSvgFiles(fullPath)));
    } else if (
      entry.isFile() &&
      entry.name.toLowerCase().endsWith(".svg")
    ) {
      files.push(fullPath);
    }
  }

  return files;
}

async function main() {
  let cache = {};

  try {
    cache = JSON.parse(await readFile(cacheFile, "utf8"));
  } catch {
    // First run, or cache unavailable.
  }

  const files = await findSvgFiles(imagesDir);

  let optimized = 0;
  let skipped = 0;

  for (const file of files) {
    const relativePath = path.relative(root, file);
    const original = await readFile(file, "utf8");

    if (cache[relativePath] === hash(original)) {
      skipped++;
      continue;
    }

    const result = optimize(original, {
      path: file,
      multipass: true,
    });

    if (result.data !== original) {
      await writeFile(file, result.data, "utf8");
    }

    cache[relativePath] = hash(result.data);
    optimized++;

    console.log(`Optimized: ${relativePath}`);
  }

  await mkdir(cacheDir, { recursive: true });
  await writeFile(
    cacheFile,
    JSON.stringify(cache, null, 2),
  );

  console.log(
    `SVG optimization complete: ${optimized} processed, ${skipped} skipped.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
