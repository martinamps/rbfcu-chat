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
    this.setupChannelListener = this.setupChannelListener.bind(this);
    this.state = {
      unreadCount: 0
    }
  }

  componentDidMount() {
    this.init();
    this.setupChannelListener();
  }

  componentWillUpdate() {
    this.setupChannelListener();
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
  }

  setupChannelListener() {
    this.props.getChannel().then((cachedChannel) => {
      cachedChannel.on('messageAdded', (message) => {
        var event = new Event('flexMessageSentToChannel');
        window.dispatchEvent(event);

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