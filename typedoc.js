module.exports = {
  out: './docs',
  includes: './src',
  exclude: [
      '**/__tests__/*',
      '**/**/*.json',
      '**/**/index.ts'
  ],
  mode: 'file',
  excludeExternals: true,
  excludeNotExported: true,
  excludePrivate: true,
};