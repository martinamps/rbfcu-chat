import React from 'react';
import * as FlexWebChat from "@twilio/flex-webchat-ui";
import { connect } from 'react-redux';
import Utils from './utils/index';

const padding = {
  paddingLeft: '10px',
  paddingRight: '10px',
  display: 'inline-block',
  lineHeight: '3.5'
};

const width100 = {
  position: 'absolute',
  top: '0px',
  left: '0px',
  right: '0px',
  bottom: '0px',
};

const mla = {
  marginLeft: 'auto'
}

const mr10 = {
  marginRight: '10px'
}

const modal = {
  position: 'absolute',
  top: '0px',
  left: '0px',
  right: '0px',
  bottom: '0px',
  background: '#000'
}


class ChatHeader extends React.Component {
  constructor(props) {
    super();
    this.props = props;
    this.endChat = this.endChat.bind(this);
    this.minimize = this.minimize.bind(this);
    this.showConfirm = this.showConfirm.bind(this);
    this.hideConfirm = this.hideConfirm.bind(this);

    this.state = {
      showConfirm: false
    };
  }

  showConfirm() {
    this.setState({
      showConfirm: true
    })
  }

  hideConfirm() {
    this.setState({
      showConfirm: false
    })
  }

  endChat() {
    this.hideConfirm();

    const { token } = this.props.manager.store.getState().flex.session.tokenPayload;

    this.props.manager.store.dispatch({
      type: 'SET_RBFCU_SHOW_SPINNER',
      payload: {
        showSpinner: true
      }
    });

    Utils.pushTaskToWrapping(token, this.props.channel).then(() => {
      window.hideFlex();
      FlexWebChat.Actions.invokeAction('RestartEngagement');
      this.props.manager.store.dispatch({
        type: 'SET_RBFCU_SHOW_SPINNER',
        payload: {
          showSpinner: false
        }
      });
    }).catch((e) => {
      this.props.manager.store.dispatch({
        type: 'SET_RBFCU_SHOW_SPINNER',
        payload: {
          showSpinner: false
        }
      });
      console.error(e);
    })
  }

  minimize() {
    FlexWebChat.Actions.invokeAction('ToggleChatVisibility')
  }

  render() {
    return (
      <div style={ width100 }>
        <FlexWebChat.FlexBox>
          { this.props.showTitle ? <span style={ padding }>{ this.props.titleText }</span> : '' }
          <FlexWebChat.FlexBox>
            <span style={ mla }></span>
            <FlexWebChat.IconButton icon="ArrowDown" onClick={ this.minimize }></FlexWebChat.IconButton>
            <FlexWebChat.IconButton style={ mr10 } icon="Close" onClick={ this.showConfirm }></FlexWebChat.IconButton>
          </FlexWebChat.FlexBox>
        </FlexWebChat.FlexBox>
        { this.state.showConfirm ?
          <div style={ modal }>
            <FlexWebChat.FlexBox>
              <span style={ padding }>Are you sure?</span>
              <FlexWebChat.FlexBox>
                <span style={ mla }></span>
                <FlexWebChat.IconButton icon="Close" onClick={ this.hideConfirm }></FlexWebChat.IconButton>
                <FlexWebChat.IconButton style={ mr10 } icon="Accept" onClick={ this.endChat }></FlexWebChat.IconButton>
              </FlexWebChat.FlexBox>
            </FlexWebChat.FlexBox>
          </div> : null }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { channel: state.rbfcu.channel }
}

export default connect(mapStateToProps)(ChatHeader);