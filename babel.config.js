const presets = [
  '@babel/preset-typescript',
  [
    '@babel/preset-env',
    {
      // For more info on babel + core-js v3,
      // @see https://babeljs.io/blog/2019/03/19/7.4.0
      useBuiltIns: 'usage',
      corejs: 3,
    },
  ],
  'minify',
]

const plugins = ['@babel/plugin-proposal-class-properties']

module.exports = {
  compact: true,
  comments: false,
  presets,
  plugins,
}
