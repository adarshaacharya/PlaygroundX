import MonacoEditor, {
  EditorProps,
  Monaco,
  OnMount,
} from '@monaco-editor/react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

const editorConfig: EditorProps = {
  value: '// Type your code here',
  language: 'javascript',
  height: '90vh',
  theme: 'hc-black',
  options: {
    wordWrap: 'on',
    minimap: { enabled: false },
    showUnused: false,
    folding: false,
    lineNumbersMinChars: 3,
    fontSize: 16,
    fontLigatures: true,
    fontFamily: 'Operator Mono Lig',
    scrollBeyondLastLine: false,
    bracketPairColorization: { enabled: true },
    automaticLayout: true,
  },
};

interface CodeEditorProps {
  initialValue: string;
  onChange: (value: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ onChange, initialValue }) => {
  const onEditorDidMount: OnMount = (editor, monaco) => {
    editor.onDidChangeModelContent(() => {
      onChange(editor.getValue());
    });

    editor.getModel()?.updateOptions({ tabSize: 2 });
  };

  return (
    <MonacoEditor
      onMount={onEditorDidMount}
      {...{ ...editorConfig, value: initialValue }}
    />
  );
};

export default CodeEditor;
