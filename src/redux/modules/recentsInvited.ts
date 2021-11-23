import { AnyAction } from 'redux';

const SET_RECENTS = 'recentInvited.SET_RECENTS';

interface state {
  recents: any[] | null;
}
const initialState: state = {
  recents: null
};

const reducer: (state: state, action: AnyAction) => state = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case SET_RECENTS:
      return _setRecnets(state, action);
    default:
      return state;
  }
};

const setRecnets = (recents: Object) => {
  return {
    type: SET_RECENTS,
    recents,
  };
};
const _setRecnets = (state: state, action: any) => ({
  ...state,
  recents: action.recents
});

export const actionCreators = {
  setRecnets
};
export default reducer;
