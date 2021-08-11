const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const production = (argv.mode === 'production');

  return {
    mode: production ? 'production' : 'development',
    entry: {},
    output: {
      path: path.resolve(__dirname, 'public'),
      publicPath: production ? 'https://mikumo.abcang.net/' : '/',
    },
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|gif)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'images/[name].[contenthash][ext]',
          },
        },
        {
          test: /\.(ttf|woff)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name].[contenthash][ext]',
          },
        },
        {
          test: /favicon\.ico$/i,
          type: 'asset/resource',
          generator: {
            filename: '[name][ext]',
          },
        },
        {
          test: /\.js$/i,
          type: 'asset/resource',
          generator: {
            filename: 'js/[name].[contenthash][ext]',
          },
          include: [
            path.resolve(__dirname, 'client/src'),
          ],
        },
        {
          test: /\.scss$/i,
          type: 'asset/resource',
          generator: {
            filename: 'css/[name].[contenthash][ext]',
          },
          use: [
            'extract-loader',
            {
              loader: 'css-loader',
              options: {
                esModule: false,
                sourceMap: !production,
                importLoaders: 1,
                modules: false,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: !production,
              },
            },
          ],
        },
        {
          test: /\.html$/i,
          use: [
            {
              loader: 'html-loader',
              options: {
                esModule: false,
                sources: {
                  urlFilter: (attribute, value, resourcePath) => {
                    // The `attribute` argument contains a name of the HTML attribute.
                    // The `value` argument contains a value of the HTML attribute.
                    // The `resourcePath` argument contains a path to the loaded HTML file.

                    if (value === '/socket.io/socket.io.js') {
                      return false;
                    }

                    return true;
                  },
                },
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'client/src/index.html',
        minify: true,
        inject: false,
      }),
    ],
  };
};
