How to build?
================================

[back](index)

Follow these instructions to build the Project on your own.

## Prepare your System

- git
- [node.js](https://nodejs.org/en/)
- [yarn](https://yarnpkg.com) - The project is using yarn to ensure a deterministic dependency management.

- [Visual Studio Code](https://code.visualstudio.com)
- [VS Code - Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)

## Checkout the Code
```bash
$ git clone https://github.com/shortsn/flow-to-go.git
```

## Restore Packages

The project follows a two-layered structure therefore you have to restore twice.
Alternatively you can run the predefinded task `restore`.

```bash
$ yarn restore
```

1. The *root folder* contains a `package.json` for development dependencies (gulp, typings...)
2. The *src folder* contains the application and a `package.json` for all bundled dependencies

## Debuging (VS Code)

There are two preconfigured lauch-configurations:

1. Main Process - debug electrons main-process
2. Renderer Process - debug electrons renderer-process

(thx to [code.matsu.io](http://code.matsu.io/1))

## When should I use which Gulp-Task ?

- `build:debug` - transpile, copy files and **keep debug outputs**
- `build` - transpile, copy files and **remove debug outputs**
- `start:debug` - build with debug output and start `main.js`
- `release` - transpile, copy files, remove debug outputs, collect license info and build electron app
- `start release` - build and start the electron app

[back](index)