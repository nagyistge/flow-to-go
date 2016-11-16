import * as React from "react";
import * as ReactDOM from "react-dom";

const { shell } = require("electron");
const preload = "./helpers/webview.js";

interface WebviewProps { src: string; }

export default class Webview extends React.Component<WebviewProps, {}> {
  
  render() {
    return React.createElement("webview", {
      src: this.props.src,
      preload: preload,
    });
  }

  handleConsoleMessage = (e: any) => {
    console.log("Webview:", e.message);
  }

  handleNewWindow = (e: any) => {
    const protocol = require("url").parse(e.url).protocol;
    if (protocol === "http:" || protocol === "https:") {
      shell.openExternal(e.url);
    }
  }

  handleStartLoading = () => {
    console.log("Webview: start-loading");
  }

  handleStopLoading = () => {
    console.log("Webview: stop-loading");
  }

  componentDidMount() {
    const node = ReactDOM.findDOMNode(this);
    node.addEventListener("console-message", this.handleConsoleMessage);
    node.addEventListener("new-window", this.handleNewWindow);
    // node.addEventListener("did-start-loading", this.handleStartLoading);
    // node.addEventListener("did-stop-loading", this.handleStopLoading);
  }

  componentWillUnmount() {
    const node = ReactDOM.findDOMNode(this);
    node.removeEventListener("console-message", this.handleConsoleMessage);
    node.removeEventListener("new-window", this.handleNewWindow);
    // node.removeEventListener("did-start-loading", this.handleStartLoading);
    // node.removeEventListener("did-stop-loading", this.handleStopLoading);
  }
}