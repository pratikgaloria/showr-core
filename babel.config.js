module.exports = {
  presets: [
    ['@babel/preset-env'],
    ['minify', {
      keepFnName: true,
    }],
  ],
  plugins: [
    ['@babel/plugin-proposal-export-default-from'],
    ['@babel/plugin-proposal-class-properties'],
  ],
};
