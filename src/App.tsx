import React from 'react';
import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';

function App() {
  const ref = React.useRef<any>();
  const iframe = React.useRef<any>();
  const [input, setInput] = React.useState('');

  const startService = async () => {
    await esbuild.initialize({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm/esbuild.wasm',
    });

    ref.current = true;
  };

  React.useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    if (!ref.current) {
      return;
    }

    // on every submit recreate content of iframe and put html
    iframe.current.srcdoc = html;

    // tell esbuild to bundle code and put it in index.js file
    const result = await esbuild.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)], // intercepting with plugins while bulding by esbuild
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    });

    // whenever bundling happends on parent , it passes the msg to the child iframe
    iframe.current.contentWindow.postMessage(result.outputFiles[0].text, '*');
  };

  const html = `
    <html>
        <head></head>
        <body> 
        <div id="root"></div>
          <script> 
          // receive bundled code from parent
            window.addEventListener('message', (event) => {
              try {
                eval(event.data);
              } catch(err) {
                const root = document.querySelector('#root');
                root.innerHTML = '<div style="color : red;"><h4>Runtime Error</h4>' + err + '</div>';
                console.error(err);
              }
            }, false)
          </script>
        </body>
    </html>
  `;

  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={10}
        cols={20}
      ></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <iframe
        ref={iframe}
        sandbox="allow-scripts"
        srcDoc={html}
        title="Preview window"
      />
    </div>
  );
}

export default App;
