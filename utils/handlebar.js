/**
 * @description:
 * @author: chenlu.leila
 * @email: chenlu.leila@bytedance.com
 *
 * @created: 2020-02-19 20:39:21
 */
import { makeHtmlAttributes } from "@rollup/plugin-html";
import { readFileSync } from 'fs';
import globby from 'globby';
import path from 'path';
import urlJoin from 'url-join';


export const htmlGenerator = (template)=> {
    const TEMPLATES_RENDERERS = globby.sync(['public/*.html']).reduce((acc, file)=> {
        const fileStr = readFileSync(file, 'utf8');
        acc[path.basename(file, path.extname(file))] = fileStr;
        return acc;
    }, {});

    return ({ attributes, bundle, files, publicPath, title })=> {
        let target = TEMPLATES_RENDERERS[template];
        const links = (files.css || []).map(({fileName})=> {
            const attrs = makeHtmlAttributes(attributes.link);
            return `<link href='${urlJoin(publicPath,fileName)}' rel="stylesheet" ${attrs}>`;
        });

        const scripts = (files.js || []).map(({fileName})=> {
            const attrs = makeHtmlAttributes(attributes.script);
            return `<script src="${urlJoin(publicPath,fileName)}" crossorigin="anonymous" ${attrs}></script>`;
        });

        target = target.replace('<!-- CSR-SCRIPTS -->', scripts.join('\n'))
                       .replace('<!-- CSR-LINKS -->', links.join('\n'));
        return target;
    }
}
