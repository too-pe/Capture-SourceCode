module.exports = {
  root: true, // 对Babel解析器的包装使其与 ESLint 兼容。
  parserOptions: {
    // 代码是 ECMAScript 模块
    sourceType: 'module'
  },
  env: {
    node: true,
    // browser: true, // 浏览器环境
  },
  extends: [
    'plugin:vue/essential',
    "eslint:recommended"
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    // allow paren-less arrow functions
    'arrow-parens': 0, // allow async-await
    'generator-star-spacing': 0,
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'space-before-function-paren': 'off',
    'linebreak-style': 0, // 强制执行一致的换行样式，windows和mac不一样
    'eqeqeq': 0, // 不需要强制使用全等
    'no-underscore-dangle': 0, // 不允许下划线作为变量名之一
  }
}
