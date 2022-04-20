import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../configureStore';

const SET_LIST = 'conference.SET_LIST';
const SET_INITIAL_LIST = 'conference.SET_INITIAL_LIST';
const SET_ROOM_ID = 'conference.SET_ROOM_ID';
const SET_IS_CONFERENCE = 'conference.SET_IS_CONFERENCE';
const SET_TOPDISPLAY_TYPE = 'conference SET_TOPDISPLAY_TYPE';
const SET_MAINDISPLAY_TYPE = 'conference SET_MAINDISPLAY_TYPE';

export interface state {
  roomId: string;
  isConference: boolean;
  topDisplayType: 'FUNCTION' | 'NAME';
  mainDisplayType:
    | 'CHARACTER'
    | 'RTCVIEW'
    | 'SCREENSHARE'
    | 'DOCUMENTSHARE'
    | 'SKETCH';
}

const initialState: state = {
  roomId: '',
  isConference: false,
  topDisplayType: 'FUNCTION',
  mainDisplayType: 'CHARACTER'
};

const reducer: (state: state, action: AnyAction) => state = (
  state = initialState,
  action: AnyAction
) => {
  switch (action.type) {
    case SET_ROOM_ID:
      return _setRoomId(state, action);
    case SET_IS_CONFERENCE:
      return _setIsConference(state, action);
    case SET_TOPDISPLAY_TYPE:
      return _setTopDisplayType(state, action);
    case SET_MAINDISPLAY_TYPE:
      return _setMainDisplayType(state, action);
    // case SET_LIST:
    //   return { ...state, list: action.list };
    // case SET_INITIAL_LIST:
    //   return { ...state, list: [] };
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

function setIsConference(isConference: boolean) {
  return {
    type: SET_IS_CONFERENCE,
    isConference
  };
}
const _setIsConference = (state: state, action: AnyAction) => {
  return { ...state, isConference: action.isConference };
};

const setTopDisplayType = (displayType: 'FUNCTION' | 'NAME') => {
  return {
    type: SET_TOPDISPLAY_TYPE,
    displayType
  };
};
const _setTopDisplayType = (state: state, action: AnyAction) => {
  return { ...state, topDisplayType: action.displayType };
};

const setMainDisplayType = (
  displayType:
    | 'CHARACTER'
    | 'RTCVIEW'
    | 'SCREENSHARE'
    | 'DOCUMENTSHARE'
    | 'SKETCH'
) => {
  return {
    type: SET_MAINDISPLAY_TYPE,
    displayType
  };
};
const _setMainDisplayType = (state: state, action: AnyAction) => {
  return { ...state, mainDisplayType: action.displayType };
};

export const actionCreators = {
  setRoomId,
  setIsConference,
  setTopDisplayType,
  setMainDisplayType
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
