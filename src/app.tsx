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

class App extends React.Component<{ init: globalState }, { open: boolean }> {

  constructor(initial: { init: globalState }) {
    super(initial);
    this.state = {open: false};
  }

  handleToggle = () => this.setState({open: !this.state.open});
  handleClose = () => this.setState({ open: false });

  handleEdit = () => ipc.updateState({ currentView: this.props.init.nodeRedAdmin });
  handleDashboard = () => ipc.updateState({ currentView: this.props.init.nodeRedUI });
  
  render() {
    return <MuiThemeProvider muiTheme={getMuiTheme(uiTheme)}>
      <div className="stretch" >
        <Drawer
          docked={false}
          width={64}
          open={this.state.open}
          onRequestChange={(open) => this.setState({open})}
        >
          <IconButton
            iconStyle={{ width: 24, height: 24 }}
            style={{ width: 64, height: 64, padding: 16 }}
            onTouchTap={ this.handleEdit }
          >
            <EditIcon />
          </IconButton>
          <IconButton
            iconStyle={{ width: 24, height: 24 }}
            style={{ width: 64, height: 64, padding: 16 }}
            onTouchTap={ this.handleEdit }
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
    ipc.subscribeMessage('toggleMenu', this.handleToggle);
  }

  componentWillUnmount() {
    ipc.unSubscribeMessage('toggleMenu', this.handleToggle);
  }
}

ipc.subscribeState<globalState>(state => {
  render(
    <App init={state} />,
    document.getElementById('app')
  );
});