export default {
	extends: ['stylelint-config-standard', 'stylelint-config-idiomatic-order'],
	rules: {
		'annotation-no-unknown': [
			true,
			{
				ignoreAnnotations: ['default'],
			},
		],
		'comment-empty-line-before': [
			'always',
			{
				except: ['first-nested'],
				ignore: ['after-comment', 'stylelint-commands'],
			},
		],
		'font-family-no-missing-generic-family-keyword': [true],
		'rule-empty-line-before': [
			'always-multi-line',
			{
				ignore: ['after-comment'],
				except: ['first-nested'],
			},
		],
	},
};
