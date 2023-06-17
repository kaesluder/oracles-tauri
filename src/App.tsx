import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import { BaseDirectory, readDir } from '@tauri-apps/api/fs';
import { resourceDir } from '@tauri-apps/api/path';
import { listPlugins, loadPluginMeta, loadAllPluginMeta } from "./helpers/Plugin";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [test, setTest] = useState("foo");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  async function fsTest() {

    const entries = await readDir('test/plugins', { dir: BaseDirectory.Resource, recursive: false });
    console.log(entries);
  }

  const listAllPlugins = async function () { 
    const plugins = await listPlugins('resources/plugins', BaseDirectory.Resource)
    setTest(plugins[0].name || "")
    const testMeta = await(loadAllPluginMeta(plugins))
    console.log(plugins)
    console.log(testMeta)
    console.log(testMeta[0].title)

  }

  listAllPlugins();
  

  return (
    <div className="container">
      <h1>Welcome to Tauri!</h1>

      <div className="row">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          // greet();
          fsTest();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>

      <p>{greetMsg}</p>

      <p>{test}</p>
    </div>
  );
}

export default App;
