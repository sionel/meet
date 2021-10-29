import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { RootState } from '../configureStore';

const SET = 'orientation.SET_ORIENTATION';

export interface state {
  orientation: 'vertical' | 'horizontal';
}
const initialState: state = {
  orientation: 'vertical'
};

const reducer: (state: state, action: AnyAction) => state = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case SET:
      return _setOrientation(state, action);
    default:
      return state;
  }
};

const setOrientation = (state: string) => {
  switch (state) {
    case 'PORTRAIT':
    case 'PORTRAIT-UPSIDEDOWN':
      state = 'vertical';
      break;
    case 'LANDSCAPE-LEFT':
    case 'LANDSCAPE-RIGHT':
      state = 'horizontal';
      break;
  }

  return {
    type: SET,
    state
  };
};
const _setOrientation = (state, action) => ({
  ...state,
  orientation: action.state
});

export const actionCreators = {
  setOrientation
};
export default reducer;
