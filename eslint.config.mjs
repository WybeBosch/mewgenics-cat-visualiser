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
			reportUnusedDisableDirectives: 'warn',
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
			'no-console': 'warn',
			'no-empty': 'error',
			'no-useless-assignment': 'error',
			'no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
				},
			],
			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/static-components': 'error',
			'react-hooks/exhaustive-deps': 'error',
		},
	},
];
