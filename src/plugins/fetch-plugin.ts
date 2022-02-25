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
      // while loading index.js file from harddrive by esbuild Load paths tagged with the "a" namespace
      // load the index.js files , override esbuild natural process of loading the file, finds if there are any import statement if found where the req file is, and load it
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        // #1. check if elsebuild is trying to load file nameed index.js don't access from harddrive, we will take care of it
        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: inputCode,
          };
        }

        // check to see if we have already fetched this file and if it is in the cache
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path,
        );

        // if it is, return it immediately
        if (cachedResult) {
          return cachedResult;
        }

        // #4 get req with the unpkg path received from onresolve
        // if not index.js is path fetch the content using axios which is the path for npm package in upkg
        const { data, request } = await Axios.get(args.path);

        const loader = args.path.match(/.css$/) ? 'css' : 'jsx'

        const result: esbuild.OnLoadResult = {
          loader,
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname, // resolve path for next files we found eg : inside sc/
        };

        await fileCache.setItem(args.path, result);

        return result;
      });
    },
  };
};
