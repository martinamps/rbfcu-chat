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
        if (configuration.hideEntryPoint)  {
          FlexWebChat.RootContainer.Content.remove('entrypoint');
        }

        // remove default predefned message
        FlexWebChat.MessagingCanvas.defaultProps.predefinedMessage = false;

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
                    FlexWebChat.MainHeader.Content.replace(
                      <ChatHeader manager={manager} onEndCallback={onEndCallback} key='ChatHeader'></ChatHeader>,
                       { sortOrder: 1 }
                    );

                    FlexWebChat.EntryPoint.Content.add(
                      <ChatBadges manager={manager} key='ChatBadges'></ChatBadges>,
                      { sortOrder: 1 }
                    );

                    FlexWebChat.MessageList.WelcomeMessage.Content.replace(
                      <FindAgent manager={ manager } key="FindAgent"></FindAgent>,
                      { sortOrder: 1 }
                    );
                    resolve();
                  }
                }, 500);
              }
            }
          }
        }, 250);

        window.Twilio = window.Twilio || {};
        FlexWebChat.manager =  manager;
        window.Twilio.FlexWebChat = FlexWebChat;
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
