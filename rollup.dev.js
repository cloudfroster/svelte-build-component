/**
 * @description: 开发环境 wistle 配置增加：
 * h5.oceanengine.com/ultra-app  http://127.0.0.1:8989 的代理即可
 * @author: chenlu.leila
 * @email: chenlu.leila@bytedance.com
 *
 * @created: 2020-03-01 16:13:01
 */
import beep from '@rollup/plugin-beep';
import html from "@rollup/plugin-html";
import json from '@rollup/plugin-json';
import multiInput from '@rollup/plugin-multi-entry';
import resolve from "@rollup/plugin-node-resolve";
import replace from '@rollup/plugin-replace';
import typescript from "@wessberg/rollup-plugin-ts";
import commonjs from "rollup-plugin-commonjs";
import copy from 'rollup-plugin-copy';
import css from 'rollup-plugin-css-chunks';
import del from 'rollup-plugin-delete';
import bundleTree from 'rollup-plugin-extract-bundle-tree';
import importAssets from 'rollup-plugin-import-assets';
import livereload from "rollup-plugin-livereload";
import serve from 'rollup-plugin-serve';
import svelte from "rollup-plugin-svelte";
import { terser } from "rollup-plugin-terser";
import tscompile from 'typescript';
import { htmlGenerator } from './utils/handlebar';


const svelteOptions = require("./svelte.config");
const production = (!process.env.ROLLUP_WATCH) || (['prod', 'production'].includes(process.env.NODE_ENV));
const publicStaticPath = production
                        ? 'https://s3.pstatp.com/bytecom/resource/ultra-app/'
                        : 'http://www.chengzijianzhan.com/ultra-app/';

const app = process.env.APP ||  'light';
const outputDir = '.svelte-dev';

export default [
    {
        input: {
            include: [`src/index.ts`]
        },
        output: {
            dir: `${outputDir}/${app}/client`,
            sourcemap: !production,
            format: 'esm',
            publicPath: publicStaticPath,
            chunkFileNames: '[name].chunk.js',
            entryFileNames: '[name].js'
        },
        plugins: [
            beep(),
            json(),
            del({
                targets: `${outputDir}/${app}/client`
            }),
            copy({
                targets: [
                    { src: 'public/jsbridge.mock.js', dest: `${outputDir}/${app}/client` },
                ]
            }),
            multiInput(),
            svelte({
                ...svelteOptions,
                hydratable: true,
                dev: !production
            }),
            // we'll extract any component CSS out into
            // a separate file — better for performance
            css({
                sourcemap: !production,
                chunkFileNames: '[name].chunk.css',
                entryFileNames: '[name].css'
            }),
            importAssets({
                fileNames: '[hash].[ext]',
                publicPath: publicStaticPath,
            }),
            // If you have external dependencies installed from
            // npm, you'll most likely need these plugins. In
            // some cases you'll need additional configuration —
            // consult the documentation for details:
            // https://github.com/rollup/rollup-plugin-commonjs
            resolve({
                browser: true,
                dedupe: importee =>
                    importee === "svelte" || importee.startsWith("svelte/")
            }),
            commonjs(),
            typescript({
                typescript: tscompile,
                // objectHashIgnoreUnknownHack: true
            }),
            bundleTree({
                file: `${outputDir}/${app}/client-tree.json`
            }),

            serve({
                open: true,
                openPage: '/pure.html',
                historyApiFallback: '/pure.html',
                contentBase: [`${outputDir}/${app}/client`, 'static'],
                host: 'localhost',
                port: 8989,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            }),
            html({
                fileName: 'pure.html',
                title: '轻落地页',
                // publicPath: publicStaticPath,
                template: htmlGenerator('pure')
            }),

            // Watch the `public` directory and refresh the
            // browser on changes when not in production
            !production && livereload({
                watch: outputDir,
                // clientUrl: publicStaticPath
            }),

            // If we're building for production (npm run build
            // instead of npm run dev), minify
        ],
        watch: {
            clearScreen: false
        }
    },
    {
        input: [`src/apps/${app}/main.server.ts`],
        output: {
            dir: `${outputDir}/${app}/server`,
            format: 'cjs',
        },
        plugins: [
            del({
                targets: `${outputDir}/${app}/server/*`
            }),
            json(),
            replace({
                'process.env.NODE_ENV': 'development'
            }),
            multiInput(),
            svelte({
                ...svelteOptions,
                dev: !production,
                immutable: true,
                hydratable: true,
                generate: 'ssr',
            }),
            resolve({
                dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/')
            }),
            commonjs(),
            typescript({
                typescript: tscompile
            }),
            css({
                ignore: true
            }),
            importAssets({
                fileNames: '[hash].[ext]',
                publicPath: publicStaticPath,
                emitAssets: false,
            }),
            production && terser()
        ]
    }
];
