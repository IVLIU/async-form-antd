const { override, addLessLoader, fixBabelImports, disableChunk } = require('customize-cra');

module.exports = override(
  disableChunk(),
  addLessLoader({
    strictMath: true,
    noIeCompat: true,
    localIdentName: '[local]--[hash:base64:5]',
  }),
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css',
  }),
);