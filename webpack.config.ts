import * as path from "path";
import webpack from "webpack";
import * as utils from "./system-builder";
import CopyPlugin from "copy-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import sveltePreprocess, { postcss } from "svelte-preprocess";
import { TsConfigPathsPlugin } from "awesome-typescript-loader";

type mode = "development" | "production" | "none"
const mode = process.argv[process.argv.indexOf("--mode") >= 0 ? process.argv.indexOf("--mode") + 1 : null] as mode || "development";
const prod = mode === 'production';

let output
output = "C:\\Users\\Ian\\AppData\\Local\\FoundryVTT\\Data\\systems\\GURPS";

const config: webpack.Configuration = {
    entry: {
        bundle: [path.resolve(__dirname, 'src/index.ts')],
        // worker: [path.resolve(__dirname), 'src/worker.ts']
    },
    externals: {},
    resolve: {
        plugins: [
            new TsConfigPathsPlugin({ configFileName: "tsconfig.json", })
        ],
        extensions: ['.mjs', '.ts', '.js', '.wasm', '.svelte', '.json'],
        mainFields: ['svelte', 'browser', 'module', 'main']
    },
    output: {
        path: output || __dirname + '/dist',
        filename: 'main.js',
    },
    module: {
        rules: [
            {
                test: /\.md$/i,
                use: [
                    { loader: "html-loader" },
                    {
                        loader: "markdown-loader",
                        options: {}
                    }
                ]
            },
            {
                test: /\.(ts|tsx)$/i,
                exclude: /node_modules/,
                use: {
                    loader: 'awesome-typescript-loader',
                }
            },
            {
                test: /\.(html|svelte)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'svelte-loader',
                    options: {
                        emitCss: true,
                        preprocess: [
                            postcss({
                                plugins: [
                                    require("tailwindcss"),
                                    require("autoprefixer")
                                ]
                            })
                        ]
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
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                ident: "postcss",
                                plugins: [
                                    require("tailwindcss"),
                                    require("autoprefixer")
                                ]
                            }
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
                { from: 'src/assets', to: "./assets" },
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
                }
            ]
        })
    ],
    devtool: prod ? false : 'source-map'
}

export default config;