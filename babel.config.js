/**
 * Babel transpiler config
 *
 * @see https://babeljs.io/
 */
module.exports = function (api) {
  api.cache(true)

  const presets = ['@babel/env']
  const plugins = [
    '@babel/transform-runtime',
    '@babel/proposal-object-rest-spread',
    '@babel/proposal-optional-chaining',
    '@babel/proposal-class-properties',
    'dynamic-import-node',
    'babel-plugin-root-import'
  ]

  return {
    presets,
    plugins
  }
}
