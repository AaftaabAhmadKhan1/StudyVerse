module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'docs', // Documentation
        'style', // Formatting (no logic change)
        'refactor', // Code restructuring
        'test', // Adding/updating tests
        'chore', // Maintenance
        'ci', // CI/CD changes
        'perf', // Performance
        'revert', // Revert commit
      ],
    ],
    'subject-max-length': [2, 'always', 72],
    'body-max-line-length': [1, 'always', 100],
  },
};
