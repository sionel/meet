import { AnyAction } from 'redux';

const SET = 'record.SET_SESSIONID';

interface state {
  sessionId: string | null;
}
const initialState: state = {
  sessionId: null
};

const reducer: (state: state, action: AnyAction) => state = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case SET:
      return _setsessionId(state, action);
    default:
      return state;
  }
};

const setsessionId = (id: string) => {
  return {
    type: SET,
    id
  };
};
const _setsessionId = (state: state, action: AnyAction) => ({
  ...state,
  sessionId: action.id
});

export const actionCreators = {
  setsessionId
};
export default reducer;
