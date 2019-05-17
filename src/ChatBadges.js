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
    this.init();
  }

  init() {
    const { flex } = this.props.manager.store.getState();
    const cachedChannel = flex.chat.channels[Object.keys(flex.chat.channels)[0]];

    FlexWebChat.Actions.on('afterToggleChatVisibility', (p) => {
      let currentState = this.props.manager.store.getState().flex;
      if (currentState.session.isEntryPointExpanded) {
        this.setState({
          unreadCount: 0
        })
      }
    });

    cachedChannel.source.on('messageAdded', (message) => {
      let currentState = this.props.manager.store.getState().flex;
      if (currentState.session.isEntryPointExpanded) {
        this.setState({
          unreadCount: 0
        });
        return;
      }

      cachedChannel.source.getUnconsumedMessagesCount().then(count => {
        this.setState({
          unreadCount: count
        })
        // play a sound here if you wanted
      })
    })
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