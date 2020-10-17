const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

module.exports = {
    entry: './src/index.js',
    devServer: {
        contentBase: './dist',
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    'style-loader',
                    'css-loader'
                ],
            },
            {
                test: /\.handlebars$/,
                loader: "handlebars-loader",
                options: {
                    runtime: path.join(__dirname, 'src/handlebars')
                }
            },
            {
                test: /\.ttf$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: 'assets/[name].[ext]',
                    }
                }]
            },
            {
                test: /\.png$/,
                use: ['file-loader'],
            }
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: 'assets', to: 'assets' }
            ],
        }),
        new ImageminPlugin({
            test: /\.png$/i,
            pngquant: {
                quality: '95-100'
            }
        }),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            hash: true
        })
    ]
};