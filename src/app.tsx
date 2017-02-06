import * as React from 'react';
import { render } from 'react-dom';
import NodeRedView from './components/node-red-view';
import * as nodeRedIpc from './components/node-red-ipc';
import * as ipc from './helpers/ipc';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import EditIcon from 'material-ui/svg-icons/action/build';
import DashboardIcon from 'material-ui/svg-icons/notification/personal-video';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import uiTheme from './helpers/ui-theme';

import * as injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

// @if DEBUG
debugger;
// @endif

nodeRedIpc.setupNotifications();
nodeRedIpc.setupOnlineStatus();

class App extends React.Component<{ init: globalState }, { menuOpen: boolean }> {

  constructor(initial: { init: globalState }) {
    super(initial);
    this.state = {menuOpen: false};
  }

  toggleMenu = () => this.setMenuState(!this.state.menuOpen);
  setMenuState = (menuOpen:boolean) => this.setState({ menuOpen });

  showAdmin = () => this.showView(this.props.init.nodeRedAdmin);
  showDashboard = () => this.showView(this.props.init.nodeRedUI);
  
  showView = (view: string) => {
    ipc.updateState({ currentView: view });
    this.setMenuState(false);
  }
  
  render() {
    return <MuiThemeProvider muiTheme={getMuiTheme(uiTheme)}>
      <div className="stretch" >
        <Drawer
          docked={false}
          width={64}
          open={this.state.menuOpen}
          onRequestChange={(menuOpen) => this.setState({menuOpen})}
        >
          <IconButton
            iconStyle={{ width: 24, height: 24 }}
            style={{ width: 64, height: 64, padding: 16 }}
            onTouchTap={ this.showAdmin }
          >
            <EditIcon />
          </IconButton>
          <IconButton
            iconStyle={{ width: 24, height: 24 }}
            style={{ width: 64, height: 64, padding: 16 }}
            onTouchTap={ this.showDashboard }
          >
            <DashboardIcon />
          </IconButton>
        </Drawer>
        <NodeRedView
          admin={this.props.init.nodeRedAdmin}
          ui={this.props.init.nodeRedUI}
          className="stretch"
        />
      </div>
    </MuiThemeProvider>;
  }

  componentDidMount() {
    ipc.subscribeMessage('toggleMenu', this.toggleMenu);
  }

  componentWillUnmount() {
    ipc.unSubscribeMessage('toggleMenu', this.toggleMenu);
  }
}

ipc.subscribeState<globalState>(state => {
  render(
    <App init={state} />,
    document.getElementById('app')
  );
});