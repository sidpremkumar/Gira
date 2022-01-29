// App.js
import { Component } from 'react';
import { Routes, Route, Link } from "react-router-dom";
import Login from "../Login/Login";
import Main from "../Main/Main";

class App extends Component {
  constructor(props: any) {
    super(props)
  }

  /**
   * Our function to render the page
   * @returns Html render of the page
   */
  render () {
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
}

export default App;