module.exports = {
  presets: [
    'module:metro-react-native-babel-preset',
  ],
  plugins: [
    [
      'module-resolver',
      {
        cwd: 'bablerc',
        extensions: [
          '.js',
          '.jsx',
          '.ts',
          '.ios.ts',
          '.tsx',
          '.ios.tsx',
          '.android.ts',
          '.android.tsx',
          '.json'
        ],
        alias: {
          '@redux': './src/redux/modules',
          '@navigations': './src/Navigations',
          '@assets': './assets/new',
          '@screens': './src/Screens',
          '@services': './src/services',
          '@utils': './src/utils',
          '@jitsi': './jitsi/features',
          '@components': './src/components',
          '@oldassets': './assets/'
        }
      }
    ]
  ]
};