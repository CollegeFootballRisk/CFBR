
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import openapiTS, { astToString } from "openapi-typescript";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const frontendDir = path.resolve(scriptDir, "..");
const schemaDir = path.join(frontendDir, "src/shared/api/schema");
const openApiUrl = process.env.OPENAPI_URL ?? "http://localhost:8000/openapi.json";

const response = await fetch(openApiUrl);

if (!response.ok) {
  throw new Error(`Failed to fetch OpenAPI: HTTP ${response.status}`);
}

const document = await response.json();

await fs.mkdir(schemaDir, { recursive: true });

// Preserve existing openapi-typescript generation behavior.
const ast = await openapiTS(document);
await fs.writeFile(
  path.join(schemaDir, "types.ts"),
  astToString(ast),
  "utf8",
);

const schemas = document.components?.schemas ?? {};
const identifiers = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

const enumDeclarations = Object.entries(schemas)
  .filter(
    ([name, schema]) =>
      identifiers.test(name) &&
      Array.isArray(schema.enum) &&
      schema.enum.length > 0 &&
      schema.enum.every((value) => typeof value === "string"),
  )
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([name, schema]) => {
    const values = [...new Set(schema.enum)];

    return `export const ${name} = ${JSON.stringify(values, null, 2)} as const;`;
  });

const enumSource = [
  "// Auto-generated from FastAPI OpenAPI. Do not edit.",
  "",
  ...enumDeclarations.flatMap((declaration) => [declaration, ""]),
].join("\n");

await fs.writeFile(
  path.join(schemaDir, "enums.ts"),
  enumSource,
  "utf8",
);

console.log(`Generated API types and ${enumDeclarations.length} runtime enums.`);
