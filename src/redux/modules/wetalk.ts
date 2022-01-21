/**
 * wetalk
 * wetalk 스토어
 */

//TODO: 현재 사용되는 부분이 없는 스토어

import { AnyAction } from 'redux';

// import { UserApi } from '../../services';

const SET_LIST = 'wetalk.SET_LIST';
const SET_INITIAL_LIST = 'wetalk.SET_INITIAL_LIST';

//#region Action Creators

/**
 * setList
 */
const setList = (list: any) => {
  return {
    type: SET_LIST,
    list
  };
};

/**
 * setInitialList
 */
const setInitialList = () => {
  return {
    type: SET_INITIAL_LIST
  };
};

//#endregion

//#region initialState

export interface state {
  list: any[];
}

const initialState = {
  list: []
};

//#endregion initialState

//#region Reducer

const reducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case SET_LIST:
      return { ...state, list: action.list };
    case SET_INITIAL_LIST:
      return { ...state, list: [] };
    default:
      return state;
  }
};

//#endregion Reducer

//#region Export

const actionCreators = {
  setList,
  setInitialList
};

export { actionCreators };
export default reducer;

//#endregion Export
