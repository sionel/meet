//#region Action Types

import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../configureStore';

export interface Initialstate {
  jitsiId: string;
  mode: 'track' | 'sketch' | 'document' | 'screen';
}

//#region Initial State

const initialState: Initialstate = {
  jitsiId: '',
  mode: 'track'
};

//#endregion

//#region reducer

function reducer(state = initialState, action: AnyAction) {
  switch (action.type) {
    default:
      return state;
  }
}

export const actionCreators = {
};

export default reducer;
