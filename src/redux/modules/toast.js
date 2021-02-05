//#region Toast

import { debounce } from 'lodash';

const TOAST_MESSAGE = 'master.TOAST_MESSAGE';

const initialState = {
  toggleFlag: false,
  toastMessage: ''
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case TOAST_MESSAGE:
      return {
        ...state,
        toggleFlag: !state.toggleFlag, //
        toastMessage: action.toastMessage
      };
    default:
      return state;
  }
}

function setToastMessage(toastMessage) {
  return {
    type: TOAST_MESSAGE,
    toastMessage
  };
}

function kickMessage(masterId, targetId) {
  return (dispath, getState) => {
    const users = getState().participants.list;
    let masterNickName = '';
    let masterUserName = '';
    let targetNickName = '';
    let targetUserName = '';
    users.forEach(user => {
      if (user.id === masterId) {
        masterNickName = user.userInfo.nickname;
        masterUserName = user.userInfo.userName;
      } else if (user.id === targetId) {
        targetNickName = user.userInfo.nickname;
        targetUserName = user.userInfo.userName;
      }
    });
    const master = masterNickName
      ? `${masterNickName}(${masterUserName})`
      : masterUserName;
    const target = targetNickName
      ? `${targetNickName}(${targetUserName})`
      : targetUserName;
    dispath({
      type: TOAST_MESSAGE,
      toastMessage: `${master}님께서 ${target}님을 추방하였습니다`
    });
  };
}

export const actionCreators = {
  setToastMessage: debounce(setToastMessage, 100, {
    leading: true,
    trailing: true
  }),
  kickMessage
};

export default reducer;

//#endregion
