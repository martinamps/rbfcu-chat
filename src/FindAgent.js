import React from 'react';
import * as FlexWebChat from "@twilio/flex-webchat-ui";

const center = {
  textAlign: 'center'
};

export default class FindAgent extends React.Component {
  constructor(props) {
    super();
    this.props = props;
    this.setUpChannelListener = this.setUpChannelListener.bind(this);
    this.state = {
      agentJoined: true
    }
  }

  componentDidMount() {
    this.setUpChannelListener()
  }

  setUpChannelListener() {
    this.props.getChannel().then(cachedChannel => {
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