import js from "@eslint/js";
import globals from "globals";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import-x";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import prettierConfig from "eslint-config-prettier";

export default [
  // ── Ignore patterns ──
  {
    ignores: ["dist/**", "node_modules/**", "*.config.js", "*.config.cjs"],
  },

  // ── Base JS recommended ──
  js.configs.recommended,

  // ── Main source config ──
  {
    files: ["src/**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "import-x": importPlugin,
      "jsx-a11y": jsxA11yPlugin,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      // ── React ──
      "react/react-in-jsx-scope": "off", // React 19 — not needed
      "react/prop-types": "off", // Using JS, no PropTypes enforced
      "react/jsx-key": "error",
      "react/no-unescaped-entities": "warn",
      "react/jsx-no-target-blank": "error",
      "react/self-closing-comp": "warn",
      "react/jsx-curly-brace-presence": [
        "warn",
        { props: "never", children: "never" },
      ],

      // ── React Hooks ──
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // ── Import ordering ──
      "import-x/order": [
        "warn",
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
            { pattern: "@/**", group: "internal", position: "before" },
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "import-x/no-duplicates": "warn",

      // ── General quality ──
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
      "no-console": ["warn", { allow: ["error", "warn"] }],
      "no-debugger": "error",
      "prefer-const": "warn",
      "no-var": "error",
      eqeqeq: ["warn", "smart"],
      curly: ["warn", "multi-line"],

      // ── Accessibility ──
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/anchor-is-valid": "warn",
      "jsx-a11y/click-events-have-key-events": "off", // too noisy
      "jsx-a11y/no-static-element-interactions": "off",
    },
  },

  // ── Prettier compat (must be last) ──
  prettierConfig,
];
