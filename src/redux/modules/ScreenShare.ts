import { AnyAction } from 'redux';

const SET = 'screenShage.SET';
const TOGGLE = 'screenShage.TOGGLE';

interface state {
  isScreenShare: boolean;
  screenToggleFlag: boolean;
}
const initialState: state = {
  isScreenShare: false,
  screenToggleFlag: false
};

const reducer: (state: state, action: AnyAction) => state = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case SET:
      return _setScreenFlag(state, action);
    case TOGGLE:
      return _toggleScreenFlag(state);
    default:
      return state;
  }
};

const toggleScreenFlag = () => {
  return {
    type: TOGGLE
  };
};
const _toggleScreenFlag = state => ({
  ...state,
  screenToggleFlag: !state.screenToggleFlag
});

const setScreenFlag = (flag: boolean) => {
  return {
    type: SET,
    flag
  };
};
const _setScreenFlag = (state, action) => ({
  ...state,
  isScreenShare: action.flag
});

export const actionCreators = {
  toggleScreenFlag,
  setScreenFlag
};
export default reducer;
