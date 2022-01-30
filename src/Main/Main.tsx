// 3rd Party
import { Component} from 'react';
import { useLocation } from 'react-router';

// Local
import './Main.css';
import { User } from '../../server/Schema/user.schema';
import Tabs from './Tabs/Tabs'
import Sidebar from './Sidebar/Sidebar'

type MainProps = {
  // This is the data passed via navigation
  data :{
    user: User
  }
}

type MainState = { 

};

class Main extends Component<MainProps, MainState> {
  private user: User; 
  constructor(props: any) {
    super(props)
    this.user = this.props.data.user; 
  }

  /**
   * Our function to render the page
   * @returns Html render of the page
   */
  render() {
    return (
      <div className="row">
        <Sidebar />
        <Tabs />
      </div>
    );
  }
}

/**
 * Helper function to load the component with the navigate prop
 */
function WithState(props: any) {
  const location = useLocation();
  return <Main {...props} data={location.state}/>
}

export default WithState;
