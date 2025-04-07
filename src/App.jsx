import React from "react";
import Game from "./components/Game";
import "./index.css";

function App() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 to-white p-4">
      <div className="max-w-screen-lg mx-auto flex flex-col items-center">
        <Game />
      </div>
    </div>
  );
}

export default App;
