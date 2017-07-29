module.exports = [
    {
        entry: './src/App',
        output: {
            path: __dirname + '/public/dist',
            filename: 'playnode.js'
        },
        devtool: 'source-map',
        module: {
            loaders: [
                {
                    test: /\.jsx?$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                    query: {
                        presets: [
                            'es2015',
                            'react'
                        ]
                    }
                }
            ]
        }
    }
];
