import { AnyAction } from 'redux';

import { ThunkAction } from 'redux-thunk';
import { RootState } from '../configureStore';

const SETROOTSTATE = 'root.SETROOTSTATE';

export interface Rootsstate {
  destination?: string | null;
  params?: {} | null;
  loaded?: boolean | null;
  url?: string | null;
}

export const rootinitialState = {
  destination: '',
  params: {},
  loaded: false,
  url: ''
};

//앱을 백그라운드에 넘기고 위하고에서 다시 미트로?

export default function reducer(state = rootinitialState, action: any) {
  switch (action.type) {
    case SETROOTSTATE:
      return applySetRootState(state, action);
    default:
      return state;
  }
}

const setRootState = (rstate: Rootsstate) => ({
  type: SETROOTSTATE,
  rstate
});

const applySetRootState = (state: any, action: AnyAction) => {
  let {
    rstate: { loaded, destination, params, url }
  } = action;
  
  if (loaded === undefined) {
    loaded = true;
  } 
  if (destination === undefined) {
    destination = '';
  } 
  if (params === undefined) {
    params = {}
  } 
  if (url === undefined) {
    url = '';
  }

  return {
    ...state,
    loaded,
    destination,
    params,
    url
  };
};

export const actionCreators = {
  setRootState
};
