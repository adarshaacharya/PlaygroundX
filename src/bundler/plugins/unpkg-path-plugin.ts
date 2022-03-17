import * as esbuild from 'esbuild-wasm';
import { UNPKG_URL } from '../../constants';


export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin', // naming for debugging
    setup(build: esbuild.PluginBuild) {
      // handle root entry file of 'index.js'
      build.onResolve({ filter: /(^index\.js)/ }, () => {
        return { path: 'index.js', namespace: 'a' };
      });

      // handle relative paths in a module
      build.onResolve({ filter: /^\.+\// }, (args: any) => {
        return {
          namespace: 'a',
          path: new URL(args.path, UNPKG_URL + args.resolveDir + '/').href,
        };
      });

      // handle main file of a module
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        return {
          namespace: 'a',
          path: `${UNPKG_URL}/${args.path}`,
        };
      });
    },
  };
};



