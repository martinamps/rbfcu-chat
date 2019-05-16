import React from 'react';
import * as FlexWebChat from "@twilio/flex-webchat-ui";

const badgeStyles = {
  padding: '3px 8px 5px',
  color: '#fff',
  background: '#f00',
  fontWeight: 'bold',
  fontSize: '0.7rem',
  borderRadius: '20px',
  margin: '1px 0 0 5px'
};

export default class ChatBadges extends React.Component {
  constructor(props) {
    super();
    this.props = props;
    this.init = this.init.bind(this);
    this.state = {
      unreadCount: 0
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.init();
    }, 2000)
  }

  init() {
    const { flex } = this.props.manager.store.getState();

    FlexWebChat.Actions.on('afterToggleChatVisibility', (p) => {
      let currentState = this.props.manager.store.getState().flex;
      if (currentState.session.isEntryPointExpanded) {
        this.setState({
          unreadCount: 0
        })
      }
    });

    this.props.manager.chatClient.getChannelBySid(flex.session.channelSid).then((source) => {
      source.on('messageAdded', (message) => {
        console.log(message);
        let currentState = this.props.manager.store.getState().flex;
        if (currentState.session.isEntryPointExpanded) {
          this.setState({
            unreadCount: 0
          });
          return;
        }

        source.getUnconsumedMessagesCount().then(count => {
          this.setState({
            unreadCount: count
          })
          // play a sound if you wanted or had permission
        })
      })
    });
  }

  render() {
    if (this.state.unreadCount < 1) {
      return null;
    }

    return (
      <span style={ badgeStyles }>{ this.state.unreadCount }</span>
    )
  }
}