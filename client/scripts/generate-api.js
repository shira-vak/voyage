#!/usr/bin/env node
import fs from "fs/promises";
import path from "path";
import os from "os";
import { generate } from "openapi-typescript-codegen";

const SPEC_URL = "http://localhost:3000/api-json";
const DEST = path.resolve("src/api/generated");
const TMP = path.join(os.tmpdir(), `openapi-${Date.now()}.json`);

async function download(url, dest) {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to download spec from ${url}: ${res.status} ${res.statusText}`);
  }

  const text = await res.text();
  await fs.writeFile(dest, text, "utf8");
}

async function main() {
  console.log("Downloading OpenAPI spec from", SPEC_URL);

  await download(SPEC_URL, TMP);

  console.log("Generating client →", DEST);

  await fs.rm(DEST, { recursive: true, force: true }).catch(() => {});

  await generate({
    input: TMP,
    output: DEST,
    httpClient: "fetch",
    useOptions: true,
  });

  await fs.rm(TMP).catch(() => {});

  console.log("Done.");
}

main().catch((err) => {
  console.error("OpenAPI generation failed:", err);
  process.exit(1);
});
