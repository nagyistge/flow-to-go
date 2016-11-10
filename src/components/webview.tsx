import * as React from "react";
import * as ReactDOM from "react-dom";

const { shell } = require("electron");
const preload = "./helpers/webview.js";

export interface WebviewProps { src: string; style?: Object; }

function redirectWebviewConsole(e:any) {
  console.log("Webview:", e.message);
}

function openNewWindow(e:any) {
  const protocol = require("url").parse(e.url).protocol;
  if (protocol === "http:" || protocol === "https:") {
      shell.openExternal(e.url);
  }
}

export default class Webview extends React.Component<WebviewProps, {}> {
  
  componentDidMount() {
    const node = ReactDOM.findDOMNode(this);
    node.addEventListener("console-message", redirectWebviewConsole);
    node.addEventListener("new-window", openNewWindow);
  }

  render() {
    return React.createElement("webview", {
      src: this.props.src,
      preload: preload,
      style: this.props.style
    });
  }
}