import * as esbuild from 'esbuild-wasm';
import axios from 'axios';

const UNPKG_URL = 'https://unpkg.com';

export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin', // naming for debugging
    setup(build: esbuild.PluginBuild) {
      // Intercept import paths called "unpkg-path-plugin" so esbuild doesn't attempt
      // to map them to a file system location. Tag them with the "a"
      // namespace to reserve them for this plugin.
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log('onResolve', args);
        // #2.
        if (args.path === 'index.js') {
          return { path: args.path, namespace: 'a' };
        }

        if (args.path.includes('./') || args.path.includes('../')) {
          return {
            namespace: 'a',
            path: new URL(args.path, UNPKG_URL + args.resolveDir + '/').href, // unkpkg.com,/test-package
          };
        }

        // #3. after getting package name from index.js
        return {
          namespace: 'a', // apply only to those file which has namespace 'a'
          path: `${UNPKG_URL}/${args.path}`,
        };
      });

      // Load paths tagged with the "a" namespace
      // load the index.js files , override esbuild natural process of loading the file, finds if there are any import statement if found where the req file is, and load it
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log('onLoad', args);

        // #1. hardcoding contents of index.js
        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: `
              import React from 'react'
              console.log(React);
            `,
          };
        }

        // #4 get req with the unpkg path received from onresolve
        // if not index.js is path fetch the content using axios which is the path for npm package in upkg
        const { data, request } = await axios.get(args.path);
        return {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname, // resolve path for next files we found eg : inside sc/
        };
      });
    },
  };
};

/**
 * bundling = build = finding some file, loading it, transpiling it, joining bunch of diff file together
 */

// 072- tells how onresolve flow
