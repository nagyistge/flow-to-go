import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { openUrl } from './Window';

// tslint:disable:no-console
interface Props {
  src: string;
  className?: string;
  style?: React.CSSProperties;
}

export default class Webview extends React.Component<Props, {}> {

  node: Electron.WebviewTag;
  handleNewWindow = (event: Electron.NewWindowEvent) => openUrl(event.url);

  handleConsoleMessage = (event: Electron.ConsoleMessageEvent) => {
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

  render() {
    // tslint:disable-next-line:no-any
    return React.createElement<any, any>('Webview', {
      ... this.props,
      preload: `${__dirname}/preload.bundle.js`
    });
  }

  componentDidMount() {
    this.node = ReactDOM.findDOMNode(this) as Electron.WebviewTag;
    this.node.setAttribute('disablewebsecurity', 'true');
    this.node.addEventListener('new-window', this.handleNewWindow);
    this.node.addEventListener('console-message', this.handleConsoleMessage);
  }

  componentWillUnmount() {
    this.node.removeEventListener('new-window', this.handleNewWindow);
    this.node.removeEventListener('console-message', this.handleConsoleMessage);
    delete this.node;
  }

}
