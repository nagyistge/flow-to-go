import { openUrl } from '../helpers/window';

(function () {
  'use strict';
  document.addEventListener('click', event => {
    // console.info('webview-helper onclick');
    const checkDomElement = function (element: Element) {
      let anchor: HTMLAnchorElement;
      if (element.nodeName === 'A') {
        anchor = <HTMLAnchorElement>element;
        // @if DEBUG
        console.info(`anchor clicked: ${anchor}`);
        // @endif
        if (openUrl(anchor.href)) {
          event.preventDefault();
        }
      } else if (element.parentElement) {
        checkDomElement(element.parentElement);
      }
    };
    checkDomElement(<Element>event.target);
  }, false);
}());
