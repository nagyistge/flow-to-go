(function () {
  'use strict';
  const { shell } = require('electron');
  document.addEventListener('click', e => {
    // console.log('webview-helper onclick');
    let href:string;
    const checkDomElement = function (element:Element) {
      if (element.nodeName === 'A') {
        href = element.getAttribute('href');
      }
      if (href) {
        shell.openExternal(href);
        e.preventDefault();
      } else if (element.parentElement) {
        checkDomElement(element.parentElement);
      }
    };
    checkDomElement(<Element>e.target);
  }, false);
} ());
