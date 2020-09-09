/**
 * user
 * user 스토어
 */

// import { UserApi } from '../../services';


const SET_LIST2 = 'SET_LIST2';
const SET_INITIAL_LIST = 'SET_INITIAL_LIST';

//#region Action Creators

/**
 * setList
 */
setList2 = list => {
  return {
    type: SET_LIST2,
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
    case SET_LIST2:
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
  setList2,
  setInitialList
};

export { actionCreators };
export default reducer;

//#endregion Export
