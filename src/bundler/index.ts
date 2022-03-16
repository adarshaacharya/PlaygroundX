import * as esbuild from 'esbuild-wasm';
import { UNPKG_URL } from '../consts';
import { fetchPlugin } from './plugins/fetch-plugin';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';

let waiting: Promise<void>;

export const setupBundler = () => {
  waiting = esbuild.initialize({
    worker: true,
    wasmURL: `${UNPKG_URL}/esbuild-wasm@0.14.23/esbuild.wasm`, // specifying version is important as it should match with package installed
  });
};

export const bundler = async (rawCode: string) => {
  await waiting;

  try {
    // tell esbuild to bundle code and put it in index.js file
    const result = await esbuild.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)], // intercepting with plugins while bulding by esbuild
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    });

    return {
      code: result.outputFiles[0].text,
      err: '',
    };
  } catch (error: any) {
    return {
      code: '',
      err: error.message,
    };
  }
};
