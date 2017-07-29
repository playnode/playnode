const webpack = require('webpack');

module.exports = [
    {
        entry: './es5/App',
        output: {
            path: __dirname + '/public/dist',
            filename: 'playnode.js'
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('production')
                }
            }),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            })
        ]
    }
];
