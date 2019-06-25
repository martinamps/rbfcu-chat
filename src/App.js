import React from 'react';
import * as FlexWebChat from '@twilio/flex-webchat-ui';
import ChatBadges from './ChatBadges';
import ChatHeader from './ChatHeader';
import FindAgent from './FindAgent';

class App extends React.Component {

  state = {};

  constructor(props) {
    super(props);

    const { configuration, resolve, reject } = props;

    this.getChannel = this.getChannel.bind(this);

    // Workaround fix due in 2.0.1
    FlexWebChat.EntryPoint.defaultProps.tagline = configuration.componentProps.EntryPoint.tagline;
    FlexWebChat.Manager.create(configuration)
      .then(manager => {

        this.setState({
          manager: manager,
          channel: null
        });

        // set some variables on the global window object
        // these help us determine if flex has loaded or not
        window.Twilio = window.Twilio || {};
        FlexWebChat.manager =  manager;
        window.Twilio.FlexWebChat = FlexWebChat;

        FlexWebChat.Actions.on("afterStartEngagement", (payload) => {
          window.showFlex();
          let currentState = manager.store.getState().flex;
          if (!currentState.session.isEntryPointExpanded) {
            window.toggleFlexWebchat();
          }
          const { question } = payload.formData;
          if (!question) return;

          const { channelSid } = manager.store.getState().flex.session;
          manager.chatClient.getChannelBySid(channelSid)
              .then(channel => {
                  this.setState({ channel });
                  channel.sendMessage(question);
              });
        });

        FlexWebChat.Actions.on("beforeRestartEngagement", (payload) => {
          window.hideFlex();
          let currentState = manager.store.getState().flex;
          let cachedChannel = currentState.chat.channels[Object.keys(currentState.chat.channels)[0]];
          cachedChannel.source.sendMessage('Left Chat!');
        })

        resolve();

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
          <ChatHeader manager={manager} getChannel={this.getChannel} key='ChatHeader'></ChatHeader>,
           { sortOrder: 1 }
        );

        // add chat badges to the entry point component
        FlexWebChat.EntryPoint.Content.add(
          <ChatBadges manager={manager} getChannel={this.getChannel} key='ChatBadges'></ChatBadges>,
          { sortOrder: 1 }
        );

        // We got clever and replaced the welcome message with our own Finding Agent Spinner
        FlexWebChat.MessageList.WelcomeMessage.Content.replace(<FindAgent manager={ manager } getChannel={this.getChannel} key="FindAgent"></FindAgent>, {
          sortOrder: 1
        })

      }).catch(error => this.setState({ error }));
  }

  getChannel() {
    return new Promise((resolve, reject) => {
      if (!this.state.channel) {
        reject('Awaiting chat engagement to start.')
      }
      resolve(this.state.channel);
    })
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
