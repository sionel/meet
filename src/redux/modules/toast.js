//#region Toast

import { debounce } from 'lodash';
import { getT } from '../../utils/translateManager';

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
    const t = getT();
    const toastMessage = t('toast.master.whobenned')
      .replace('[@master@]', master)
      .replace('[@target@]', target);
    dispath({
      type: TOAST_MESSAGE,
      toastMessage
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
