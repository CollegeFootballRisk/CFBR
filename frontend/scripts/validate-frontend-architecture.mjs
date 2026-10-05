import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import ts from "typescript";

const ROOT = process.cwd();
const FRONTEND_SRC = path.resolve(ROOT, "src");
const SHARED_COMPONENTS_SRC = path.resolve(ROOT, "src/shared/components");

const errors = [];

const NATIVE_UI_ELEMENTS = new Map([
  ["select", "Select"],
  ["button", "Button"],
  ["input", "Input"],
  ["textarea", "Textarea"]
]);

const REACT_ROUTER_LINK_IMPORTS = new Set(["Link", "NavLink"]);

const FILE_EXTENSIONS = new Set([".ts", ".tsx"]);

function normalize(filePath) {
  return path.normalize(path.resolve(filePath));
}

function isWithin(filePath, directory) {
  const relative = path.relative(directory, filePath);
  return relative !== "" && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
}

function isUiPackageFile(filePath) {
  return FILE_EXTENSIONS.has(path.extname(filePath)) && isWithin(filePath, SHARED_COMPONENTS_SRC);
}

function getSourceFiles(directory) {
  const files = [];

  function walk(currentDirectory) {
    for (const entry of fs.readdirSync(currentDirectory, {
      withFileTypes: true,
    })) {
      const filePath = path.join(currentDirectory, entry.name);

      if (entry.isDirectory()) {
        if (entry.name === "node_modules" || entry.name === "dist" || entry.name === "coverage") {
          continue;
        }

        walk(filePath);
        continue;
      }

      if (FILE_EXTENSIONS.has(path.extname(entry.name))) {
        files.push(normalize(filePath));
      }
    }
  }

  walk(directory);
  return files;
}

function getLineAndColumn(sourceFile, position) {
  const { line, character } = sourceFile.getLineAndCharacterOfPosition(position);

  return {
    line: line + 1,
    column: character + 1,
  };
}

function report(sourceFile, node, message) {
  const { line, column } = getLineAndColumn(sourceFile, node.getStart(sourceFile));

  errors.push({
    file: path.relative(ROOT, sourceFile.fileName),
    line,
    column,
    message,
  });
}

function resolveAliasImport(importPath) {
  if (!importPath.startsWith("@/")) {
    return null;
  }

  const target = path.resolve(FRONTEND_SRC, importPath.slice(2));

  const candidates = [
    target,
    `${target}.ts`,
    `${target}.tsx`,
    path.join(target, "index.ts"),
    path.join(target, "index.tsx"),
  ];

  return candidates.find((candidate) => fs.existsSync(candidate)) ?? null;
}

function getFeatureRoot(filePath) {
  const relative = path.relative(FRONTEND_SRC, filePath);
  const parts = relative.split(path.sep);

  if (parts[0] !== "features" || !parts[1]) {
    return null;
  }

  return path.resolve(FRONTEND_SRC, "features", parts[1]);
}

function validateParentRelativeImports(sourceFile, importDeclaration) {
  const importPath = importDeclaration.moduleSpecifier.text;

  if (!importPath.startsWith("@/")) {
    return;
  }

  const currentFeature = getFeatureRoot(sourceFile.fileName);

  if (!currentFeature) {
    return;
  }

  const target = resolveAliasImport(importPath);

  if (!target) {
    return;
  }

  if (!isWithin(target, currentFeature) && target !== currentFeature) {
    return;
  }

  const relativeTarget = path.relative(path.dirname(sourceFile.fileName), target);

  const normalizedRelative = relativeTarget.split(path.sep).join("/");

  if (!normalizedRelative.startsWith(".")) {
    return;
  }

  const suggestedImport = normalizedRelative.replace(/\.(tsx?|jsx?)$/, "");

  report(
    sourceFile,
    importDeclaration.moduleSpecifier,
    `Use a relative import for files within the current feature: "${suggestedImport}".`,
  );
}

function validateRestrictedLinkImport(sourceFile, importDeclaration) {
  if (isUiPackageFile(sourceFile.fileName)) {
    return;
  }

  if (importDeclaration.moduleSpecifier.text !== "react-router-dom") {
    return;
  }

  const importClause = importDeclaration.importClause;

  if (!importClause?.namedBindings || !ts.isNamedImports(importClause.namedBindings)) {
    return;
  }

  for (const element of importClause.namedBindings.elements) {
    const importedName = element.propertyName?.text ?? element.name.text;

    if (!REACT_ROUTER_LINK_IMPORTS.has(importedName)) {
      continue;
    }

    report(
      sourceFile,
      element,
      `Do not import ${importedName} directly from react-router-dom. Use ${importedName} from @/shared/components/Link instead.`,
    );
  }
}

function validateNativeAnchor(sourceFile, node) {
  if (isUiPackageFile(sourceFile.fileName)) {
    return;
  }

  const openingElement = ts.isJsxElement(node) ? node.openingElement : node;
  const elementName = getJsxElementName(openingElement);

  if (elementName !== "a") {
    return;
  }

  report(
    sourceFile,
    openingElement,
    "Use Link from @/shared/components/Link instead of a native <a> element.",
  );
}

