import React, { useRef } from 'react';
import MonacoEditor, { EditorProps, OnMount } from '@monaco-editor/react';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';
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
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();

  const onEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
    editor.onDidChangeModelContent(() => {
      onChange(editor.getValue());
    });

    editor.getModel()?.updateOptions({ tabSize: 2 });
  };

  const onFormatClick = () => {
    const unFormatted = editorRef.current?.getModel()?.getValue();

    if (unFormatted) {
      const formatted = prettier
        .format(unFormatted, {
          parser: 'babel',
          plugins: [parser],
          useTabs: false,
          semi: true,
          singleQuote: true,
        })
        .replace(/\n$/, '');

      editorRef.current?.setValue(formatted);
    }
  };

  return (
    <div className="editor-wrapper">
      <button className="btn btn-format" onClick={onFormatClick}>
        Format Code
      </button>
      <MonacoEditor
        onMount={onEditorDidMount}
        {...{ ...editorConfig, value: initialValue }}
      />
    </div>
  );
};

export default CodeEditor;
