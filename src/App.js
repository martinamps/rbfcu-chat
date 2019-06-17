import React from 'react';
import * as FlexWebChat from '@twilio/flex-webchat-ui';
import ChatBadges from './ChatBadges';
import ChatHeader from './ChatHeader';
import FindAgent from './FindAgent';

class App extends React.Component {

  state = {};

  constructor(props) {
    super(props);

    const { configuration, onEndCallback, resolve, reject } = props;

    // Workaround fix due in 2.0.1
    FlexWebChat.EntryPoint.defaultProps.tagline = configuration.componentProps.EntryPoint.tagline;
    FlexWebChat.Manager.create(configuration)
      .then(manager => {

        this.setState({ manager });

        // set some variables on the global window object
        // these help us determine if flex has loaded or not
        window.Twilio = window.Twilio || {};
        FlexWebChat.manager =  manager;
        window.Twilio.FlexWebChat = FlexWebChat;

        // create a global promise that will resolve when the chat channel finally been loaded
        // we'll pass this down as a prop to each of our custom components
        let channelPromise = new Promise((resolve, reject) => {
          let interval = setInterval(() => {
            let currentState = manager.store.getState().flex;
            let cachedChannel = currentState.chat.channels[Object.keys(currentState.chat.channels)[0]];
            if (undefined !== cachedChannel) {
              clearInterval(interval);
              resolve(cachedChannel.source);
            }
          }, 250)
        });

        // hide entry point if configured to do so
        if (configuration.hideEntryPoint)  {
          FlexWebChat.RootContainer.Content.remove('entrypoint');
        }

        // remove FlexWebChat Canvas Tray (displayed when channel goes inactive)
        FlexWebChat.MessagingCanvas.Content.remove('tray');

        // remove default predefned message
        FlexWebChat.MessagingCanvas.defaultProps.predefinedMessage = false;

        // replace the default chat header
        FlexWebChat.MainHeader.Content.replace(
          <ChatHeader manager={manager} channelPromise={channelPromise} onEndCallback={onEndCallback} key='ChatHeader'></ChatHeader>,
           { sortOrder: 1 }
        );

        // add chat badges to the entry point component
        FlexWebChat.EntryPoint.Content.add(
          <ChatBadges manager={manager} channelPromise={channelPromise} key='ChatBadges'></ChatBadges>,
          { sortOrder: 1 }
        );

        // We got clever and replaced the welcome message with our own Finding Agent Spinner
        FlexWebChat.MessageList.WelcomeMessage.Content.replace(<FindAgent manager={ manager } channelPromise={channelPromise} key="FindAgent"></FindAgent>, {
          sortOrder: 1
        })

        // This loop is largely to mask that .chatClient is not loaded when
        // the Manager.create() promise resolves
        let maxTries = 40; // 40 * 250 = 10s
        let triggeredVisibility = false;

        let stillValid = false;
        let loop = setInterval(() =>  {
          if (!maxTries--) {
            clearInterval(loop);
            reject('failed to initialize Flex Webchat');
          }

          if (FlexWebChat.manager) {
            if (FlexWebChat.manager.chatClient === undefined) {
              if (!triggeredVisibility) {
                FlexWebChat.Actions.invokeAction('ToggleChatVisibility');
                triggeredVisibility = true;
              }

              stillValid = false;
            } else {
              if (FlexWebChat.manager.chatClient.connectionState !== 'connecting') {
                triggeredVisibility = false;
                stillValid = true;
                // we seem to be loaded, let's go
                setTimeout(() => {
                  // We stayed in a happy state for the full validity period
                  if (stillValid) {
                    clearInterval(loop);

                    if (!FlexWebChat.manager.store.getState().flex.session.isEntryPointExpanded) {
                      FlexWebChat.Actions.invokeAction('ToggleChatVisibility')
                    }
                    resolve();
                  }
                }, 500);
              }
            }
          }
        }, 250);

      }).catch(error => this.setState({ error }));
  }

  render() {
    const { manager, error } = this.state;
    if (manager) {
      return (
        <FlexWebChat.ContextProvider manager={manager}>
          <FlexWebChat.RootContainer />
        </FlexWebChat.ContextProvider>
      );
    }

    if (error) {
      console.error('Failed to initialize Flex Web Chat', error);
    }

    return null;
  }
}

export default App;
