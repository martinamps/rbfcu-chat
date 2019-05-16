import React from 'react';
import * as FlexWebChat from "@twilio/flex-webchat-ui";
import ChatHeader from './ChatHeader';

class App extends React.Component {

  state = {};

  constructor(props) {
    super(props);

    const { configuration, resolve, reject } = props;

    // Workaround fix due in 2.0.1
    FlexWebChat.EntryPoint.defaultProps.tagline = configuration.componentProps.EntryPoint.tagline;
    FlexWebChat.Manager.create(configuration)
      .then(manager => {
        this.setState({ manager });
        if (configuration.hideEntryPoint)  {
          FlexWebChat.RootContainer.Content.remove("entrypoint");
        }

        // remove default predefned message
        FlexWebChat.MessagingCanvas.defaultProps.predefinedMessage = false;
        FlexWebChat.MainHeader.Content.replace(
          <ChatHeader manager={ manager } key="ChatHeader"></ChatHeader>,
           { sortOrder: 1 }
        );

        // This loop is largely to mask that .chatClient is not loaded when
        // the Manager.create() promise resolves
        let maxTries = 40; // 40 * 250 = 10s
        let triggeredVisibility = false;
        let loop = setInterval(() =>  {
          if (!maxTries--) {
            clearInterval(loop);
            reject('failed to initialize Flex Webchat');
          }

          console.log('checking loaded');

          if (window.Twilio &&
                window.Twilio.FlexWebChat &&
                window.Twilio.FlexWebChat.manager) {
                    if (window.Twilio.FlexWebChat.manager.chatClient === undefined) {
                      if (!triggeredVisibility) {
                        console.log('toggling visibility');
                        FlexWebChat.Actions.invokeAction('ToggleChatVisibility');
                        triggeredVisibility = true;
                      }
                    } else {
                      // we seem to be loaded, let's go
                      clearInterval(loop);
                      console.log('loaded');
                      setTimeout(() => resolve(), 500);
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
    console.log('my stage is', this.state);
    if (error) {
      console.error("Failed to initialize Flex Web Chat", error);
    }

    return null;
  }
}

export default App;
