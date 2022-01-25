import { AnyAction } from 'redux';

const SET_RECENTS = 'recentInvited.SET_RECENTS';
const RESET_RECENTS = 'recentInvited.RESET_RECENTS';

export interface state {
  recents: any[];
}
const initialState: state = {
  recents: []
};

function reducer(state: state = initialState, action: AnyAction) {
  switch (action.type) {
    case SET_RECENTS:
      return _setRecents(state, action);
    case RESET_RECENTS:
      return _resetRecents(state, action);
    default:
      return state;
  }
}

//TODO: 조직도에 이메일 초대부분 추후 수정 예정
const setRecents = (recent: Object) => {
  return {
    type: SET_RECENTS,
    recent
  };
};
const _setRecents = (state: state, action: any) => {
  const { recent } = action;
  const recentList = state.recents;

  let idx: number = recentList.findIndex((i: any) => i.value === recent.value);
  if (idx !== -1) {
    const fixList = recentList.filter((v: any, i: number) => i !== idx);
    fixList.push(recent);
    return {
      ...state,
      recents: fixList
    };
  } else {
    recentList.push(recent);
    return {
      ...state,
      recents: recentList
    };
  }
};

const resetRecents = () => {
  return {
    type: RESET_RECENTS
  };
};

const _resetRecents = (state: state, action: any) => ({
  ...state,
  recents: []
});

export const actionCreators = {
  setRecents,
  resetRecents
};
export default reducer;
