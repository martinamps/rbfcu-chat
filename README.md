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

## Run locally

the default dev server (via create-react-app) does not currently work, which should be addressed at a later date to improve iteration speed, for now you can:


1. Setup environment
```
echo "ACCOUNT_SID=ACxxx" >> .env.local
echo "FLOW_SID=FOxxx" >> .env.local
```

2. Build a bundle and open it
npm run build start

## Methods

* loadFlexWebchat(overrides, onEndCallback)
  * This initiates the Flex Webchat SDK and resolves a promise when the chat has fully loaded
* toggleFlexEntryPoint
  *  Triggers a wrapper around the whole SDK, including the entry point
* toggleFlexWebchat
  * Fires the ToggleChatVisibility webchat action
* chatHasMessages
  * Returns a promise which resolves with a boolean for whether there are messages on the current chat channel
* sendQuestion(question)
  * Sends a message into the current chat channel