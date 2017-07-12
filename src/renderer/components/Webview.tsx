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

  render() {
    // tslint:disable-next-line:no-any
    return React.createElement<any, any>('Webview', {
      ... this.props,
      preload: `${__dirname}/preload.js`
    });
  }

  componentDidMount() {
    this.node = ReactDOM.findDOMNode(this) as Electron.WebviewTag;
    this.node.setAttribute('disablewebsecurity', 'true');
    this.node.addEventListener('new-window', this.handleNewWindow);
  }

  componentWillUnmount() {
    this.node.removeEventListener('new-window', this.handleNewWindow);
    delete this.node;
  }

}
