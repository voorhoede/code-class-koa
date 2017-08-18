# Code Class Koa

## Getting started

```sh
# clone repository
$ git clone git@github.com:voorhoede/code-class-koa.git

# go inside
$ cd code-class-koa

# install dependencies
$ npm install

# koa server http://localhost:3000
# express server http://localhost:3001
$ npm run start1
$ npm run start2
$ npm run start3
```

## Prerequisites

1. You know a bit about Express
2. You know a bit about async / await

## Exercises

1. [Return a response](exercises1/koa.js)
2. [Error handling](exercises2/koa.js)
3. [Middleware](exercises3/koa.js)

## Solutions

See [Solutions branch](https://github.com/voorhoede/code-class-koa/tree/solutions/solutions)

## Slides

See reveal.js presentation in the presentation folder

## Tips

### Debugging with Node.js inspector

Node.js's built-in inspector (`node --inspect`) works great for [debugging Node.js with Chrome DevTools](https://medium.com/@paul_irish/debugging-node-js-nightlies-with-chrome-devtools-7c4a1b95ae27). Nodemon however restarts our Node.js server on every code change creating a new URL for debugging. To have your DevTools automatically reconnect with your new app you can use the [NIM (Node Inspector Manager) Chrome extension](https://chrome.google.com/webstore/detail/nodejs-v8-inspector-manag/gnhhdgbaldcilmgcpfddgdbkhjohddkj).