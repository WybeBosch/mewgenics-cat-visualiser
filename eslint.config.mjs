import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
	{
		ignores: [
			'node_modules/**',
			'dist/**',
			'build/**',
			'src/data-grabber/javascript-with-wasm/public/compiled-binaries/**',
			'src/data-grabber/python/public/*.json',
		],
	},
	js.configs.recommended,
	{
		files: ['**/*.{js,jsx}'],
		linterOptions: {
			reportUnusedDisableDirectives: 'off',
		},
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			parserOptions: {
				ecmaVersion: 'latest',
				ecmaFeatures: {
					jsx: true,
				},
			},
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		plugins: {
			'react-hooks': reactHooks,
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			'no-console': 'off',
			'no-empty': 'warn',
			'no-useless-assignment': 'warn',
			'no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
				},
			],
			'react-hooks/rules-of-hooks': 'warn',
			'react-hooks/static-components': 'warn',
		},
	},
];
