// 3rd Party
import { Component} from 'react';
import { useLocation } from 'react-router';

// Local
import logo from '../logo.svg';
import './Main.css';
import { User } from '../../server/Schema/user.schema';

type MainProps = {
}

type MainState = { 
  user: User
};

class Main extends Component<MainProps, MainState> {
  constructor(props: any) {
    super(props)
    this.state = {
      user: null
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
function withState(props: any) {
  const location = useLocation();
  return <Main {...props} data={location.state}/>
}

export default withState;
