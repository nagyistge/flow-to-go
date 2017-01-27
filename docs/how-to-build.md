Follow these instructions to build the Project on your own.

## Prepare your System

- git
- [node.js](https://nodejs.org/en/)
- [yarn](https://yarnpkg.com) - The project is using yarn to ensure a deterministic dependency management.

## Checkout the Code
```bash
$ git clone https://github.com/shortsn/red-to-go.git
```

## Restore Packages

The project follows a two-layered structure therefore you have to restore twice.
Alternatively you can run the predefinded task `restore`.

```bash
$ yarn restore
```

1. The *root folder* contains a `package.json` for development dependencies (gulp, typings...)
2. The *src folder* contains the application and a `package.json` for all bundled dependencies

## When should I use which Gulp-Task ?

- `build:debug` - transpile, copy files and **keep debug outputs**
- `build` - transpile, copy files and **remove debug outputs**
- `start:debug` - build with debug output and start `main.js`
- `release` - transpile, copy files, remove debug outputs, collect license info and build electron app
- `start release` - build and start the electron app