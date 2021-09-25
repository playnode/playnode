module.exports = (env, _) => {
    const isProduction = env && env.production ? env.production : false;

    return {
        mode: isProduction ? 'production' : 'development',
        devtool: isProduction ? false : 'source-map',
        output: {
            path: __dirname + '/public/dist',
            filename: 'playnode.js',
        },
        entry: './src/index',
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
                                outputPath: 'assets/'
                            }
                        }
                    ]
                }
            ]
        },
        performance: {hints: false},
        watchOptions: {},
        resolve: {},
        node: {}
    };
}
