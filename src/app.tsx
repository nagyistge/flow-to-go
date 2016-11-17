import * as React from "react";
import { render } from 'react-dom';
import NodeRedView from "./components/node-red-view";
import * as nodeRedIpc from "./components/node-red-ipc";
import { MuiThemeProvider } from 'material-ui/styles';
import * as ipc from "./helpers/ipc";

const injectTapEventPlugin = require('react-tap-event-plugin');

injectTapEventPlugin();
nodeRedIpc.setupNotifications();
nodeRedIpc.setupOnlineStatus();

class App extends React.Component<{ initialState: globalState },{}> {
  render() {
    return <MuiThemeProvider>
      <NodeRedView
        admin={this.props.initialState.nodeRedAdmin}
        ui={this.props.initialState.nodeRedUI}
      />
    </MuiThemeProvider >;
  }
}

ipc.subscribeState<globalState>(state => {
  render(
    <App initialState={state}/>,
    document.getElementById("app")
  );
});