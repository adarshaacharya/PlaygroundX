import React from 'react';
import CodeEditor from './components/CodeEditor';
import Preview from './components/Preview';
import { bundler, setupBundler } from './bundler';
import { editorInitialValue as initialValue } from './consts';

const App = () => {
  const [input, setInput] = React.useState(initialValue);
  const [code, setCode] = React.useState<any>();

  React.useEffect(() => {
    setupBundler();
  }, []);

  const onClick = async () => {
    const result = await bundler(input);
    setCode(result);
  };

  return (
    <div>
      <CodeEditor
        initialValue={initialValue}
        onChange={(value) => setInput(value)}
      />
      <div>
        <button onClick={onClick}>Submit</button>
      </div>

      <Preview code={code} />
    </div>
  );
};

export default App;
