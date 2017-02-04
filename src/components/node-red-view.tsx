import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Webview from './webview';
import * as ipc from '../helpers/ipc';


interface Properties {
  admin: string;
  ui: string;
  className?: string;
}

interface State {
  src?: string;
  online?: boolean;
}

export default class NodeRedView extends React.Component<Properties,State> {

  render() {
    return <Webview src={this.state.src} className={this.props.className}/>;
  }

  constructor(props:Properties) {
    super(props);
    this.state = {
      src: props.admin,
      online: navigator.onLine,
    };
  }

  handleStateChange = (state: globalState) => {
    if (state.currentView === this.state.src) {
      return;
    }
    this.setState({ src: state.currentView });
  }

  handleOnline = () => { this.setState({ online: true }); }
  handleOffline = () => { this.setState({ online: false }); }

  componentDidMount() {
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
    ipc.subscribeState<globalState>(this.handleStateChange);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
    ipc.unsubscribeState<globalState>(this.handleStateChange);
  }
}