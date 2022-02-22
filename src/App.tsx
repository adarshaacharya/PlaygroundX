import React from "react";
import * as esbuild from "esbuild-wasm";

function App() {
  const ref = React.useRef<any>();
  const [input, setInput] = React.useState("");
  const [code, setCode] = React.useState("");

  const startService = async () => {
    await esbuild.initialize({
      worker: true,
      wasmURL: "/esbuild.wasm",
    });

    ref.current = true;
  };

  React.useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    // if we don't have service don't do anything
    if (!ref.current) {
      return;
    }

    const result = await esbuild.transform(input, {
      loader: "jsx",
      target: "es2015",
    });

    setCode(result.code);
  };

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
      <pre>{code}</pre>
    </div>
  );
}

export default App;
