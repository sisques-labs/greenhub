import baseConfig from "../../eslint.config.js";

export default [
	...baseConfig,
	{
		files: ["**/*.ts", "**/*.tsx"],
		rules: {
			"@typescript-eslint/explicit-module-boundary-types": "off",
		},
	},
];

