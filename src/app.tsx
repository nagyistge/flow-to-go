import * as React from 'react';
import { render } from 'react-dom';
import NodeRedView from './components/node-red-view';
import * as nodeRedIpc from './components/node-red-ipc';
import * as ipc from './helpers/ipc';

// @if DEBUG
debugger;
// @endif

nodeRedIpc.setupNotifications();
nodeRedIpc.setupOnlineStatus();

class App extends React.Component<{ initialState: globalState }, {}> {
  render() {
    return <NodeRedView
      admin={this.props.initialState.nodeRedAdmin}
      ui={this.props.initialState.nodeRedUI}
      />;
  }
}

ipc.subscribeState<globalState>(state => {
  render(
    <App initialState={state} />,
    document.getElementById('app')
  );
});