function validateRestrictedApiImport(sourceFile, importDeclaration) {
  const relative = path.relative(FRONTEND_SRC, sourceFile.fileName);
  const parts = relative.split(path.sep);

  const isPageOrComponent =
    parts[0] === "features" &&
    parts.length >= 4 &&
    (parts[2] === "pages" || parts[2] === "components");

  if (!isPageOrComponent) {
    return;
  }

  const importPath = importDeclaration.moduleSpecifier.text;

  if (!/^@\/features\/[^/]+\/api(?:\/|$)/.test(importPath)) {
    return;
  }

  const importClause = importDeclaration.importClause;

  if (!importClause) {
    return;
  }

  if (importClause.isTypeOnly) {
    return;
  }

  const namedBindings = importClause.namedBindings;

  if (namedBindings && ts.isNamedImports(namedBindings)) {
    const hasRuntimeNamedImport = namedBindings.elements.some((element) => !element.isTypeOnly);

    if (!hasRuntimeNamedImport && !importClause.name) {
      return;
    }
  }

  report(
    sourceFile,
    importDeclaration.moduleSpecifier,
    "API calls must go through hooks. Do not import API functions directly from pages or components.",
  );
}

function validateRechartsImport(sourceFile, importDeclaration) {
  if (importDeclaration.moduleSpecifier.text !== "recharts") {
    return;
  }

  const namedBindings = importDeclaration.importClause?.namedBindings;

  if (!namedBindings || !ts.isNamedImports(namedBindings)) {
    return;
  }

  for (const element of namedBindings.elements) {
    const importedName = element.propertyName?.text ?? element.name.text;

    if (FORBIDDEN_RECHARTS_IMPORTS.has(importedName)) {
      report(
        sourceFile,
        element,
        `Use the approved chart component from @/shared instead of importing "${importedName}" directly from recharts.`,
      );
    }
  }
}

function getJsxElementName(node) {
  if (ts.isIdentifier(node.tagName)) {
    return node.tagName.text;
  }

  return null;
}

function hasJsxAttribute(node, attributeName) {
  return node.attributes.properties.some(
    (attribute) =>
      ts.isJsxAttribute(attribute) &&
      ts.isIdentifier(attribute.name) &&
      attribute.name.text === attributeName,
  );
}

function validateNativeUiElement(sourceFile, node) {
  if (isUiPackageFile(sourceFile.fileName)) {
    return;
  }

  const openingElement = ts.isJsxElement(node) ? node.openingElement : node;

  const elementName = getJsxElementName(openingElement);

  if (!elementName) {
    return;
  }

  // React components are capitalized. Only validate native HTML elements.
  if (elementName[0] !== elementName[0].toLowerCase()) {
    return;
  }

  const normalizedName = elementName.toLowerCase();
  const replacement = NATIVE_UI_ELEMENTS.get(normalizedName);

  if (!replacement) {
    return;
  }

if (normalizedName === "input") {
  const typeAttribute = openingElement.attributes.properties.find(
    (attribute) =>
      ts.isJsxAttribute(attribute) &&
      ts.isIdentifier(attribute.name) &&
      attribute.name.text === "type",
  );

  if (typeAttribute?.initializer && ts.isStringLiteral(typeAttribute.initializer)) {
    const inputType = typeAttribute.initializer.text.toLowerCase();

    if (inputType === "date") {
      report(
        sourceFile,
        openingElement,
        "Use DatePicker from @/shared instead of native <input type=\"date\">.",
      );

      return;
    }

    if (inputType === "checkbox") {
      report(
        sourceFile,
        openingElement,
        "Use Checkbox from @/shared instead of native <input type=\"checkbox\">.",
      );

      return;
    }
  }
}

  report(
    sourceFile,
    openingElement,
    `Use ${replacement} from @/shared instead of native <${elementName}>.`,
  );
}

function hasInlineStyleSuppression(sourceFile, node) {
  const openingElement = ts.isJsxElement(node) ? node.openingElement : node;

  const styleAttribute = openingElement.attributes.properties.find(
    (attribute) =>
      ts.isJsxAttribute(attribute) &&
      ts.isIdentifier(attribute.name) &&
      attribute.name.text === "style",
  );

  if (!styleAttribute) {
    return false;
  }

  const sourceText = sourceFile.text;
  const comments = ts.getLeadingCommentRanges(sourceText, styleAttribute.getFullStart()) ?? [];

  return comments.some((comment) => {
    const text = sourceText.slice(comment.pos, comment.end);

    return (
      text.includes("eslint-disable-next-line no-restricted-syntax") ||
      text.includes("architecture-ignore")
    );
  });
}

function validateInlineStyle(sourceFile, node) {
  if (isUiPackageFile(sourceFile.fileName)) {
    return;
  }

  const openingElement = ts.isJsxElement(node) ? node.openingElement : node;

  if (hasInlineStyleSuppression(sourceFile, openingElement)) {
    return;
  }

  const hasStyle = hasJsxAttribute(openingElement, "style");

  if (!hasStyle) {
    return;
  }

  report(
    sourceFile,
    openingElement,
    "Use Tailwind classes or defined CSS instead of inline styles.",
  );
}

function validateFile(filePath) {
  const sourceText = fs.readFileSync(filePath, "utf8");

  const sourceFile = ts.createSourceFile(
    filePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    path.extname(filePath) === ".tsx" ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );

  function visit(node) {
    if (ts.isImportDeclaration(node)) {
      validateParentRelativeImports(sourceFile, node);
      validateRestrictedApiImport(sourceFile, node);
      validateRechartsImport(sourceFile, node);
      validateRestrictedLinkImport(sourceFile, node);
    }

    if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
      validateNativeAnchor(sourceFile, node);
      validateNativeUiElement(sourceFile, node);
      validateInlineStyle(sourceFile, node);
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
}

const sourceFiles = getSourceFiles(FRONTEND_SRC);

for (const filePath of sourceFiles) {
  validateFile(filePath);
}

if (errors.length > 0) {
  console.error(`Frontend architecture validation failed with ${errors.length} violation(s):\n`);

  for (const error of errors) {
    console.error(`${error.file}:${error.line}:${error.column} - ${error.message}`);
  }

  process.exit(1);
}

console.log(`Frontend architecture validation passed (${sourceFiles.length} files checked).`);
