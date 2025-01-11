// @ts-check

import eslint from "@eslint/js";
import eslintconfigprettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      ...eslintconfigprettier.rules,
    },
  },
);
