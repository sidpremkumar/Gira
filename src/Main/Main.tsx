import React from 'react';
import logo from '../logo.svg';
import './Main.css';

function Main() {
  /**
   * Our function to render the page
   * @returns Html render of the page
   */
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Main</h1>
      </header>
    </div>
  );
}

export default Main;
