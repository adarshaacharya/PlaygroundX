import React from 'react';

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

interface PreviewProps {
  code: string;
}

const Preview: React.FC<PreviewProps> = ({ code }) => {
  const iframe = React.useRef<any>();

  React.useEffect(() => {
    // on every submit recreate content of iframe and put html
    iframe.current.srcdoc = html;

    // whenever bundling happends on parent , it passes the msg to the child iframe
    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, '*');
    }, 50);
  }, [code]);

  return (
    <iframe
      ref={iframe}
      sandbox="allow-scripts"
      srcDoc={html}
      title="Preview"
    />
  );
};

export default Preview;
