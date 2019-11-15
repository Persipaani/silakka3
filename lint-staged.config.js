module.exports = {
  '*.js': ['eslint --fix', 'git add'],
  'package.json': ['format-package -w', 'git add']
}
