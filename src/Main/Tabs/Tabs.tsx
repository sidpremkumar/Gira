// 3rd Party
import { Component} from 'react';
import { useLocation } from 'react-router';

// Local
import './Tabs.css';
import { User } from '../../../server/Schema/user.schema';

type TabProps = {
  // This is the data passed via navigation
  data :{
    user: User
  }
}

type TabState = { 

};

class Tabs extends Component<TabProps, TabState> {
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
      <div className="App">
          <h1>Tabs</h1>
          {/* <iframe src="https://commonwealthcrypto.atlassian.net" title="description"></iframe> */}
      </div>
    );
  }
}

/**
 * Helper function to load the component with the navigate prop
 */
function WithState(props: any) {
  const location = useLocation();
  return <Tabs {...props} data={location.state}/>
}

export default WithState;
