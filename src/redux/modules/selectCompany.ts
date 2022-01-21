import { useStore } from 'react-redux';
import { AnyAction } from 'redux';
import { getT } from '@utils/translateManager';

const OPEN_COMPANY = 'selectCompany.OPEN_COMPANY';
const CLOSE_COMPANY = 'selectCompany.CLOSE_COMPANY';

export interface state {
  visible: boolean;
}

const initialState: state = {
  visible: false,
};

export default (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case OPEN_COMPANY:
      return { ...action.payload };
    case CLOSE_COMPANY:
      return { ...initialState };
    default:
      return state;
  }
};

const closeCompany = () => {
  return {
    type: CLOSE_COMPANY
  };
};

const openCompany = () => {
  return {
    type: OPEN_COMPANY,
    payload: {
      visible: true,
    }
  };
};

export const actionCreators = {
  openCompany,
  closeCompany
};
