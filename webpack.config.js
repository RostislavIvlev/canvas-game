const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const optimization = () => {
    const configObj = {
        splitChunks: {
            chunks: 'all'
        }
    };

    
    if (isProd) {
        configObj.minimizer = [
            new OptimizeCssAssetWebpackPlugin(),
            new TerserWebpackPlugin()
        ]
    };

    return configObj;
};

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const filename = (ext) => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`; 

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: './js/main.js',

    output: {
        filename: `./js/${filename('js')}`,
        path: path.resolve(__dirname, 'app'),
        assetModuleFilename: 'assets/[name][ext]'
    },

    devServer: {
        historyApiFallback: true,
        compress: true,
        open: true,
        hot: true,
        port: 8000
    },

    optimization: optimization(),

    plugins: [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.pug'),
            filename: 'index.html',
            minify: {
                collapseWhitespace: isProd
            },
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: `./css/${filename('css')}`,
        }),
    ],

    devtool: isProd ? false : 'source-map',

    module: {
        rules: [
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.css$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: isDev
                        }
                    },
                    'css-loader'
                ]
            },

            {
                test: /\.s[ac]ss$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },

            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },

            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },

            {
                test: /\.js|jsx$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            
            {
                test: /\.pug$/,
                use: [
                  { loader: "html-loader" },
                  {
                    loader: "pug-html-loader",
                    options: {
                        pretty: true
                    }
                  },
                ],
              },
        ]
    }
}