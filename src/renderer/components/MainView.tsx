﻿import * as React from 'react';
import Webview from './Webview';

export interface Props {
  src: string;
}

export default function MainView({ src }: Props) {
  return (
    !src
      ? <h1>loading ...</h1>
      : <Webview src={src} style={{ width: '100%', height: '100%'}} />
  );
}
