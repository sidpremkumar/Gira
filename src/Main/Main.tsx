// 3rd Party
import { Component} from 'react';
import { useLocation } from 'react-router';

// Local
import logo from '../logo.svg';
import './Main.css';

type MainProps = {
}

type MainState = { 
  domainInput: string
  errorMessage: string
  openPopup: boolean
};

class Main extends Component<MainProps, MainState> {
  constructor(props: any) {
    super(props)
    this.state = {
      domainInput: '',
      openPopup: false,
      errorMessage: ''
    };
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
          <h1>Main</h1>
        </header>
      </div>
    );
  }
}

/**
 * Helper function to load the component with the navigate prop
 */
function withHistory(props: any) {
  let state = useLocation();
  console.log(state)
  return <Main {...props} state={state} />
}

export default Main;
