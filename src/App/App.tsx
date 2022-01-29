// 3rd Party
import { Component } from 'react';
import { Routes, Route } from 'react-router';
import { useNavigate, NavigateFunction } from 'react-router';

// Local
import Login from "../Login/Login";
import Main from "../Main/Main";
import { SERVER_URL } from '..';
import { LoginResponse } from '../../server/login/login.messages';
import { MainIncomingState } from '../Main/Main.types';



class App extends Component {
  constructor(props: any) {
    super(props)
    
    const componentObject: any = this;

    // If the user is already logged in, just route them to main with the domain info
    fetch(
      `${SERVER_URL}/check-login`,
      {
        method: 'POST',
        body: JSON.stringify({}),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(async function(response: any) {
        const responseParsed: LoginResponse = await response.json()

        // If the request was not valid, the user needs to log in again
        if (responseParsed.valid === false) {
          return
        }

        // Move the user to the main screen
        console.log('User has already logged in, moving to main page');
        const incomingState: MainIncomingState = {
          'user': responseParsed.user
        }
        componentObject.props.navigate('/main', {'state': incomingState});
      }).catch(function(err: any) {
        console.log(`error: ${err}`);
      });
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

/**
 * Helper function to load the component with the navigate prop
 */
 function WithNavigation(props: any) {
  let navigate: NavigateFunction = useNavigate();
  return <App {...props} navigate={navigate} />
}

export default WithNavigation;