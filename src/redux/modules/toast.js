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

function kickMessage(targetName) {
  return (dispath, getState) => {
    const t = getT();
    const toastMessage = targetName + t('toast_master_whobenned')
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
