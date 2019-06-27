import React from 'react';
import { connect } from 'react-redux';
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

class ChatBadges extends React.Component {
  constructor(props) {
    super();
    this.props = props;
  }

  render() {
    if (this.props.unreadCount < 1) {
      return null;
    }

    return (
      <span style={ badgeStyles }>{ this.props.unreadCount }</span>
    )
  }
}

function mapStateToProps(state) {
  return { unreadCount: state.rbfcu.unreadCount }
}

export default connect(mapStateToProps)(ChatBadges);