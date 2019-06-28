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
  background: 'rgba(255, 255, 255, 75)'
};

class ShowSpinner extends React.Component {
  constructor(props) {
    super();
    this.props = props;
  }

  render() {
    return (
      this.props.showSpinner ?
        <div style={ center }>
          <FlexWebChat.CircularProgress
              size={80}
              borderWidth={2}
              animating
              className="Twilio-PendingEngagementProgress"
          />
        </div> : null
    )
  }
}

function mapStateToProps(state) {
  return { showSpinner: state.rbfcu.showSpinner }
}

export default connect(mapStateToProps)(ShowSpinner);