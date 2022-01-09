import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";

import path from "path";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const demoFilepath = "./demo-scans/2021.09.18.json.gz";

export default defineConfig({
  plugins: [
    vue(),
  ],
  server: {
    open: `/?filepath=${demoFilepath}`
  },
  base: "./",
  build: {
    target: "es2018",
    cssCodeSplit: false,
    sourcemap: true,
    rollupOptions: {
      plugins: [
        sourceMapsPathChangerPlugin([
          // Use "../../" instead of "../" if resources are in "assets/" directory
          ["../node_modules/", "node-modules:///"],
          ["../vite/", "node-modules:///vite/"],
          ["../src/", "source-maps:///"],
          ["../", "source-maps:///"],
        ]),
        cssBundlePlugin({
          overwriteBundle: "style.css",
          importFromModule: true
        }),
      ],
      output: {
        entryFileNames: `[name].js`, // `[name].[format].js`
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`
      }
    },
    terserOptions: {
      // compress: false, // compress may broke source maps, but it looks working ok currently
      mangle: {
        keep_classnames: true,
        keep_fnames: true,
      }
    }
  }
});

function sourceMapsPathChangerPlugin(pathsMapping = []) {
  function changeSourceMapPaths(map) {
    function _beautify(str) {
      return pathsMapping.reduce((pre, [value, replacer]) => {
        return pre.replace(value, replacer)
      }, str);
    }
    for (let i = 0; i < map.sources.length; i++) {
      map.sources[i] = _beautify(map.sources[i]);
    }
    return map;
  }
  return {
    name: "source-maps-path-changer-plugin",
    async generateBundle(options, bundle, isWrite) {
      Object.keys(bundle).forEach(key => {
        const map = bundle[key]?.map;
        if (map) {
          bundle[key].map = changeSourceMapPaths(map);
        }
      });
    }
  }
}


/**
 * NOTE: Works only in module project [!] Since it uses `import()`
 *
 * NOTES FOR VITE.JS:
 * - `removeCode` works only if it is used as Vite plugin;
 * - `overwriteBundle` works only if it is used as Rollup plugin (and `removeCode` is not used, of course);
 *
 * @param options
 * @param options.callback - function to handle the result CSS bundle. Use to write CSS to disk, ot just for debug.
 * @param options.overwriteBundle - the name of CSS bundle that Rollup.js (Vite.js) writes to disk,
 * for example: "index.css" even if the real file name will be: "assets/index.e2206225.css".
 * @param options.importFromModule - set to `true` to get CSS from module that exports it, or `false` if it is a pure CSS code.
 * @param options.removeCode - remove code after `transform` hook. Use it if you do not use `overwriteBundle` option.
 */
function cssBundlePlugin({callback, overwriteBundle, importFromModule, removeCode} = {}) {
  const btoa = str => Buffer.from(str, "binary").toString("base64");
//const atob = b64 => Buffer.from(b64, "base64").toString("binary");

  const entries = [];
  async function resultCssBundle() {
    const results = [];
    entries.sort((a, b) => a.id.localeCompare(b.id));
    for (const {code, id} of entries) {
      // C:\Projects\formatted-number\components\Main.vue?vue&type=style&index=0&id=f889b9d8&scoped=true&lang.css
      const filenameWithQueryParams = id.match(/[^\\\/]+$/)[0];    // Main.vue?vue&type=style&index=0&id=f889b9d8&scoped=true&lang.css
      const filename = filenameWithQueryParams.match(/^[^?]+/)[0]; // Main.vue

      let css;
      if (importFromModule) {
        try {
          // import styleInject from 'C:/Projects...
          // styleInject(css_248z);
          const importIndex = code.indexOf("import styleInject");
          const trimStart = importIndex === -1 ? code.length : importIndex;
          const trimmedCode = code.substring(0, trimStart);

          const base64Code = "data:text/javascript;base64," + btoa(trimmedCode);
          css = (await import(base64Code)).default;
        } catch (e) {
          console.warn("[cssBundlePlugin]: Failed to load CSS as a module. Returns as pure code. Use `importFromModule: false`");
          css = code;
        }
      } else {
        css = code;
      }

      const indexOfSourceMap = css.indexOf("/*# sourceMappingURL");
      const to = indexOfSourceMap === -1 ? css.length : indexOfSourceMap;
      const from = css.charAt(0) === "\n" ? 1 : 0;
      if (css.trim()) {
        const result = "/* " + filename + " */\n" + css.substring(from, to);
        results.push(result);
      }
    }
    return results.join("\n");
  }

  return {
    name: "css-bundle-plugin",
    transform(code, id) {
      const isCss = [".css", ".sass", ".scss", ".less", ".stylus"].some(ext => id.endsWith(ext));
      if (isCss) {
        entries.push({code, id});
        if (removeCode) {
          return {code: "", map: {mappings: ""}};
        }
      }
    },
    async generateBundle(opts, bundles, isWrite) {
      const bunchCss = await resultCssBundle();
      if (isWrite && overwriteBundle) {
        const bundle = Object.values(bundles).find(bundle => bundle.name === overwriteBundle);
        if (bundle) {
          bundle.source = bunchCss;
        } else {
          console.warn(`[cssBundlePlugin]: "overwriteBundle" bundle is not found. Available bundles:`, Object.values(bundles).map(bundle => bundle.name));
        }
      }
      if (typeof callback === "function") {
        callback(bunchCss);
      }
    }
  }
}
