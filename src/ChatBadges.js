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

    FlexWebChat.Actions.on('afterToggleChatVisibility', () => {
      let { session } = this.props.manager.store.getState().flex;
      if (session.isEntryPointExpanded) {
        this.setState({
          unreadCount: 0
        })
      }
    });

    let channelPromise = new Promise((resolve, reject) => {
      let interval = setInterval(() => {
        let currentState = this.props.manager.store.getState().flex;
        let cachedChannel = currentState.chat.channels[Object.keys(currentState.chat.channels)[0]];
        if (undefined !== cachedChannel) {
          clearInterval(interval);
          resolve(cachedChannel.source);
        }
      }, 500)
    });

    channelPromise.then((cachedChannel) => {

      cachedChannel.on('messageAdded', (message) => {
        let { session } = this.props.manager.store.getState().flex;
        if (session.isEntryPointExpanded) {
          this.setState({
            unreadCount: 0
          });
          return;
        }
        message.channel.getUnconsumedMessagesCount().then(count => {
          this.setState({
            unreadCount: count
          })
        })
        .catch(e => { console.log(e) });
      });
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