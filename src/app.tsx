import * as React from "react";
import * as ReactDOM from "react-dom";
import NodeRedView from "./components/node-red-view";
import * as nodeRedIpc from "./components/node-red-ipc";
import { MuiThemeProvider } from 'material-ui/styles';
import * as ipc from "./helpers/ipc";

const injectTapEventPlugin = require('react-tap-event-plugin');

injectTapEventPlugin();
nodeRedIpc.setupNotifications();
nodeRedIpc.setupOnlineStatus();

ipc.subscribeState<globalState>(state => {
  ReactDOM.render(
    <MuiThemeProvider>
      <NodeRedView url={state.nodeRedUrl} />
    </MuiThemeProvider>,
    document.getElementById("app")
  );
});