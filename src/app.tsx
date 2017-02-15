import * as React from 'react';
import { render } from 'react-dom';
import NodeRedView from './components/node-red-view';
import * as nodeRedIpc from './components/node-red-ipc';
import * as ipc from './helpers/ipc';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import uiTheme from './helpers/ui-theme';
import Menu from './components/menu';

import * as injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

// @if DEBUG
debugger;
// @endif

nodeRedIpc.setupNotifications();
nodeRedIpc.setupOnlineStatus();

interface AppState {
  menuOpen: boolean;
  menuItems: MenuItem[];
}

class App extends React.Component<{ init: globalState }, AppState> {

  constructor(props: { init: globalState }) {
    super(props);
    this.state = props.init;
  }

  globalStateUpdate = (state: globalState) => this.setState(state);

  onShowAdmin = () => ipc.mergeState({ currentView: this.props.init.nodeRedAdmin, menuOpen: false });

  render() {
    return <MuiThemeProvider muiTheme={getMuiTheme(uiTheme)}>
      <div className="stretch" >
        <Menu menuOpen={this.state.menuOpen} menuItems={this.state.menuItems} />
        <NodeRedView
          adminUI={this.props.init.nodeRedAdmin}
          className="stretch"
        />
      </div>
    </MuiThemeProvider>;
  }

  componentDidMount() {
    ipc.subscribeState<globalState>(this.globalStateUpdate);
    ipc.subscribeMessage('onShowAdmin', this.onShowAdmin);
  }

  componentWillUnmount() {
    ipc.unsubscribeState<globalState>(this.globalStateUpdate);
    ipc.unsubscribeMessage('onShowAdmin', this.onShowAdmin);
  }
}

ipc
  .getState<globalState>()
  .then(state => render(<App init={state} />, document.getElementById('app')));