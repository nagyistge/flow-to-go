(function () {
  'use strict';
  const { shell } = require('electron');
  document.addEventListener('click', e => {
    // console.log('webview-helper onclick');
    const checkDomElement = function (element:Element) {
      let href:string;
      if (element.nodeName === 'A') {
        href = element.getAttribute('href');
        // const anchorElement = <HTMLAnchorElement>element;
        // console.log('protocol: ' + anchorElement.protocol);
      }
      if (href) {
        // console.log('href: ' + href);
        if (shell.openExternal(href)) {
          e.preventDefault();
        };
      } else if (element.parentElement) {
        checkDomElement(element.parentElement);
      }
    };
    checkDomElement(<Element>e.target);
  }, false);
} ());
