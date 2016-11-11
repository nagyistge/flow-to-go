import * as React from "react";
import * as ReactDOM from "react-dom";
import Webview from "./webview";

const style = { width: "100%", height: "100%", margin: 0, padding: 0, overflow: "hidden" };

export default class NodeRedView extends React.Component<NodeRedProps, NodeRedState> {

  render() {
    return <div style={style}>
      <Webview src={this.state.viewUrl} />
    </div>;
  }

  constructor(props:NodeRedProps) {
    super(props);
    this.state = {
      viewId: View.ADMIN,
      viewUrl: this.getViewUrl(View.ADMIN),
      online: navigator.onLine,
    };

  }

  getViewUrl = (view: View) => {
    switch (view) {
      case View.UI: return `${this.props.url}/ui`;
      case View.ADMIN: return `${this.props.url}/admin`;
    }
  }

  handleOnline = () => { this.setState({ online: true }); }
  handleOffline = () => { this.setState({ online: false }); }
  handleToggleView = () => {
    switch (this.state.viewId) {
      case View.UI:
        this.setState({ viewId: View.ADMIN, viewUrl: this.getViewUrl(View.ADMIN) });
        return;
      case View.ADMIN:
        this.setState({ viewId: View.UI, viewUrl: this.getViewUrl(View.UI) });
        return;
    }
  }
  
  componentDidMount() {
    window.addEventListener("online", this.handleOnline);
    window.addEventListener("offline", this.handleOffline);
  }

  componentWillUnmount() {
    window.removeEventListener("online", this.handleOnline);
    window.removeEventListener("offline", this.handleOffline);
  }
}

enum View {
  UI,
  ADMIN
}

interface NodeRedProps {
  url: string;
}

interface NodeRedState {
  viewId?: View;
  viewUrl?: string;
  online?: boolean;
  showInfo?: boolean;
  info?: string;
}