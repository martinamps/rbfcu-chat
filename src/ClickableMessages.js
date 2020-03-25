import React from 'react';
import { connect } from 'react-redux';

const wrapper = {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '440px',
    minWidth: '100px',
    overflowX: 'hidden',
    marginLeft: 'auto',
    marginRight: '0px'
}

const bubble = {
    paddingLeft: '12px',
    paddingRight: '12px',
    color: 'rgb(255, 255, 255)',
    paddingTop: '5px',
    paddingBottom: '8px',
    marginLeft: '32px',
    position: 'relative',
    overflowX: 'hidden',
    display: 'flex',
    flexWrap: 'nowrap',
    boxFlex: '1',
    flexGrow: '1',
    flexShrink: '1',
    flexDirection: 'column',
    background: 'rgb(25, 118, 210)',
    borderRadius: '4px'
}

class ClickableMessages extends React.Component {
  constructor(props) {
    super();
    this.props = props;
  }

  render() {
    const dispatch = this.props.dispatch;
    return (
      this.props.clickableMessages ?
        <div style={wrapper}>
          { this.props.clickableMessages.map(function(m) {
            return (
              <div style={bubble} onClick={(e) => {
                // this removes all the clickable messages
                dispatch({
                  type: 'SET_RBFCU_SHOW_CLICKABLE_MESSAGES',
                  payload: { clickableMessages: [] }
                })
                console.log(`clicked on ${m.key}`)
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
  return { clickableMessages: state.rbfcu.clickableMessages }
}

export default connect(mapStateToProps)(ClickableMessages);