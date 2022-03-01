Esbuild : esbuild-wasm

Transform Api :
https://esbuild.github.io/api/#transform-api

load esbuild.wasm file in browser in some way, to do the transpiling

transform function : just to do transpiling no for bundling
build : to bundle

```
npm view react dist.tarball
```

// first on lead then only on resolve

Problems : 
- Transform/Transpile
- Build / Bundle Code
- Fetch the npm package w/o file system
- Caching the fetching process from unpkgLoading CSS support for bundler



Error Handling Problems :
- Handle syntax error
- mutate the dom
- User might accidently run mailicous code


- Disallow communication between parent and child iframe
- Codepen, codesandbox load iframe from different domain (check using devtools)
- Refresh iframe everytime we type code so that it refresh all global vairable



/**
 * NOTE : 
 * bundling = build = finding some file, loading it, transpiling it, joining bunch of diff file together
 */