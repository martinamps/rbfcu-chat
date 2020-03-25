import React from 'react';
import { connect } from 'react-redux';

const wrapper = {
    display: 'flex',
    overflowX: 'hidden',
    justifyContent: 'center',
    width: '100%'
}

const bubble = {
    paddingLeft: '12px',
    paddingRight: '12px',
    color: 'black',
    paddingTop: '5px',
    paddingBottom: '8px',
    margin: '5px 10px',
    position: 'relative',
    overflowX: 'hidden',
    display: 'flex',
    background: '#eeeeee',
    borderRadius: '8px',
    fontSize: '1.5em'
}

class ClickableMessages extends React.Component {
  constructor(props) {
    super();
    this.props = props;
  }

  render() {
    const dispatch = this.props.dispatch;
    const channel = this.props.channel;
    return (
      this.props.clickableMessages ?
        <div className="generatedAnswers" style={wrapper}>
          { this.props.clickableMessages.map(function(m) {
            return (
              <div className="generatedAnswerBubble" style={bubble} onClick={(e) => {
                // this removes all the clickable messages
                dispatch({
                  type: 'SET_RBFCU_SHOW_CLICKABLE_MESSAGES',
                  payload: { clickableMessages: [] }
                })
                channel.sendMessage(m.message);
              }} key={m.key}>
                {m.message}
              </div>
            );
          }) }
        </div> : null
    )
  }
}

function mapStateToProps(state) {
  return { 
    clickableMessages: state.rbfcu.clickableMessages,
    channel: state.rbfcu.channel
  }
}

export default connect(mapStateToProps)(ClickableMessages);