import * as React from "react";
import * as ReactDOM from "react-dom";
import NodeRedView from "./components/node-red-view";
import * as nodeRedIpc from "./components/node-red-ipc";
import { MuiThemeProvider } from 'material-ui/styles';

const { remote } = require("electron");
const injectTapEventPlugin = require('react-tap-event-plugin');

injectTapEventPlugin();
nodeRedIpc.setupNotifications();
nodeRedIpc.setupOnlineStatus();

ReactDOM.render(
  <MuiThemeProvider>
    <NodeRedView url={remote.getGlobal("nodeRedUrl")}/>
  </MuiThemeProvider>,
  document.getElementById("app")
);