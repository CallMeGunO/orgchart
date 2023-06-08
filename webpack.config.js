const path = require('path')
const Dotenv = require('dotenv-webpack')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (env, options) => {
    const getEnv = () => {
        const envPath = options.mode === 'development' ? './.env.development' : './.env.production'
        return new Dotenv({ path: envPath })
    }

    return {
        context: path.resolve(__dirname, './src'),
        entry: './index.jsx',
        devtool: options.mode === 'development' ? 'inline-source-map' : false,
        output: {
            filename: 'orgChart.js',
            path: path.resolve(__dirname, './dist')
        },
        resolve: {
            modules: [path.resolve(__dirname, './src'), 'node_modules'],
            extensions: ['.jsx', '.js', '.css']
        },
        plugins: [
            getEnv(),
            new CopyPlugin({
                patterns: [
                    {
                        from: path.resolve(__dirname, './public', 'additions'),
                        to: path.resolve(__dirname, './dist')
                    }
                ]
            }),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, 'public', 'core', 'index.html')
            })
        ],
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: [
                                    [
                                        '@babel/preset-env',
                                        {
                                            useBuiltIns: 'usage',
                                            corejs: '3.25',
                                            targets: '> 0.2%, not dead'
                                        }
                                    ],
                                    '@babel/react'
                                ]
                            }
                        }
                    ]
                },
                {
                    test: /\.css$/i,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'style-loader'
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                modules: {
                                    localIdentName: '[local]',
                                    exportLocalsConvention: 'camelCase'
                                }
                            }
                        }
                    ]
                },
                {
                    test: /\.(png|jpe?g|gif)$/i,
                    use: [
                        {
                            loader: 'file-loader'
                        }
                    ]
                }
            ]
        },
        optimization: {
            usedExports: true
        },
        performance: {
            hints: false,
            maxEntrypointSize: 512000,
            maxAssetSize: 512000
        },
        devServer:
            options.mode === 'development'
                ? {
                      port: 3000,
                      open: true,
                      historyApiFallback: true,
                      hot: true
                  }
                : undefined
    }
}
