import * as path from "path";
import webpack from "webpack";
import * as utils from "./webpack_utils";
import CopyPlugin from "copy-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import sveltePreprocess from "svelte-preprocess";

const choose = "development"

type production = "development" | "production" | "none"
const mode = process.env.NODE_ENV as production || choose;
const prod = mode === 'production';

let GURPS = null;
// GURPS = "C:\\Users\\Ian\\AppData\\Local\\FoundryVTT\\Data\\systems\\GURPS";
// GURPS = "D:\\FoundryServer\\Data\\Data\\systems\\GURPS"

const config: webpack.Configuration = {
    entry: {
        bundle: [path.resolve(__dirname, 'src/index.ts')],
        // worker: [path.resolve(__dirname), 'src/worker.ts']
    },
    externals: {},
    resolve: {
        extensions: ['.mjs', '.ts', '.js', '.wasm', '.svelte', '.json'],
        mainFields: ['svelte', 'browser', 'module', 'main']
    },
    output: {
        path: GURPS || __dirname + '/GURPS',
        filename: 'main.js',
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/i,
                use: {
                    loader: 'ts-loader',
                }
            },
            {
                test: /\.(html|svelte)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'svelte-loader',
                    options: {
                        emitCss: true,
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    /**
                     * MiniCssExtractPlugin doesn't support HMR.
                     * For developing, use 'style-loader' instead.
                     * */
                    prod ? MiniCssExtractPlugin.loader : 'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    /**
                     * MiniCssExtractPlugin doesn't support HMR.
                     * For developing, use 'style-loader' instead.
                     * */
                    prod ? MiniCssExtractPlugin.loader : 'style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sassOptions: {}
                        }
                    }
                ]
            }
        ]
    },
    mode,
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: 'src/images' },
                {
                    from: 'src/system.json',
                    transform(content, path) {
                        return utils.buildSystem(content, path)
                    }
                },
                {
                    from: 'src/template.json',
                    transform(content, path) {
                        return utils.buildTemplate(content, path)
                    }
                },
                { from: 'src/holder.html' }
            ]
        })
    ],
    devtool: prod ? false : 'source-map'
}

export default config;