//#region Toast

const TOAST_MESSAGE = 'master.TOAST_MESSAGE';

const initialState = {
  messageFlag: false,
  toastMessage: ''
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case TOAST_MESSAGE:
      return {
        ...state,
        messageFlag: !state.messageFlag,
        toastMessage: action.toastMessage
      };
    default:
      return state;
  }
}

function setToastMessage(toastMessage) {
  return dispatch => {
    dispatch({
      type: TOAST_MESSAGE,
      toastMessage
    });
  };
}

export const actionCreators = {
  setToastMessage
};

export default reducer;

//#endregion
