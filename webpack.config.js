const path = require('path')

const CopyPlugin = require('copy-webpack-plugin')
const HtmlMinimizerPlugin = require('html-minimizer-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const prod = process.env.NODE_ENV === 'production'

module.exports = env => {
  return {
    mode: !prod ? 'development' : 'production',
    watch: !prod ? env?.watch : false,
    devtool: !prod ? 'inline-source-map' : undefined,
    resolve: {
      modules: [
        'node_modules',
        path.resolve(__dirname, 'src', 'ts'),
      ],
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    entry: path.resolve(__dirname, 'src', 'ts', 'index.tsx'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'main.js'
    },
    module: {
      rules: [
        {
          test: /\.(html)$/,
          loader: 'file-loader'
        },
        {
          test: /\.sass$/i,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: { sourceMap: !prod },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: !prod,
                sassOptions: { compressed: true }
              }
            },
          ]
        },
        {
          test: /\.(js|jsx|ts|tsx)$/,
          include: path.resolve(__dirname, 'src'),
          exclude: /node_modules/,
          loader: 'ts-loader'
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin(),
      new CopyPlugin({
        patterns: [
          {
            context: path.resolve(__dirname, 'src'),
            from: '*.html',
          }
        ],
      })
    ],
    optimization: {
      minimizer: [
        new HtmlMinimizerPlugin(),
        new TerserPlugin()
      ]
    }
  }
}
