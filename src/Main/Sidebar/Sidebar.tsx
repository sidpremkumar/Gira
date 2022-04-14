// 3rd Party
import { Component} from 'react';
import { useLocation } from 'react-router';

// Local
import { User } from '../../../server/Schema/user.schema';
import { NavLeft, LogoLink, StyledLogo, Bottom, Item, ItemText } from './Sidebar.scripts';
import AboutTooltip from '../../shared/components/AboutTooltip/AboutToolTip'
import Icon from '../../shared/components/Icon/Icon'

type SideProps = {
  // This is the data passed via navigation
  data :{
    user: User
  }
}

type SideState = { 

};

class Sidebar extends Component<SideProps, SideState> {
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
      <NavLeft>
      <LogoLink to="/main">
        <StyledLogo />
      </LogoLink>
  
      <Item >
        <Icon type="board" size={22} top={1} left={3} />
        <ItemText>Jira</ItemText>
      </Item>
      
      {/* <Item onClick={issueCreateModalOpen}> */}
      <Item>
        <Icon type="github" size={27} />
        <ItemText>Github</ItemText>
      </Item>

      <Bottom>
        <AboutTooltip
          placement="right"
          offset={{ top: -218 }}
          renderLink={(linkProps: any) => (
            <Item {...linkProps}>
              <Icon type="help" size={25} />
              <ItemText>About</ItemText>
            </Item>
          )}
        />
      </Bottom>
    </NavLeft>
    );
  }
}

/**
 * Helper function to load the component with the navigate prop
 */
function WithState(props: any) {
  const location = useLocation();
  return <Sidebar {...props} data={location.state}/>
}

export default WithState;
