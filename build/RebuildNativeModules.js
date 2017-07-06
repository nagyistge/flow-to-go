const path = require('path');
const { execSync } = require('child_process');
const platform = require('os').platform()
const rebuild = require('electron-rebuild').rebuildNativeModules;

const rootDir = path.resolve(__dirname, '..');
const binDir = path.join(rootDir, 'node_modules', '.bin');
const packageJson = require(path.join(rootDir, 'package.json'));
const moduleDir = path.resolve(rootDir, 'src');
const electronVersion = `${/\d+.\d+.\d+/g.exec(packageJson.devDependencies.electron)}`;

const app = (platform === 'win32')
  ? path.join(binDir, 'electron-rebuild.cmd')
  : path.join(binDir, 'electron-rebuild');

const commandline = `${app} --version ${electronVersion} --module-dir ${moduleDir}`;
console.log('rebuilding packages');
console.log(commandline);

execSync(commandline);
