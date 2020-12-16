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

const SET_ALERT = 'SET_ALERT';
const RESET_ALERT = 'RESET_ALERT';

const initialState = {
  visible: false,
  title: '',
  message: '',
  onClose: () => {},
  actions: []
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

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_ALERT:
      return { ...action.payload };
    case RESET_ALERT:
      return { ...initialState };
    default:
      return state;
  }
};

const resetAlert = () => {
  return {
    type: RESET_ALERT
  };
};

const setAlert = params => {
  const { title, type = 1, message, onConfirm, onCencel = () => {} } = params;
  let onClose = () => {};
  let actions = [];

  if (type === 1) {
    // 확인밖에 없으니 닫음에 컨펌을 넣음
    onClose = onConfirm;
    actions = [
      {
        name: '확인',
        action: () => {
          resetAlert();
          onConfirm;
        }
      }
    ];
  } else if (type === 2) {
    // 취소가 생겼으니 닫음에 취소를 넣음
    onClose = onCencel;
    actions = [
      {
        name: '확인',
        action: () => {
          resetAlert();
          onConfirm;
        }
      },
      {
        name: '취소',
        action: () => {
          resetAlert();
          onCencel;
        }
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
  setAlert
};
