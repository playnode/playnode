const path = require("path");
module.exports = (env, _) => {
    // noinspection JSUnresolvedVariable
    const isProduction = env && env.production ? env.production : false;
    return {
        mode: isProduction ? 'production' : 'development',
        devtool: isProduction ? false : 'source-map',
        output: {
            path: __dirname + '/public/dist',
            filename: 'bundle.js'
        },
        entry: './src/index',
        devServer: {
            historyApiFallback: true,
            devMiddleware: {
                writeToDisk: true
            },
            static: [
                {
                    directory: path.join(__dirname, "public"),
                    publicPath: "/"
                }
            ],
            port: 8088
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                "@babel/preset-env",
                                "@babel/preset-react"
                            ]
                        }
                    }
                },
                {
                    test: /\.(gif|png|jpe?g|svg)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].[ext]',
                                outputPath: 'assets/images/'
                            }
                        }
                    ]
                }
            ]
        },
        performance: {hints: false},
        watchOptions: {},
        resolve: {
            extensions: ['.js', '.jsx']
        }
    };
}
