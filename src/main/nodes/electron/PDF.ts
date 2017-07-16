import { BrowserWindow } from 'electron';
import { Observable } from 'rxjs';

export function printToPDF(url: string): Observable<Buffer> {
  if (!url) {
    return Observable.throw(new Error('URL is empty'));
  }

  const windowOptions: Electron.BrowserWindowConstructorOptions = {
    show: false,
    autoHideMenuBar: true,
    skipTaskbar: true,
    closable: true,
    enableLargerThanScreen: true,
    webPreferences: {
      nodeIntegration: false,
      devTools: false,
      webSecurity: true,
    },
  };

  const pdfOptions: Electron.PrintToPDFOptions = {
    landscape: false,
    marginsType: 1,
    pageSize: 'A4',
    printBackground: true,
    printSelectionOnly: false
  };

  let browser = new BrowserWindow(windowOptions);

  const loadFailureStream = Observable
    .fromEvent(browser.webContents, 'did-fail-load',
    (_: {}, code: number, description: string) => ({ code, description }))
    .filter(failure => failure.code !== -3).first()
    .flatMap(failure => Observable.throw(new Error(`[${failure.code}] ${failure.description}`)));

  const loadFinishStream = Observable
    .fromEvent(browser.webContents, 'did-finish-load')
    .first()
    .flatMap(() => Observable.bindNodeCallback(browser.webContents.printToPDF).call(browser.webContents, pdfOptions));

  return Observable
    .of(browser.webContents.loadURL(url))
    .flatMap(_ =>
      Observable.race(
        loadFailureStream,
        loadFinishStream
      ))
    .do(_ => _, () => browser.destroy(), () => browser.destroy());
}
