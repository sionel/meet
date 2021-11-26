import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../configureStore';

const SET_LIST = 'conference.SET_LIST';
const SET_INITIAL_LIST = 'conference.SET_INITIAL_LIST';
const SET_ROOM_ID = 'conference.SET_ROOM_ID';

export interface state {
  roomId: string;
}

const initialState: state = {
  roomId: ''
};

const reducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    // case SET_LIST:
    //   return { ...state, list: action.list };
    // case SET_INITIAL_LIST:
    //   return { ...state, list: [] };
    case SET_ROOM_ID:
      return _setRoomId(state, action);
    default:
      return state;
  }
};

const setRoomId = (id: string) => {
  return {
    type: SET_ROOM_ID,
    id
  };
};
const _setRoomId = (state: state, action: AnyAction) => {
  return { ...state, roomId: action.id };
};

export const actionCreators = {
  setRoomId
};
export default reducer;


// const SET_LIST = 'conference.SET_LIST';
// const SET_INITIAL_LIST = 'conference.SET_INITIAL_LIST';

// //#region Action Creators

// /**
//  * setList
//  */
// setList = list => {
//   return {
//     type: SET_LIST,
//     list
//   };
// };

// setInitialList = () => {
//   return {
//     type: SET_INITIAL_LIST
//   };
// };

// //#endregion

// //#region initialState

// const initialState = {
//   list: []
// };

// //#endregion initialState

// //#region Reducer

// reducer = (state = initialState, action) => {
//   switch (action.type) {
//     case SET_LIST:
//       return { ...state, list: action.list };
//     case SET_INITIAL_LIST:
//       return { ...state, list: [] };
//     default:
//       return state;
//   }
// };

// //#endregion Reducer

// //#region Export

// const actionCreators = {
//   setList,
//   setInitialList
// };

// export { actionCreators };
// export default reducer;

// //#endregion Export
