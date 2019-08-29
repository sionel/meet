/**
 * user
 * user 스토어
 */

// import { UserApi } from '../../services';

const SET_LIST = 'SET_LIST';
const SET_INITIAL_LIST = 'SET_INITIAL_LIST';

//#region Action Creators

/**
 * setList
 */
setList = list => {
  return {
    type: SET_LIST,
    list
  };
};

/**
 * setInitialList
 */
setInitialList = () => {
  return {
    type: SET_INITIAL_LIST
  };
};

//#endregion

//#region initialState

const initialState = {
  list: []
};

//#endregion initialState

//#region Reducer

reducer = (state = initialState, action) => {
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
