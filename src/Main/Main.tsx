// 3rd Party
import { Component} from 'react';
import { Route, Routes, useLocation } from 'react-router';

// Local
import './Main.scripts.tsx';
import { User } from '../../server/Schema/user.schema';
import GithubSidebar from './Github/GithubSidebar/GithubSidebar'
import Sidebar from './Sidebar/Sidebar'
import { ProjectPage } from './Main.scripts'

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
      <ProjectPage>
        <Sidebar />
        {/* Depending on what page we are on, we need to open different pages
        <Routes>
          <Route
          path='/main/github/*'
          element = {
            
          }/>
        </Routes> */}
        <GithubSidebar
              // project={project}
              // fetchProject={fetchProject}
              // updateLocalProjectIssues={updateLocalProjectIssues}
          />
      </ProjectPage>
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
