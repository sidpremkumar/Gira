// 3rd Party
import { Component} from 'react';
import Popup from 'reactjs-popup';
import { useNavigate, NavigateFunction } from 'react-router';

// Local
import logo from '../logo.svg';
import './Login.css';
import { SERVER_URL } from '..';
import { LoginResponse, LoginRequest } from '../../server/login/login.messages'
import { MainIncomingState } from '../Main/Main.types';

type LoginProps = {
  navigate: NavigateFunction
}

type LoginState = { 
  domainInput: string
  errorMessage: string
  openPopup: boolean
};

class Login extends Component<LoginProps, LoginState> {
  constructor(props: any) {
    super(props)
    this.alertUser = this.alertUser.bind(this);
    this.loginButton = this.loginButton.bind(this);
    this.state = {
      domainInput: '',
      openPopup: false,
      errorMessage: ''
    };
  }

  /**
   * Helper function to bubble an alert up to the user
   * @param alert Alert to bubble up to the user
   */
  alertUser = (alert: string) => {
    let state: LoginState = this.state;
    state.openPopup = true;
    state.errorMessage = alert;
    this.setState(state);
  }

  /**
   * Helper function to close the popup 
   */
  closeAlert = () => {
    let state: LoginState = this.state;
    state.openPopup = false;
    this.setState(state);
  }

  /**
   * Login button function to be called when the login button is clicked
   */
  loginButton(): void {
    console.log(`Login submitted for domain: ${this.state.domainInput}`)

    if (this.state.domainInput === '') {
      this.alertUser('Please make sure to enter a valid for domain')
      return
    }

    // Build our request object
    const request: LoginRequest = {
      domain: this.state.domainInput
    }

    const componentObject: any = this;

    // Ask our server if the login request is okay
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

        // If the request was not valid, then show the user the error message
        if (responseParsed.valid === false) {
          componentObject.alertUser(responseParsed.errorMessage)
          return
        }

        // Move the user to the main screen
        console.log('Login succeed moving to main page');
        const incomingState: MainIncomingState = {
          'user': responseParsed.user
        }
        componentObject.props.navigate('/main', incomingState);
      }).catch(function(err: any) {
        console.log(`error: ${err}`);
      });
  }

  /**
   * Updates the domain input state as the value changes
   * @param evt Event being emitted
   */
  updateDomainInput(evt: any) {
    this.setState({
      domainInput: evt.target.value
    });
  }

  /**
   * Our function to render the page
   * @returns Html render of the page
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>Welcome</h1>
            <h3>Enter your Jira domain name: </h3>
            <input type="text" value={this.state.domainInput} onChange={evt => this.updateDomainInput(evt)} placeholder="https://test.atlassian.net/"/>
            <button onClick={this.loginButton}>Submit</button>

            <Popup
              open={this.state.openPopup}
              onClose={this.closeAlert}
              modal
              nested
            >
              {(close: any) => (
                <div className="modal">
                  <button className="close" onClick={close}>
                    &times;
                  </button>
                  <div className="header"> Uh Oh! </div>
                  <div className="content">
                    {this.state.errorMessage}
                  </div>
                </div>
              )}
            </Popup>
        </header>
      </div>
    );
  }
 
}

/**
 * Helper function to load the component with the navigate prop
 */
function WithNavigation(props: any) {
  let navigate: NavigateFunction = useNavigate();
  return <Login {...props} navigate={navigate} />
}

export default WithNavigation;
