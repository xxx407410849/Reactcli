const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

let WEBPACK_ENV = process.env.WEBPACK_ENV || 'dev';
const extractCSS = new ExtractTextPlugin({
    filename: 'stylesheets/[name].css',
    disable: process.env.WEBPACK_ENV === "dev",
    ignoreOrder: true
});
const extractLess = new ExtractTextPlugin({
    filename: "stylesheets/[name].css",
    disable: process.env.WEBPACK_ENV === "dev",
    ignoreOrder: true
});
module.exports = {
    mode: "development",
    entry: path.resolve(__dirname, './package.jsx'),
    devtool: 'inline-source-map',
    devServer: {
        port: 8086
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "js/[name].js",
        chunkFilename: 'js/[name].chunk.js',
        publicPath: '/dist/'
    },
    optimization: {
        splitChunks: {
            chunks: 'initial',
            cacheGroups: {
                vendor: {
                    test: /node_modules\//,
                    name: 'vendor',
                    priority: 10,
                    enforce: true
                },
                commons: {
                    test: /public\//,
                    name: 'public',
                    priority: 10,
                    enforce: true
                }
            }
        },
        runtimeChunk: {
            name:'mainfest'
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env', 'react'],
                    }
                }
            },
            {
                test: /\.css$/,
                use: extractCSS.extract({use :['css-loader'],fallback: 'style-loader'})
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                  {
                    loader: 'url-loader',
                    options: {
                      limit: 8192,
                      name: 'img/[name].[ext]'
                    }
                  }
                ]
            },
            {
                test: /\.less$/,
                use: extractLess.extract(['css-loader','less-loader'],'style-loader')
            }, {
                test: /\.ejs$/,
                loader: 'ejs-loader'
            },{
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                      loader: 'url-loader',
                      options: {
                        limit: 8192,
                        name: 'font/[name].[ext]'
                      }
                    }
                ]
            }
        ]
    },
    plugins: [
        extractLess,
        extractCSS,
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            filename: 'view/index.html',
            template: 'view/react_demo.html'
        }),
        ()=>{
            console.log(WEBPACK_ENV);
            if(WEBPACK_ENV === 'dev') new webpack.HotModuleReplacementPlugin()
        }
    ]
}