import { Component} from 'react';
import logo from '../logo.svg';
import './Login.css';
import { SERVER_URL } from '..';
import { LoginResponse, LoginRequest } from '../../server/login/login.messages'


class Login extends Component {
  constructor(props: any) {
    super(props)
  }

  loginButton = () => {
    console.log('Login submitted')
    // Build our request object
    const request: LoginRequest = {
      domain: 'test'
    }

    fetch(
      `${SERVER_URL}/login`,
      {
        method: 'POST',
        body: JSON.stringify(request),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(async function(response: any) {
        const responseParsed: LoginResponse = await response.json()

        console.log("Login response", responseParsed)
      }).catch(function(err: any) {
        console.log(`error: ${err}`);
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
            <button onClick={this.loginButton}>Submit</button>
        </header>
      </div>
    );
  }
 
}

export default Login;
