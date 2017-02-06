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

class App extends React.Component<{ init: globalState }, { menuOpen: boolean, menuItems: MenuItem[] }> {

  constructor(initial: { init: globalState }) {
    super(initial);
    this.state = {
      menuOpen: initial.init.menuOpen,
      menuItems: initial.init.menuItems
    };
  }

  toggleMenu = () => ipc.updateState({menuOpen: !this.state.menuOpen});
  
  showAdmin = () => this.showView(this.props.init.nodeRedAdmin);
  showView = (view: string) => ipc.updateState({ currentView: view, menuOpen:false});

  globalStateUpdate = (state: globalState) => this.setState(state);

  render() {
    return <MuiThemeProvider muiTheme={getMuiTheme(uiTheme)}>
      <div className="stretch" >
        <Drawer
          docked={false}
          width={64}
          open={this.state.menuOpen}
          onRequestChange={(menuOpen) => this.setState({ menuOpen })}
        >
          <IconButton
            iconStyle={{ width: 24, height: 24 }}
            style={{ width: 64, height: 64, padding: 16 }}
            onTouchTap={this.showAdmin}
            iconClassName= "fa fa-cogs"
          />
          {
            this.state.menuItems.map(item =>
              <IconButton
                key= {item.id}
                iconStyle={{ width: 24, height: 24 }}
                style={{ width: 64, height: 64, padding: 16 }}
                onTouchTap={() => this.showView("http://www.github.com")}
                iconClassName={item.icon}/>
            )
          }
        </Drawer>
        <NodeRedView
          admin={this.props.init.nodeRedAdmin}
          className="stretch"
        />
      </div>
    </MuiThemeProvider>;
  }

  componentDidMount() {
    ipc.subscribeMessage('toggleMenu', this.toggleMenu);
    ipc.subscribeState<globalState>(this.globalStateUpdate);
  }

  componentWillUnmount() {
    ipc.unsubscribeMessage('toggleMenu', this.toggleMenu);
    ipc.unsubscribeState<globalState>(this.globalStateUpdate);
  }
}

const renderApp = (state: globalState) => {
  ipc.unsubscribeState(renderApp);
  render(
    <App init={state} />,
    document.getElementById('app')
  );
};

ipc.subscribeState<globalState>(renderApp);