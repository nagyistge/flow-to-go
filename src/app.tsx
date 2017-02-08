import * as React from 'react';
import { render } from 'react-dom';
import NodeRedView from './components/node-red-view';
import * as nodeRedIpc from './components/node-red-ipc';
import * as ipc from './helpers/ipc';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import uiTheme from './helpers/ui-theme';

import * as injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

// @if DEBUG
debugger;
// @endif

nodeRedIpc.setupNotifications();
nodeRedIpc.setupOnlineStatus();

class App extends React.Component<{ init: globalState }, globalState> {

  constructor(props: { init: globalState }) {
    super(props);
    this.state = props.init;
  }

  showAdmin = () => this.showView(this.state.nodeRedAdmin);
  showView = (view: string) => ipc.mergeState({ currentView: view, menuOpen: false });

  globalStateUpdate = (state: globalState) => this.setState(state);

  render() {
    return <MuiThemeProvider muiTheme={getMuiTheme(uiTheme)}>
      <div className="stretch" >
        <Drawer
          docked={false}
          width={64}
          open={this.state.menuOpen}
          onRequestChange={ menuOpen => ipc.mergeState({ menuOpen })}
        >
          <IconButton
            iconStyle={{ width: 24, height: 24 }}
            style={{ width: 64, height: 64, padding: 16 }}
            onTouchTap={this.showAdmin}
            iconClassName="fa fa-cogs"
          />
          {
            this.state.menuItems.map(item =>
              <IconButton
                key={item.id}
                iconStyle={{ width: 24, height: 24 }}
                style={{ width: 64, height: 64, padding: 16 }}
                onTouchTap={() => ipc.publishMessage(item.id, "onTouchTap")}
                iconClassName={item.icon} />
            )
          }
        </Drawer>
        <NodeRedView
          adminUI={this.state.nodeRedAdmin}
          className="stretch"
        />
      </div>
    </MuiThemeProvider>;
  }

  componentDidMount() {
    ipc.subscribeState<globalState>(this.globalStateUpdate);
  }

  componentWillUnmount() {
    ipc.unsubscribeState<globalState>(this.globalStateUpdate);
  }
}

ipc
  .getState<globalState>()
  .then(state => render(<App init={state} />, document.getElementById('app')));