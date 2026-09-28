import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import unusedImports from "eslint-plugin-unused-imports";
import { defineConfig, globalIgnores } from "eslint/config";
import prettier from "eslint-config-prettier";
import importX from "eslint-plugin-import-x";
import noParentRelativeImports from "./eslint/rules/no-parent-relative-imports.mjs";

export default defineConfig([
  // #region Global ignores

  globalIgnores(["dist"]),

  // #endregion

  // #region TypeScript / React

  {
    files: ["**/*.{ts,tsx}"],

    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      prettier,
    ],

    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,

      parserOptions: {
        projectService: true,
      },
    },

    plugins: {
      "unused-imports": unusedImports,
      "import-x": importX,
      local: {
        rules: {
          "no-parent-relative-imports": noParentRelativeImports,
        },
      },
    },

    rules: {
      // #region Imports

      "local/no-parent-relative-imports": "error",

      "import-x/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],

          pathGroups: [
            {
              pattern: "@/**",
              group: "internal",
            },
          ],

          "newlines-between": "always",
        },
      ],

      "unused-imports/no-unused-imports": "error",

      "unused-imports/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      // #endregion

      // #region TypeScript

      "@typescript-eslint/no-deprecated": "error",

      "id-length": [
        "error",
        {
          min: 2,
          exceptions: ["_"],
        },
      ],

      // #endregion

      // #region JSX restrictions

      "no-restricted-syntax": [
        "error",

        // No inline styles
        {
          selector: "JSXAttribute[name.name='style']",
          message:
            "Use Tailwind classes or defined CSS instead of inline styles.",
        },
      ],

      // #endregion

      // #region File size

      "max-lines": [
        "error",
        {
          max: 300,
          skipBlankLines: true,
          skipComments: true,
        },
      ],

      "max-lines-per-function": [
        "warn",
        {
          max: 200,
          skipBlankLines: true,
          skipComments: true,
          IIFEs: true,
        },
      ],

      // #endregion
    },
  },

  // #endregion

  // #region API architecture

  {
    files: [
      "frontend/src/features/*/pages/**/*.{ts,tsx}",
      "frontend/src/features/*/components/**/*.{ts,tsx}",
    ],

    rules: {
      // API functions must be accessed through hooks
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/*/api/*"],
              message:
                "API calls must go through hooks. Do not import API functions directly from pages or components.",
              allowTypeImports: true,
            },
          ],
        },
      ],
    },
  },

  // #endregion

  // #region Generated schema exceptions

  {
    files: ["**/src/shared/api/schema/types.ts"],

    rules: {
      "max-lines": "off",
      "max-lines-per-function": "off",
    },
  },

  // #endregion
]);
