import path from "node:path";

const SRC_ROOT = path.resolve(process.cwd(), "frontend/src");

const FEATURES_ROOT = path.join(SRC_ROOT, "features");

function getFeatureRoot(filePath) {
  const relativeToFeatures = path.relative(FEATURES_ROOT, filePath);

  if (
    relativeToFeatures.startsWith("..") ||
    path.isAbsolute(relativeToFeatures)
  ) {
    return null;
  }

  const [featureName] = relativeToFeatures.split(path.sep);

  if (!featureName) {
    return null;
  }

  return path.join(FEATURES_ROOT, featureName);
}

function getAliasTarget(importPath) {
  if (!importPath.startsWith("@/")) {
    return null;
  }

  return path.resolve(SRC_ROOT, importPath.slice(2));
}

function getRelativeImport(importerFile, targetPath) {
  let relativePath = path.relative(path.dirname(importerFile), targetPath);

  relativePath = relativePath.replaceAll(path.sep, "/");

  if (!relativePath.startsWith(".")) {
    relativePath = `./${relativePath}`;
  }

  return relativePath;
}

function isInsideFeature(featureRoot, targetPath) {
  const relative = path.relative(featureRoot, targetPath);

  return (
    relative !== "" && !relative.startsWith("..") && !path.isAbsolute(relative)
  );
}

export default {
  meta: {
    type: "problem",

    docs: {
      description:
        "Use relative imports within a feature and @ aliases across feature boundaries",
    },

    fixable: "code",

    schema: [],

    messages: {
      useRelative:
        "Use a relative import for files within the current feature.",
    },
  },

  create(context) {
    const filename = context.filename;

    if (!filename || filename === "<input>") {
      return {};
    }

    const importerFeatureRoot = getFeatureRoot(filename);

    if (!importerFeatureRoot) {
      return {};
    }

    function checkSource(node) {
      if (!node.source) {
        return;
      }

      const importPath = node.source.value;

      if (typeof importPath !== "string") {
        return;
      }

      // Only handle @/ aliases.
      if (!importPath.startsWith("@/")) {
        return;
      }

      const targetPath = getAliasTarget(importPath);

      if (!targetPath) {
        return;
      }

      // Only convert aliases that point inside the same feature.
      if (!isInsideFeature(importerFeatureRoot, targetPath)) {
        return;
      }

      const relativeImport = getRelativeImport(filename, targetPath);

      context.report({
        node: node.source,

        messageId: "useRelative",

        fix(fixer) {
          return fixer.replaceText(node.source, `"${relativeImport}"`);
        },
      });
    }

    return {
      ImportDeclaration: checkSource,
      ExportNamedDeclaration: checkSource,
      ExportAllDeclaration: checkSource,
    };
  },
};
