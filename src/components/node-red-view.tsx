import * as React from 'react';
import Webview from './webview';
import * as ipc from '../helpers/ipc';
const GraphiQL = require('graphiql') as any;

interface Properties {
  id?: string;
  adminUI: string;
  className?: string;
}

interface State {
  src?: string;
  showGraphiQL: boolean;
  online?: boolean;
}

function graphQLFetcher(graphQLParams:any) {
  return { foo:'bar'} ;
}

export default class NodeRedView extends React.Component<Properties,State> {

  render() {
    return this.state.showGraphiQL
      ? <GraphiQL fetcher={graphQLFetcher} />
      : <Webview src={this.state.src} className={this.props.className} />;
  }

  constructor(props:Properties) {
    super(props);
    this.state = {
      src: props.adminUI,
      online: navigator.onLine,
      showGraphiQL: false,
    };
  }

  handleStateChange = (state: globalState) => {
    if (state.currentView === this.state.src) {
      return;
    }
    this.setState({ src: state.currentView, showGraphiQL: state.currentView===state.graphiQL });
  }

  handleOnline = () => { this.setState({ online: true }); };
  handleOffline = () => { this.setState({ online: false }); };

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