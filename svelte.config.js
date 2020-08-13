// svelte.config.js - NOTE: you cannot use the new "import x from y" and "export const" syntax in here.
const sveltePreprocess = require('svelte-preprocess');

module.exports = {
    preprocess: sveltePreprocess({
        babel: {
            presets: [
                [
                    "@babel/preset-env",
                    {
                        loose: true,
                        modules: false,
                        targets: {
                            esmodules: true
                        }
                    }
                ],
            ]
        }
    })
    // ...other svelte options
};