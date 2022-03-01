import Axios from 'axios';
import esbuild from 'esbuild-wasm';
import localforage from 'localforage';

const fileCache = localforage.createInstance({
  name: 'filecache',
});

/**
 * fetch some file
 */
export const fetchPlugin = (inputCode: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      // check if esbuild is trying to load file nameed index.js don't access from harddrive, we will take care of it
      build.onLoad({ filter: /(^index\.js)/ }, () => {
        return {
          loader: 'jsx',
          contents: inputCode,
        };
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path,
        );

        if (cachedResult) {
          return cachedResult;
        }
      });

      // Handle css file
      build.onLoad({ filter: /.css$/ }, async (args: any) => {
        const { data, request } = await Axios.get(args.path);
        const escaped = data
          .replace(/\n/g, '')
          .replace(/"/g, '\\"')
          .replace(/'/, "\\'");

        const contents = `
              const style = document.createElement('style');
              style.innerText = '${escaped}';
              document.head.appendChild(style);
          `;

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents,
          resolveDir: new URL('./', request.responseURL).pathname,
        };

        await fileCache.setItem(args.path, result);
        return result;
      });

      // Handle js code
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        // get req with the unpkg path received from onresolve
        // if not index.js is path fetch the content using axios which is the path for npm package in upkg
        const { data, request } = await Axios.get(args.path);

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname, // resolve path for next files we found eg : inside sc/
        };

        await fileCache.setItem(args.path, result);

        return result;
      });
    },
  };
};
