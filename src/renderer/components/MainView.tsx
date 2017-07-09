import * as React from 'react';
import Webview from './Webview';

export interface Props {
  src: string;
  handleOnline: () => void;
  handleOffline: () => void;
}

export default class MainView extends React.Component<Props, {}> {

  constructor(props: Props) {
    super(props);
    if (navigator.onLine) {
      this.props.handleOnline();
    } else {
      this.props.handleOffline();
    }
  }

  componentDidMount() {
    window.addEventListener('online', this.props.handleOnline);
    window.addEventListener('offline', this.props.handleOffline);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.props.handleOnline);
    window.removeEventListener('offline', this.props.handleOffline);
  }

  render() {
    return (
      !this.props.src
        ? <h1>loading ...</h1>
        : <Webview src={this.props.src} style={{ width: '100%', height: '100%' }} />
    );
  }
}
