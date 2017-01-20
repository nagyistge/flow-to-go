import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { openUrl } from '../helpers/window';
import { join } from 'path';
const preload = join(__dirname, '../helpers/preload.js');

interface WebviewProps { src: string; }

export default class Webview extends React.Component<WebviewProps, {}> {
  
  render() {
    return React.createElement('webview', {
      src: this.props.src,
      preload: preload,
    });
  }

  handleConsoleMessage = (event: Electron.WebViewElement.ConsoleMessageEvent) => {
    const message = `Webview: ${event.message} [${event.sourceId} line: ${event.line}]`;
    switch (event.level) {
       case -1:
        console.info(message);
        return;
      case 1:
        console.warn(message);
        return;
      case 2:
        console.error(message);
        return;
      default:
        console.log(message);
        return;
    }
  }

  handleNewWindow = (event: Electron.WebViewElement.NewWindowEvent) => openUrl(event.url);
  handleStartLoading = () => console.info('Webview: did-start-loading');
  handleStopLoading = () => console.info('Webview: did-stop-loading');

  componentDidMount() {
    const node = ReactDOM.findDOMNode(this) as Electron.WebViewElement;
    
    node.addEventListener('new-window', this.handleNewWindow);
    
// @if DEBUG
    node.addEventListener('console-message', this.handleConsoleMessage);
    node.addEventListener('did-start-loading', this.handleStartLoading);
    node.addEventListener('did-stop-loading', this.handleStopLoading);
// @endif
  }

  componentWillUnmount() {
    const node = ReactDOM.findDOMNode(this);
    
    node.removeEventListener('new-window', this.handleNewWindow);
    
// @if DEBUG
    node.removeEventListener('console-message', this.handleConsoleMessage);
    node.removeEventListener('did-start-loading', this.handleStartLoading);
    node.removeEventListener('did-stop-loading', this.handleStopLoading);
// @endif
  }
}