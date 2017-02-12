import * as React from 'react';
import { render } from 'react-dom';
import { getState } from '../helpers/ipc';

class About extends React.Component<{ nodeRedUrl: string }, {}> {
  render() {
    return <div>
      <a href="/* @echo packageJson.homepage */">
        <div>
          <img className="logo" alt="icon" src="../app.png" />
        </div>
      </a>
      <h1 className="header">/* @echo packageJson.name */</h1>
      <h3 className="header">/* @echo packageJson.description */</h3>
      <table className="info">
        <tbody>
          <tr><td>Version</td><td>: /* @echo packageJson.version */</td></tr>
          <tr><td>Timestamp</td><td>: /* @echo timestamp */</td></tr>
          <tr><td>Commit</td><td>: /* @echo commitId */</td></tr>
          <tr><td>License</td><td>: /* @echo packageJson.license */</td></tr>
          <tr><td>Electron</td><td>: {process.versions['electron']}</td></tr>
          <tr><td>Chrome</td><td>: {process.versions['chrome']}</td></tr>
          <tr><td>Node</td><td>: {process.versions['node']}</td></tr>
          <tr><td>V8</td><td>: {process.versions['v8']}</td></tr>
        </tbody>
      </table>
      <h2 className="header">Parameters</h2>
      <table className="info">
        <tbody>
          <tr><td>URL</td><td> : {this.props.nodeRedUrl}</td></tr>
        </tbody>
      </table>
      <br />
      <div className="link">
        <a href="/* @echo packageJson.bugs.url */">Issuetracker</a>
      </div>
    </div>;
  }
}

getState<globalState>()
  .then(state => render(<About nodeRedUrl={state.nodeRedUrl} />, document.getElementById('about')));