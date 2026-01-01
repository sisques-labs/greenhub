import baseConfig from "../../eslint.config.mjs";
import reactPlugin from "eslint-plugin-react";

export default [
	...baseConfig,
	{
		files: ["**/*.ts", "**/*.tsx"],
		plugins: {
			react: reactPlugin,
		},
		rules: {
			...reactPlugin.configs.recommended.rules,
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

