const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

const umdBundle = {
  entry: {
    Application: './src/components/nodes/Application.tsx',
    ApplicationView: './src/visualiser/react-flow-renderer/ApplicationView.tsx',
  },
  target: 'web',
  mode: 'production',

  output: {
    path: path.resolve(__dirname, 'browser'),
    filename: '[name].js',
    library: 'Edavisualiser',
    libraryTarget: 'umd',
    libraryExport: 'default',
    umdNamedDefine: true,
    globalObject: `(typeof self !== 'undefined' ? self : this)`,
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          configFile: 'tsconfig.esm.json',
          transpileOnly: true,
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
  },

  plugins: [],
};

const bundles = [];

process.env['BUILD_MODE'] === 'umd' && bundles.push(umdBundle);

module.exports = bundles;
