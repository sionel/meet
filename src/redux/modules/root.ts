import { AnyAction } from 'redux';

const SETROOTSTATE = 'root.SETROOTSTATE';

export interface Rootsstate {
  destination?: string | null | undefined;
  params?: any | null | undefined;
  loaded?: boolean | null | undefined;
  url?: string | null | undefined;
}

export const rootinitialState = {
    destination: '',
    params: {},
    loaded: false,
    url: ''
};

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
  const {
    rstate: { loaded, destination, params }
  } = action;

  return {
    ...state,
    loaded,
    destination,
    params
  };
};

export const actionCreators = {
  setRootState
};
