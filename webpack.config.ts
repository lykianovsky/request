import path from 'path'
import {Configuration} from 'webpack'
import {CleanWebpackPlugin} from 'clean-webpack-plugin'

const config: Configuration = {
  entry: './src/index.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@rest/*': path.resolve(__dirname, 'src/rest'),
      '@utils/*': path.resolve(__dirname, 'src/utils'),
      '@internal-types/*': path.resolve(__dirname, 'src/types'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [new CleanWebpackPlugin()],
  mode: 'production',
}

export default config
