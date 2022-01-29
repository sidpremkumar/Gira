import React from 'react';
import logo from '../logo.svg';
import './Login.css';
import Main from "../Main/Main";

function Login() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Welcome</h1>
        <form id="creds" action="/main">
            <h3>Enter your Jira domain name: </h3>
            <input type="text" id="jiradomain" placeholder="https://test.atlassian.net/"/>
            <button>Submit</button>
        </form>
      </header>
    </div>
  );
}

export default Login;
