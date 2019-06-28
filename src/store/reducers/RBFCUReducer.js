/*
  This is a custom reducer example and you can delete it at any time. It is
  added into the root reducer with a call to FlextendedState.addReducer().

  It manages a slice of Redux state composed of a simple object with a 'flag'
  boolean property.

  It handles a single action -- 'MY_CUSTOM_ACTION' -- which sets the flag
  value. This action is dispatched from the CustomActionButton.
*/
const initialState = {
  listeners: false,
  channel: null,
  unreadCount: 0,
  agentJoined: false,
  showSpinner: false
};

const RBFCUReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_RBFCU_CHANNEL_LISTENERS':
      return {
        ...state,
        listeners: action.payload.listeners
      };
    case 'SET_RBFCU_CHANNEL':
      return {
        ...state,
        channel: action.payload.channel
      };
    case 'SET_RBFCU_UNREAD_COUNT':
      return {
        ...state,
        unreadCount: action.payload.unreadCount
      };
    case 'SET_RBFCU_AGENT_JOINED':
      return {
        ...state,
        agentJoined: action.payload.agentJoined
      };
    case 'SET_RBFCU_SHOW_SPINNER':
      return {
        ...state,
        showSpinner: action.payload.showSpinner
      };
    default:
      return state;
  }
};

export default RBFCUReducer;