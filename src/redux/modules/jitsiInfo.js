/**
 * Actions
 */
const SET_JITSI_ID = "SET_JITSI_ID";

// END Actions

/**
 * initialState
 */
const initialState = {
  userInfo: [],
};
// END inititlState

/**
 * reducer
 */
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_JITSI_ID:
      return applySetJitsiId(state, action);

    default:
      return state;
  }
};
// END reducer

/**
 * region start
 */

// region SET_JITSI_ID
const setJitsiId = (
  _type,
  jitsiId,
  wehagoId = undefined,
  isLocalUser = false
) => {
  return {
    type: SET_JITSI_ID,
    _type,
    jitsiId,
    wehagoId,
    isLocalUser,
  };
};

const applySetJitsiId = (state, action) => {
  const { userInfo: prevUserInfo } = state;
  const { _type, jitsiId, wehagoId, isLocalUser } = action;

  let userInfo = prevUserInfo;
  const id = isLocalUser ? "localUser" : jitsiId;
  // 타입이 JOIN일 경우 추가
  if (_type === "JOIN") {
    if (!prevUserInfo.find((user) => user.jitsiId === jitsiId)) {
      userInfo = [...prevUserInfo, { jitsiId, wehagoId, id }];
    }
  }

  // 타입이 LEFT 일 경우 리스트 제외
  if (_type === "LEFT") {
    userInfo = prevUserInfo.filter((user) => user.jitsiId !== jitsiId);
  }

  return {
    ...state,
    userInfo,
  };
};
// end region SET_JITSI_ID
// END region

/**
 * export
 */
export const actionCreators = {
  setJitsiId,
};

export default reducer;
