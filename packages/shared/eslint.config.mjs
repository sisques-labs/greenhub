import baseConfig from "../../eslint.config.mjs";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";

export default [
	...baseConfig,
	{
		files: ["**/*.ts", "**/*.tsx"],
		plugins: {
			react: reactPlugin,
			"react-hooks": reactHooksPlugin,
		},
		rules: {
			...reactPlugin.configs.recommended.rules,
			...reactHooksPlugin.configs.recommended.rules,
			"react/react-in-jsx-scope": "off",
			"react/prop-types": "off",
			"@typescript-eslint/explicit-module-boundary-types": "off",
		},
		settings: {
			react: {
				version: "detect",
			},
		},
	},
];

