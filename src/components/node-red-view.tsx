import * as React from 'react';
import Webview from './webview';
import * as ipc from '../helpers/ipc';
import { fetchData } from '../helpers/graphQL';

const GraphiQL = require('graphiql') as any;

interface Properties {
  id?: string;
  initialView: string;
  className?: string;
  graphQL: string;
}

interface State {
  view?: string;
  online?: boolean;
}

export default class NodeRedView extends React.Component<Properties,State> {
  render() {
    return this.state.view === 'GraphiQL'
      ? <GraphiQL fetcher={(params:any) => fetchData(this.props.graphQL, params)} />
      : <Webview src={this.state.view} className={this.props.className} />;
  }

  constructor(props:Properties) {
    super(props);
    this.state ={
      view: props.initialView,
      online: navigator.onLine
    };
  }

  handleStateChange = (state: globalState) => {
    if (state.currentView === this.state.view) {
      return;
    }
    this.setState({ view: state.currentView });
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