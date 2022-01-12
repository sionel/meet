import { useDispatch } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import ConferenceManager from '../../utils/conference/ConferenceManager';
import { RootState } from '../configureStore';

const SET_LIST = 'conference.SET_LIST';
const SET_INITIAL_LIST = 'conference.SET_INITIAL_LIST';
const SET_ROOM_ID = 'conference.SET_ROOM_ID';
const SET_IS_CONFERENCE = 'conference.SET_IS_CONFERENCE';
const SET_CONFERENCE_MANAGER = 'conference.SET_CONFERENCE_MANAGER';

export interface state {
  roomId: string;
  isConference: boolean;
  conferenceManager: ConferenceManager | null;
}

const initialState: state = {
  roomId: '',
  isConference: false,
  conferenceManager: null
};

const reducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    // case SET_LIST:
    //   return { ...state, list: action.list };
    // case SET_INITIAL_LIST:
    //   return { ...state, list: [] };
    case SET_ROOM_ID:
      return _setRoomId(state, action);
    case SET_IS_CONFERENCE:
      return _setIsConference(state, action);
    case SET_CONFERENCE_MANAGER:
      return _setConferenceManager(state, action);
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

function setConferenceManager(conferenceManager: ConferenceManager | null) {
  return {
    type: SET_CONFERENCE_MANAGER,
    conferenceManager
  };
}
const _setConferenceManager = (state: state, action: AnyAction) => {
  return { 
    ...state, 
    conferenceManager: action.conferenceManager 
  };
};

export const actionCreators = {
  setRoomId,
  setIsConference,
  setConferenceManager
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
