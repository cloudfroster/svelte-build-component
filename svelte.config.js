// svelte options exported for svelte-vscode

const {
    preprocess: makeTsPreprocess,
    createEnv,
    readConfigFile,
} = require("@pyoner/svelte-ts-preprocess");
const less = require('less');

const env = createEnv();
const compilerOptions = readConfigFile(env);
const preprocessOptions = {
    env,
    compilerOptions: {
        ...compilerOptions,
        allowNonTsExtensions: true,
    },
};

module.exports = {
    dev: !(['development', 'dev'].includes(process.env.NODE_ENV)),
    preprocess:{
        ...makeTsPreprocess(preprocessOptions),
        postcss: {
            plugins: [require('autoprefixer')()]
        },
        // svelte 内部 style 可以引入 less
		style: async ({ content, attributes, filename }) => {
            if(!(attributes.type === 'text/less' || attributes.lang === 'less' )) {
                return;
            }
            try {
                const { css, map, imports } = await less.render(content, {
                    sourceMap: {sourceMapFileInline: true},
                    filename
                });
                return {
                    code: css.toString('utf8'),
                    map: map.toString('utf8'),
                    dependencies: imports
                }
            } catch (e) {
                return e;
            }
		}
    },
};
