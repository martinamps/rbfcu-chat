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
      agentJoined: false
    }
  }

  componentDidMount() {
    this.init();
  }

  init() {
    const { flex } = this.props.manager.store.getState();
    const cachedChannel = flex.chat.channels[Object.keys(flex.chat.channels)[0]];

    console.log(cachedChannel.source.members.size);

    if (cachedChannel.source.members.size > 1) {
      this.setState({
        agentJoined: true
      })
    }

    cachedChannel.source.on('memberJoined', (member) => {
      if (cachedChannel.source.members.size > 1) {
        this.setState({
          agentJoined: true
        })
      }
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