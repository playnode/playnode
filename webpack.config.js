const path = require("path");
const webpack = require("webpack");

module.exports = (env, _) => {

    // noinspection JSUnresolvedVariable
    const isProduction = env && env.production ? env.production : false;

    // noinspection JSUnresolvedFunction
    const plugins = [
        new webpack.DefinePlugin({
            STAGING_ENV: JSON.stringify(isProduction ? 'prod' : 'dev'),
        })
    ];

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
        plugins,
        performance: {hints: false},
        watchOptions: {},
        resolve: {
            extensions: ['.js', '.jsx']
        }
    };
}
