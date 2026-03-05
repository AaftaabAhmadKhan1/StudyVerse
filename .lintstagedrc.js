module.exports = {
  '*.{ts,tsx}': ['prettier --write', 'eslint --fix --max-warnings 0'],
  '*.{js,jsx,mjs}': ['prettier --write'],
  '*.{json,md,yml,yaml,css}': ['prettier --write'],
};
