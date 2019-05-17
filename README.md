# RBFCU Flex Web Chat Sample

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app), then ejected to tweak the build scripts for our use-case (most notably disabling chunking to get one bundle).

The primary purpose of this implementation was to enable easy interop between an angular app, and a react app without any modifications to the original build system. The various workarounds for race conditions are also hidden within this wrapper.

## Instructions

1. Install all dependencies by running:
```
npm install
```

2. Build a bundle
```
npm run build
```

There's an example implementation and test file you can open in public/index.html -- the dev server (via npm start) does not currently work so the sids are hardcoded, that should be addressed at a later date.
