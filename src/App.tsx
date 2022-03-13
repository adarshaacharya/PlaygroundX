import React from 'react';
import CodeEditor from './components/CodeEditor';
import Preview from './components/Preview';
import { bundler, setupBundler } from './bundler';
import { editorInitialValue as initialValue } from './consts';
import Resizable from './components/Resizable';
import './index.css';

const App = () => {
  const [input, setInput] = React.useState(initialValue);
  const [code, setCode] = React.useState<any>();

  const intializeBundler = async () => {
    await setupBundler();
  };

  React.useEffect(() => {
    intializeBundler();
  }, []);

  const onClick = async () => {
    const result = await bundler(input);
    setCode(result);
  };

  return (
    <div className="app">
      <Resizable direction="horizontal">
        <CodeEditor
          initialValue={initialValue}
          onChange={(value) => setInput(value)}
        />
      </Resizable>

      <button onClick={onClick}> Run code</button>
      <Preview code={code} />
    </div>
  );
};

export default App;
