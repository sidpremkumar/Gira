import { Component} from 'react';
import logo from '../logo.svg';
import './Login.css';
import Main from "../Main/Main";


class Login extends Component {
  constructor(props: any) {
    super(props)
  }

  submitForm = () => {
    console.log("HERE?")
    fetch("http://localhost:3000/test")
      .then(function(response) {
        console.log("It worked, response is: ", response.json())
      }).catch(function() {
        console.log("error");
      });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>Welcome</h1>
            <h3>Enter your Jira domain name: </h3>
            <input type="text" id="jiradomain" placeholder="https://test.atlassian.net/"/>
            <button onClick={this.submitForm}>Submit</button>
        </header>
      </div>
    );
  }
 
}

export default Login;
