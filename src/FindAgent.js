import React from 'react';
import { connect } from 'react-redux';
import * as FlexWebChat from "@twilio/flex-webchat-ui";

const center = {
  textAlign: 'center',
  position: 'absolute',
  paddingTop: '50%',
  top: '0px',
  bottom: '0px',
  left: '0px',
  right: '0px',
  background: 'rgba(255, 255, 255, 0.9)'
};

class FindAgent extends React.Component {
  constructor(props) {
    super();
    this.props = props;
  }

  render() {
    return (
      this.props.showFindingAgent ?
        <div style={ center }>
          <FlexWebChat.CircularProgress
              size={80}
              borderWidth={2}
              animating
              className="Twilio-PendingEngagementProgress"
          />
          <p>Finding you the perfect agent.</p>
        </div> : null
    )
  }
}

function mapStateToProps(state) {
  return { showFindingAgent: state.rbfcu.showFindingAgent }
}

export default connect(mapStateToProps)(FindAgent);