import { openUrl } from '../helpers/window';

(function () {
  'use strict';
  document.addEventListener('click', event => {
    // console.log('webview-helper onclick');
    const checkDomElement = function (element: Element) {
      let anchor: HTMLAnchorElement;
      if (element.nodeName === 'A') {
        anchor = <HTMLAnchorElement>element;
        if (anchor.href.endsWith('#')) { return; }
        // @if DEBUG
        console.log(`anchor clicked: ${anchor}`);
        // @endif
        event.preventDefault();
         openUrl(anchor.href);
      } else if (element.parentElement) {
        checkDomElement(element.parentElement);
      }
    };
    checkDomElement(<Element>event.target);
  }, false);
}());
