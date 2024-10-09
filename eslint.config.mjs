import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";


export default [
    {files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]},
    {languageOptions: { globals: globals.browser }},
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
    {
        rules: {
            "consistent-return": 2,
            "indent"           : [1, 4],
            "no-else-return"   : 1,
            "semi"             : [1, "always"],
            "space-unary-ops"  : 2
        }
  
    }
];