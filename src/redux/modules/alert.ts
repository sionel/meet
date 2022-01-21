/* 
  <CustomAlert
    visible={alertVisible.visible}
    width={320}
    title={alertVisible.title}
    description={
      alertVisible.message
    }
    onClose={alertVisible.onClose}
    actions={alertVisible.actions}
  />
*/
import { useStore } from 'react-redux';
import { AnyAction } from 'redux';
import { getT } from '@utils/translateManager';
// import { useTranslation } from 'react-i18next';

const SET_ALERT = 'alert.SET_ALERT';
const RESET_ALERT = 'alert.RESET_ALERT';

export interface params {
  title: string;
  type: 1 | 2;
  message: string;
  onConfirm?: () => void;
  onCencel?: () => void;
}
const initialState = {
  visible: false,
  title: '',
  message: '',
  onClose: () => {},
  actions: [],
  test: true
};
/*
 actions = [
  {
    name: '확인',
    action: () => {}
  },
  {
    name: '취소',
    action: () => {}
  }
 ]  
*/

export default (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case SET_ALERT:
      return { ...action.payload };
    case RESET_ALERT:
      return { ...initialState };
    case 'TTTEST':
      return;
    default:
      return state;
  }
};

const resetAlert = () => {
  return {
    type: RESET_ALERT
  };
};

const setAlert = (params: params) => {
  const {
    title,
    type = 1,
    message,
    onConfirm = resetAlert,
    onCencel = resetAlert
  } = params;
  let onClose = () => {};
  let actions: any = [];
  const t = getT();

  if (type === 1) {
    // 확인밖에 없으니 닫음에 컨펌을 넣음
    onClose = onConfirm;
    actions = [
      {
        name: t('alert_button_confirm'),
        action: onConfirm
      }
    ];
  } else if (type === 2) {
    // 취소가 생겼으니 닫음에 취소를 넣음
    onClose = onCencel;
    actions = [
      {
        name: t('alert_button_confirm'),
        action: onConfirm
      },
      {
        name: t('alert_button_cancel'),
        action: onCencel
      }
    ];
  }

  return {
    type: SET_ALERT,
    payload: {
      visible: true,
      title,
      message,
      onClose,
      actions
    }
  };
};

export const actionCreators = {
  setAlert,
  resetAlert
};
