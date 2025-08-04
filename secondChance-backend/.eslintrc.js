module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
    extends: 'eslint:recommended', // 或 'standard'（需要安装依赖）

  overrides: [
    {
      env: {
        node: true
      },
      files: [
        '.eslintrc.{js,cjs}'
      ],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    "indent": ["error", 2],
    "quotes": ["error", "single"],
    "semi": ["error", "never"],
    "no-multiple-empty-lines": ["error", { "max": 1 }],
    "object-curly-spacing": ["error", "always"],
    "arrow-spacing": ["error", { "before": true, "after": true }],
    "comma-spacing": ["error", { "before": false, "after": true }],
    "spaced-comment": ["error", "always"],
    'no-undef': 'off',         // 关闭变量未定义检查
    'no-unused-vars': 'off',   // 关闭未使用变量检查
  }
}
