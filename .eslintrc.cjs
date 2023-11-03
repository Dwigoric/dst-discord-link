/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')
require('eslint-plugin-import')

module.exports = {
    root: true,
    env: {
        node: true
    },
    plugins: ['prettier'],
    extends: ['eslint:recommended', 'plugin:import/recommended'],
    parserOptions: {
        ecmaVersion: 'latest'
    }
}
