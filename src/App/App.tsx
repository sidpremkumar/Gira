// App.js
import * as React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "../Login/Login";
import Main from "../Main/Main";

function App() {
  return (
    <div>
      <header>
      </header>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/main" element={<Main />} />
      </Routes>
    </div>
  );
}

export default App;