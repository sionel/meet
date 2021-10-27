import { useStore } from 'react-redux';
import { getT } from '../../utils/translateManager';

const SET_INDICATOR = 'indicator.SET_INDICATOR';
const RESET_INDICATOR = 'indicator.RESET_INDICATOR';

export interface state {
  visible: boolean;
  message: string;
}

const initialState: state = {
  visible: false,
  message: ''
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_INDICATOR:
      return { ...action.payload };
    case RESET_INDICATOR:
      return { ...initialState };
    case 'TTTEST':
      return;
    default:
      return state;
  }
};

const resetIndicator = () => {
  return {
    type: RESET_INDICATOR
  };
};

const setIndicator = message => {
  return {
    type: SET_INDICATOR,
    payload: {
      visible: true,
      message
    }
  };
};

export const actionCreators = {
  setIndicator,
  resetIndicator
};
