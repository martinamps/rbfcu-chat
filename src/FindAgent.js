import React from 'react';
import { connect } from 'react-redux';
import * as FlexWebChat from "@twilio/flex-webchat-ui";

const center = {
  textAlign: 'center'
};

class FindAgent extends React.Component {
  constructor(props) {
    super();
    this.props = props;
  }

  render() {
    return (
      this.props.agentJoined ? null :
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

function mapStateToProps(state) {
  return { agentJoined: state.rbfcu.agentJoined }
}

export default connect(mapStateToProps)(FindAgent);