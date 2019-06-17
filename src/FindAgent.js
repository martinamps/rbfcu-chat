import React from 'react';
import * as FlexWebChat from "@twilio/flex-webchat-ui";

const center = {
  textAlign: 'center'
};

export default class FindAgent extends React.Component {
  constructor(props) {
    super();
    this.props = props;
    this.init = this.init.bind(this);
    this.state = {
      agentJoined: true
    }
  }

  componentDidMount() {
    this.init();
  }

  init() {
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

    channelPromise.then(cachedChannel => {
      if (cachedChannel.members.size > 1) {
        this.setState({
          agentJoined: true
        })
      } else {
        this.setState({
          agentJoined: false
        })
      }

      cachedChannel.on('memberJoined', (member) => {
        if (cachedChannel.members.size > 1) {
          this.setState({
            agentJoined: true
          })
        } else {
          this.setState({
            agentJoined: false
          })
        }
      })

    })
  }

  render() {
    return (
      this.state.agentJoined ? null :
        <div style={ center }>
          <FlexWebChat.CircularProgress
              size={80}
              borderWidth={2}
              animating
              className="Twilio-PendingEngagementProgress"
          />
          <p>Finding you the perfect agent.</p>
        </div>
    )
  }
}