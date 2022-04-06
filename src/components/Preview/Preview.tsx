import React from 'react';

const html = `
<html>
    <head></head>
    <body> 
    <div id="root"></div>
      <script> 
        const handleError = (err) => {
          const root = document.querySelector('#root');
          root.innerHTML = '<div style="color : red;"><h4>Runtime Error</h4>' + err + '</div>';
          console.error(err); 
        }

        // handle async aka catch block uncaught error
        window.addEventListener('error', (event) => {
          event.preventDefault();
          handleError(event.error)
        })

      // receive bundled code from parent document
        window.addEventListener('message', (event) => {
          try {
            eval(event.data);
          } catch(err) {
            handleError(err)
          }
        }, false)
      </script>
    </body>
</html>
`;

interface PreviewProps {
  code?: string;
  error: string;
}

const Preview: React.FC<PreviewProps> = ({ code, error }) => {
  const iframe = React.useRef<any>();

  React.useEffect(() => {
    // on every submit recreate content of iframe and put html
    iframe.current.srcdoc = html;

    // whenever bundling happends on code , pass the data to iframe
    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, '*');
    }, 50);
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe
        ref={iframe}
        sandbox="allow-scripts"
        srcDoc={html}
        title="Preview"
      />
      {error && <p className="preview-error">{error}</p>}
    </div>
  );
};

export default Preview;
