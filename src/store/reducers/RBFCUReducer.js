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
  showFindingAgent: false,
  showSpinner: false,
  clickableMessages: []
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
    case 'SET_RBFCU_FINDING_AGENT':
      return {
        ...state,
        showFindingAgent: action.payload.showFindingAgent
      };
    case 'SET_RBFCU_SHOW_SPINNER':
      return {
        ...state,
        showSpinner: action.payload.showSpinner
      };
    case 'SET_RBFCU_SHOW_CLICKABLE_MESSAGES':
      return {
        ...state,
        clickableMessages: action.payload.clickableMessages
      }
    default:
      return state;
  }
};

export default RBFCUReducer;