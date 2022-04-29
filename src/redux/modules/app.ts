import { useStore } from 'react-redux';
import { AnyAction } from 'redux';
import { getT } from '../../utils/translateManager';

const SET_URL = 'app.SET_URL';
const SET_APISCOPE = 'app.SET_APISCOPE';

export interface State {
  externalAPIScope: string;
  url: string;
}
const initialState: State = {
  externalAPIScope: '',
  url: ''
};

export default (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case SET_URL:
      return _setUrl(state, action);
    case SET_APISCOPE:
      return _setExternalAPIScope(state, action);
    default:
      return state;
  }
};
const _setUrl = (state: State, action: AnyAction) => {
  return { ...state, ...action.payload };
};
const _setExternalAPIScope = (state: State, action: AnyAction) => {
  return { ...state, ...action.payload };
};

const setUrl = (url: string) => {
  return {
    type: SET_URL,
    payload: {
      url
    }
  };
};
const setExternalAPIScope = (externalAPIScope: string) => {
  return {
    type: SET_APISCOPE,
    payload: {
      externalAPIScope
    }
  };
};

export const actionCreators = {
  setUrl,
  setExternalAPIScope
};
