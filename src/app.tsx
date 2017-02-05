import * as React from 'react';
import { render } from 'react-dom';
import NodeRedView from './components/node-red-view';
import * as nodeRedIpc from './components/node-red-ipc';
import * as ipc from './helpers/ipc';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

import * as injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

// @if DEBUG
debugger;
// @endif

nodeRedIpc.setupNotifications();
nodeRedIpc.setupOnlineStatus();

class App extends React.Component<{ initialState: globalState }, { open: boolean}> {

  constructor(props: { initialState: globalState }) {
    super(props);
    this.state = {open: false};
  }

  handleToggle = () => this.setState({open: !this.state.open});
  handleClose = () => this.setState({ open: false });
  
  render() {
    return <MuiThemeProvider>
      <div className="stretch" >
        <Drawer
          docked={false}
          width={200}
          open={this.state.open}
          onRequestChange={(open) => this.setState({open})}
        >
          <MenuItem onClick={this.handleClose}>Menu Item</MenuItem>
          <MenuItem onClick={this.handleClose}>Menu Item 2</MenuItem>
        </Drawer>
        <NodeRedView
          admin={this.props.initialState.nodeRedAdmin}
          ui={this.props.initialState.nodeRedUI}
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
    <App initialState={state} />,
    document.getElementById('app')
  );
});