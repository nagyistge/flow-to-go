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
import Badge from 'material-ui/Badge';

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

  globalStateUpdate = (state: globalState) => this.setState(state);

  render() {
    return <MuiThemeProvider muiTheme={getMuiTheme(uiTheme)}>
      <div className="stretch" >
        <Drawer
          docked={false}
          width={64}
          open={this.state.menuOpen}
          onRequestChange={menuOpen => ipc.mergeState({ menuOpen })}
        >
          {
            this.state.menuItems.map(item => {
              const button = <IconButton
                key={item.id}
                style={{ width: '100%', padding: 16 }}
                onTouchTap={() => ipc.publishMessage(item.id, "onTouchTap")}
                iconClassName={item.icon} />;

              return (item.badge === undefined)
                ? button
                : <Badge
                  key={item.id}
                  style={{ width: 64, height: 64, padding: 0 }}
                  badgeContent={ item.badge }
                  badgeStyle={{ fontSize: 10, top: 4, right: 4, width: 16, height: 16 }}
                  primary={true}
                >
                { button }
                </Badge>;
            })
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