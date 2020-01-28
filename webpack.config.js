const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const StartServerPlugin = require('start-server-webpack-plugin')
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

const mode =
    process.env.NODE_ENV === 'production' ? 'production' : 'development'
const isDevMode = mode === 'development'
const isProdMode = mode === 'production'

const nodeArgs = ['-r', 'source-map-support/register']

// Passthrough --inspect and --inspect-brk flags (with optional [host:port] value) to node
if (process.env.INSPECT_BRK) {
    nodeArgs.push(process.env.INSPECT_BRK)
} else if (process.env.INSPECT) {
    nodeArgs.push(process.env.INSPECT)
}

const plugins = isDevMode
    ? [
          new webpack.HotModuleReplacementPlugin(),
          // Supress errors to console (we use our own logger)
          new StartServerPlugin({
              name: 'server.js',
              nodeArgs,
              keyboard: true,
          }),
      ]
    : []

// noinspection WebpackConfigHighlighting
module.exports = {
    mode,
    plugins,
    target: 'node',
    entry: resolveApp('src/main.ts'),
    devtool: isDevMode ? 'inline-source-map' : undefined,
    output: {
        path: resolveApp('build'),
        filename: 'server.js',
        libraryTarget: 'commonjs2',
        globalObject: 'this',
    },
    module: {
        exprContextCritical: false,
        rules: [
            { test: /\.ts$/, exclude: /node_modules/, loader: 'babel-loader' },
        ],
    },
    resolve: {
        plugins: [
            new TsconfigPathsPlugin({
                configFile: resolveApp('tsconfig.json'),
            }),
        ],
        extensions: ['.ts', '.tsx', '.js'],
    },
    node: {
        module: 'empty',
        dgram: 'empty',
        dns: 'mock',
        fs: 'empty',
        http2: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty',
    },
    performance: {
        maxEntrypointSize: 3_000_000,
        maxAssetSize: 3_000_000,
    },
    optimization: {
        minimize: isProdMode,
        minimizer: [new TerserPlugin()],
    },
    externals: [
        '@sap/hdbext',
        'ioredis',
        'mongodb',
        'mssql',
        'mysql',
        'mysql2',
        'oracledb',
        'pg-native',
        'pg-query-stream',
        'react-native-sqlite-storage',
        'redis',
        'sql.js',
        'sqlite3',
        'typeorm-aurora-data-api-driver',
        'dtrace-provider',
    ],
}
