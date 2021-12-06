import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

const SET = 'screenShage.SET';
const TOGGLE = 'screenShage.TOGGLE';
import { RootState } from '../configureStore';

export interface state {
  isScreenShare: boolean;
  screenToggleFlag: boolean;
}
const initialState: state = {
  isScreenShare: false,
  screenToggleFlag: false
};
//localActionCreators.toggleCameraFacingMode()
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

const toggleScreenFlag = (): ThunkAction<void, RootState, unknown> => {
  return dispatch => {
    dispatch({
      type: TOGGLE
    });
  };
};
const _toggleScreenFlag = (state:state) => ({
  ...state,
  screenToggleFlag: !state.screenToggleFlag
});

const setScreenFlag = (
  flag: boolean
): ThunkAction<void, RootState, unknown> => {
  return async (dispatch, getState) => {
    const local = getState().local;
    // 카메라가 back를 보는 도중에 화면공유를 하는 경우 다시 복구가 안됨
    if (local.facingMode === 'back')
      dispatch({ type: 'local.TOGGLE_CAMERA_FACING_MODE' });

    dispatch({
      type: SET,
      flag
    });
  };
};
const _setScreenFlag = (state:state, action:AnyAction) => ({
  ...state,
  isScreenShare: action.flag
});

export const actionCreators = {
  toggleScreenFlag,
  setScreenFlag
};
export default reducer;
