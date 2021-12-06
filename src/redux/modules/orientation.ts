import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { RootState } from '../configureStore';

const SET = 'orientation.SET_ORIENTATION';
const STAY = 'orientation.STAY_ORIENTATION';

export interface state {
  orientation: 'vertical' | 'horizontal';
  isHorizon: boolean;
}
const initialState: state = {
  orientation: 'vertical',
  isHorizon: false
};

const reducer: (state: state, action: AnyAction) => state = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case SET:
      return _setOrientation(state, action);
    case STAY:
      return { ...state };
    default:
      return state;
  }
};

const setOrientation = (state: string) => {
  switch (state) {
    case 'LANDSCAPE-LEFT':
    case 'LANDSCAPE-RIGHT':
      state = 'horizontal';
      break;
    case 'PORTRAIT':
    case 'PORTRAIT-UPSIDEDOWN':
      state = 'vertical';
      break;
    default:
      return { // 다른 이상한 값이 들어오면 lock 시키도록 
        type: STAY
      };
  }
  const isHorizon = state === 'horizontal' ? true : false;
  return {
    type: SET,
    state,
    isHorizon
  };
};
const _setOrientation = (state: state, action: AnyAction) => ({
  ...state,
  orientation: action.state,

  isHorizon: action.isHorizon
});

export const actionCreators = {
  setOrientation
};
export default reducer;
