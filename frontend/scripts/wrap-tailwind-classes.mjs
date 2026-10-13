
// SPDX-License-Identifier: MPL-2.0

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import ts from "typescript";

// #region Configuration

const ROOT = path.resolve("src");

const MAX_LENGTH = 100;

const CHECK_MODE = process.argv.includes("--check");

const EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx"]);

const CLASS_FUNCTIONS = new Set([
  "cva",
  "cn",
  "clsx",
  "classNames",
  "twMerge",
]);

// #endregion

// #region File Discovery

function getFiles(directory) {
  if (!fs.existsSync(directory)) {
    throw new Error(`Directory not found: ${directory}`);
  }

  const files = [];

  for (const entry of fs.readdirSync(directory, {
    withFileTypes: true,
  })) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...getFiles(fullPath));
      continue;
    }

    if (EXTENSIONS.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

// #endregion

// #region Class Detection

function isClassFunction(node) {
  if (!ts.isCallExpression(node)) return false;

  const expression = node.expression;

  return (
    ts.isIdentifier(expression) &&
    CLASS_FUNCTIONS.has(expression.text)
  );
}

function isClassNameAttribute(node) {
  return (
    ts.isJsxAttribute(node) &&
    node.name.text === "className"
  );
}

function isCvaCall(node) {
  return (
    ts.isCallExpression(node) &&
    ts.isIdentifier(node.expression) &&
    node.expression.text === "cva"
  );
}

function isInsideCva(node) {
  let current = node.parent;

  while (current) {
    if (isCvaCall(current)) {
      return true;
    }

    current = current.parent;
  }

  return false;
}

function isClassString(node) {
  const parent = node.parent;

  if (!parent) return false;

  // JSX: className="..."
  if (isClassNameAttribute(parent)) {
    return true;
  }

  // JSX: className={"..."}
  if (
    ts.isJsxExpression(parent) &&
    parent.expression === node &&
    parent.parent &&
    isClassNameAttribute(parent.parent)
  ) {
    return true;
  }

  // Function calls: cn("..."), cva("...")
  if (
    ts.isCallExpression(parent) &&
    isClassFunction(parent)
  ) {
    return true;
  }

  // CVA variant values
  if (
    ts.isPropertyAssignment(parent) &&
    parent.initializer === node &&
    isInsideCva(node)
  ) {
    return true;
  }

  // Strings inside class arrays
  if (
    ts.isArrayLiteralExpression(parent) &&
    parent.elements.includes(node)
  ) {
    return (
      isInsideCva(node) ||
      (
        ts.isCallExpression(parent.parent) &&
        isClassFunction(parent.parent)
      )
    );
  }

  return false;
}

// #endregion

// #region String Wrapping

function getBaseUtility(className) {
  // Strip variant prefixes such as hover:, md:, and focus-visible:
  // without treating colons inside arbitrary variants as separators.
  let bracketDepth = 0;
  let lastColon = -1;

  for (let i = 0; i < className.length; i += 1) {
    if (className[i] === "[") bracketDepth += 1;
    if (className[i] === "]") bracketDepth -= 1;

    if (className[i] === ":" && bracketDepth === 0) {
      lastColon = i;
    }
  }

  return className
    .slice(lastColon + 1)
    .replace(/^!/, "")
    .replace(/^-/, "");
}

function getClassGroup(className) {
  const utility = getBaseUtility(className);

  // Layout and positioning
  if (
    /^(block|inline|flex|grid|hidden|contents|flow-root|table|absolute|relative|fixed|sticky|static|isolate|isolation-|float-|clear-|inset-|top-|right-|bottom-|left-|start-|end-|z-|order-|basis-|grow$|grow-|shrink$|shrink-|flex-|items-|justify-|content-|self-|place-|col-|row-|auto-cols-|auto-rows-|grid-cols-|grid-rows-|grid-flow-|overflow-|overscroll-|object-|visible$|invisible$|collapse$)/.test(
      utility,
    )
  ) {
    return "layout";
  }

  // Margins, padding, gaps, and spacing between children
  if (
    /^(p|px|py|pt|pr|pb|pl|ps|pe|m|mx|my|mt|mr|mb|ml|ms|me|gap|gap-x|gap-y|space-x|space-y)-/.test(
      utility,
    )
  ) {
    return "spacing";
  }

  // Width, height, and sizing constraints
  if (
    /^(size|w|min-w|max-w|h|min-h|max-h|aspect|container)-/.test(
      utility,
    )
  ) {
    return "sizing";
  }

  // Typography and text presentation
  if (
    /^(font-|text-|leading-|tracking-|indent-|whitespace-|break-|hyphens-|antialiased$|subpixel-antialiased$|italic$|not-italic$|uppercase$|lowercase$|capitalize$|normal-case$|truncate$|overflow-ellipsis$|underline$|overline$|line-through$|no-underline$|decoration-|underline-offset-|list-|align-)/.test(
      utility,
    )
  ) {
    return "typography";
  }

  // Backgrounds, borders, outlines, and visual surfaces
  if (
    /^(bg-|border($|-)|rounded($|-)|ring($|-)|outline($|-)|shadow($|-)|opacity-|accent-|caret-|fill-|stroke-|divide-|from-|via-|to-)/.test(
      utility,
    )
  ) {
    return "appearance";
  }

  // Transforms, transitions, animation, and visual effects
  if (
    /^(transform$|transform-|translate-|rotate-|scale-|skew-|origin-|transition($|-)|duration-|ease-|delay-|animate-|blur($|-)|brightness-|contrast-|drop-shadow-|grayscale$|grayscale-|hue-rotate-|invert$|invert-|saturate-|sepia$|sepia-|backdrop-)/.test(
      utility,
    )
  ) {
    return "effects";
  }

  // Interaction and scrolling behavior
  if (
    /^(cursor-|pointer-events-|select-|resize($|-)|touch-|scroll-|snap-|will-change-|appearance-|caret-)/.test(
      utility,
    )
  ) {
    return "interaction";
  }

  return "other";
}

function splitClasses(value, maxLength) {
  const classes = value.trim().split(/\s+/);
  const groupOrder = [
    "layout",
    "spacing",
    "sizing",
    "typography",
    "appearance",
    "effects",
    "interaction",
    "other",
  ];

  const groups = new Map(groupOrder.map((group) => [group, []]));

  for (const className of classes) {
    const group = getClassGroup(className);
    groups.get(group).push(className);
  }

  const lines = [];

  for (const group of groupOrder) {
    const groupClasses = groups.get(group);
    let current = "";

    for (const className of groupClasses) {
      const next = current ? `${current} ${className}` : className;

      if (next.length > maxLength && current) {
        lines.push(current);
        current = className;
      } else {
        current = next;
      }
    }

    if (current) {
      lines.push(current);
    }
  }

  return lines;
}


function getIndent(source, position) {
  const lineStart = source.lastIndexOf("\n", position - 1) + 1;
  const line = source.slice(lineStart, position);

  return line.match(/^\s*/)?.[0] ?? "";
}

function createWrappedExpression(value, indent) {
  const lines = splitClasses(value, MAX_LENGTH);

  const childIndent = `${indent}  `;

  return [
    "[",
    ...lines.map(
      (line) => `${childIndent}${JSON.stringify(line)},`,
    ),
    `${indent}].join(" ")`,
  ].join("\n");
}

// #endregion

// #region Transformation

function getJoinedClassArray(node) {
  if (
    !ts.isCallExpression(node) ||
    !ts.isPropertyAccessExpression(node.expression) ||
    node.expression.name.text !== "join" ||
    node.arguments.length !== 1 ||
    !ts.isStringLiteral(node.arguments[0]) ||
    node.arguments[0].text !== " "
  ) {
    return null;
  }

  const array = node.expression.expression;

  if (!ts.isArrayLiteralExpression(array)) {
    return null;
  }

  const elements = [...array.elements];

  if (
    elements.some(
      (element) =>
        !ts.isStringLiteral(element) &&
        !ts.isNoSubstitutionTemplateLiteral(element),
    )
  ) {
    return null;
  }

  return {
    value: elements.map((element) => element.text).join(" "),
  };
}

function isClassJoinExpression(node) {
  const parent = node.parent;

  if (!parent) {
    return false;
  }

  // JSX: className={[...].join(" ")}
  if (
    ts.isJsxExpression(parent) &&
    parent.expression === node &&
    parent.parent &&
    isClassNameAttribute(parent.parent)
  ) {
    return true;
  }

  // Function calls: cn([...].join(" ")), cva([...].join(" "))
  if (
    ts.isCallExpression(parent) &&
    parent.arguments.includes(node) &&
    isClassFunction(parent)
  ) {
    return true;
  }

  // CVA variant values
  if (
    ts.isPropertyAssignment(parent) &&
    parent.initializer === node &&
    isInsideCva(node)
  ) {
    return true;
  }

  return false;
}

function transformFile(filePath) {
  const source = fs.readFileSync(filePath, "utf8");

  const sourceFile = ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    filePath.endsWith(".tsx") || filePath.endsWith(".jsx")
      ? ts.ScriptKind.TSX
      : ts.ScriptKind.TS,
  );

  const edits = [];

function visit(node) {
  // Handle existing ["...", "..."].join(" ") expressions first.
  // Rebuild the entire expression so classes can move between groups.
  if (
    ts.isCallExpression(node) &&
    isClassJoinExpression(node)
  ) {
    const joined = getJoinedClassArray(node);

    if (joined) {
      const start = node.getStart(sourceFile);
      const end = node.getEnd();
      const indent = getIndent(source, start);
      const replacement = createWrappedExpression(
        joined.value,
        indent,
      );

      if (replacement !== source.slice(start, end)) {
        edits.push({
          start,
          end,
          replacement,
        });
      }

      // Don't visit individual strings inside this expression.
      return;
    }
  }

  // Handle long, unwrapped string literals as before.
  if (
    (ts.isStringLiteral(node) ||
      ts.isNoSubstitutionTemplateLiteral(node)) &&
    isClassString(node)
  ) {
    const value = node.text;

    if (
      value.length > MAX_LENGTH &&
      value.trim() === value &&
      !/\s{2,}/.test(value)
    ) {
      const start = node.getStart(sourceFile);
      const end = node.getEnd();
      const indent = getIndent(source, start);

      let replacement = createWrappedExpression(
        value,
        indent,
      );

      // JSX attributes require expression braces.
      if (isClassNameAttribute(node.parent)) {
        replacement = `{${replacement}}`;
      }

      edits.push({
        start,
        end,
        replacement,
      });
    }
  }

  ts.forEachChild(node, visit);
}

  visit(sourceFile);

  if (edits.length === 0) {
    return 0;
  }

  // Apply edits backwards to preserve original offsets.
  edits.sort((a, b) => b.start - a.start);

  let output = source;

  for (const edit of edits) {
    output =
      output.slice(0, edit.start) +
      edit.replacement +
      output.slice(edit.end);
  }

const relativePath = path.relative(process.cwd(), filePath);

if (!CHECK_MODE) {
  fs.writeFileSync(filePath, output);
}

const action = CHECK_MODE ? "needs wrapping" : "wrapped";

console.log(`${relativePath}: ${edits.length} ${action}`);

return edits.length;
}

// #endregion

// #region Main

function main() {
  const files = getFiles(ROOT);

  let changedFiles = 0;
  let wrappedStrings = 0;

  for (const file of files) {
    const count = transformFile(file);

    if (count > 0) {
      changedFiles++;
      wrappedStrings += count;
    }
  }

  console.log("");
  console.log(`Files scanned: ${files.length}`);
  console.log(`Files ${CHECK_MODE ? "requiring changes" : "changed"}: ${changedFiles}`);
  console.log(`Strings ${CHECK_MODE ? "requiring wrapping" : "wrapped"}: ${wrappedStrings}`);

  if (CHECK_MODE && changedFiles > 0) {
    console.error("\nTailwind check failed. Run npm run tailwind:wrap.");
    process.exitCode = 1;
    return;
  }

  if (CHECK_MODE) {
    console.log("\nTailwind check passed.");
  }
}

main();

// #endregion
