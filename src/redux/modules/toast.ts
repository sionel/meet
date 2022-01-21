//#region Toast

import { debounce } from 'lodash';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { getT } from '../../utils/translateManager';
import { RootState } from '../configureStore';

const TOAST_MESSAGE = 'master.TOAST_MESSAGE';

export interface state {
  toggleFlag: boolean;
  toastMessage: string;
}

const initialState = {
  toggleFlag: false,
  toastMessage: ''
};

function reducer(state = initialState, action:AnyAction) {
  
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

function setToastMessage(toastMessage: string) {
  
  return {
    type: TOAST_MESSAGE,
    toastMessage
  };
}

function kickMessage(targetName: string): ThunkAction<void, RootState, unknown> {
  
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
