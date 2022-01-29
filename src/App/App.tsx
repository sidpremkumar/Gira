// 3rd Party
import { Component } from 'react';
import { Routes, Route } from 'react-router';

// Local
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
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/main" element={<Main />} />
      </Routes>
    );
  }
}

export default App;