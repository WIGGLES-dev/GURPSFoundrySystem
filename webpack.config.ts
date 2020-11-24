import * as path from "path";
import webpack from "webpack";
import * as utils from "./system-builder";
import CopyPlugin from "copy-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import sveltePreprocess, { postcss } from "svelte-preprocess";
import { TsConfigPathsPlugin } from "awesome-typescript-loader";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import FixStyleOnlyEntriesPlugin from "webpack-fix-style-only-entries";

const mode = "development";
//@ts-ignore
const prod = mode === 'production';

const paths = [
    "C:\\Users\\Ian\\AppData\\Local\\FoundryVTT\\Data\\systems\\GURPS",
    path.resolve(__dirname, "./dist")
]

const config = (target): webpack.Configuration => ({
    entry: {
        "valor": [path.resolve(__dirname, 'src/index.ts')],
        "foundryValor": [path.resolve(__dirname, "src/styles/styles.css")]
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
        path: target,
        filename: '[name].js',
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
                test: /\.s?css$/,
                use: [
                    MiniCssExtractPlugin.loader || 'style-loader',
                    'css-loader',
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                ident: "postcss",
                                plugins: [
                                    require("tailwindcss"),
                                    require("postcss-nested"),
                                    require("autoprefixer"),
                                ]
                            }
                        }
                    },
                    "sass-loader"
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
                loader: 'url-loader',
                options: {
                    limit: 8192,
                },
            },
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
        }),
        new FixStyleOnlyEntriesPlugin(),
        new MiniCssExtractPlugin(),
        new CleanWebpackPlugin(),
    ],
    devtool: prod ? false : 'source-map'
})

export default [
    config(paths[0]),
    //config(paths[1])
];