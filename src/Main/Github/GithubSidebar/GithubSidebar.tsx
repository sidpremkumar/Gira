// 3rd Party
import { Component} from 'react';
import { useLocation } from 'react-router';
import { NavLink } from 'react-router-dom';

// Local
import { User } from '../../../../server/Schema/user.schema';
import { 
  Sidebar,
  ProjectInfo,
  ProjectTexts,
  ProjectName,
  ProjectCategory,
  Divider, 
  LinkItem,
  LinkText,
  NotImplemented
} from './GithubSidebar.scripts'
import Icon from '../../../shared/components/Icon/Icon';

type GithubSidebarProps = {
  // This is the data passed via navigation
  data :{
    user: User
  }
}

type GithubSidebarState = { 

};

class GithubSidebar extends Component<GithubSidebarProps, GithubSidebarState> {
  private user: User; 
  constructor(props: any) {
    super(props)
    this.user = this.props.data.user; 
  }

  // private renderLinkItem(match: any, text: string, iconType: string, path:string ) {
  //     const isImplemented = !!path;
    
  //     const linkItemProps = isImplemented
  //       ? { as: NavLink, exact: true, to: `${match.path}${path}` }
  //       : { as: 'div' };
    
  //     return (
  //       <LinkItem {...linkItemProps}>
  //         <Icon type={iconType} />
  //         <LinkText>{text}</LinkText>
  //         {!isImplemented && <NotImplemented>Not implemented</NotImplemented>}
  //       </LinkItem>
  //     );
  // }

  /**
   * Our function to render the page
   * @returns Html render of the page
   */
  render() {
    // const match = useRouteMatch();
    
    return (
      <Sidebar>
        <ProjectInfo>
          {/* <ProjectAvatar /> */}
          <ProjectTexts>
            <ProjectName>Project name</ProjectName>
            <ProjectCategory>Some catagory</ProjectCategory>
          </ProjectTexts>
        </ProjectInfo>
  
        {/* {this.renderLinkItem(match, 'Kanban Board', 'board', '/board')} */}
        {/* {this.renderLinkItem(match, 'Project settings', 'settings', '/settings')} */}
        <Divider />
        {/* {this.renderLinkItem(match, 'Releases', 'shipping')}
        {this.renderLinkItem(match, 'Issues and filters', 'issues')}
        {this.renderLinkItem(match, 'Pages', 'page')}
        {renderLinkItem(match, 'Reports', 'reports')}
        {renderLinkItem(match, 'Components', 'component')} */}
      </Sidebar>
    );
  }
}

/**
 * Helper function to load the component with the navigate prop
 */
function WithState(props: any) {
  const location = useLocation();
  return <GithubSidebar {...props} data={location.state}/>
}

export default WithState;
