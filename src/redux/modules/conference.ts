import Conference from '@screens/ConferenceScreen_New/conferenceUtil/Conference';
import { MediaStreamTrackState, RTCViewProps } from 'react-native-webrtc';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../configureStore';

const SET_LIST = 'conference.SET_LIST';
const SET_INITIAL_LIST = 'conference.SET_INITIAL_LIST';
const SET_ROOM_ID = 'conference.SET_ROOM_ID';
const SET_ROOM = 'conference.SET_ROOM';
const SET_IS_CONFERENCE = 'conference.SET_IS_CONFERENCE';
const SET_TOPDISPLAY_TYPE = 'conference SET_TOPDISPLAY_TYPE';
const SET_MAINDISPLAY_TYPE = 'conference SET_MAINDISPLAY_TYPE';
const SET_VIDEO_STATE = 'conference SET_VIDEO_STATE';
const SET_MIKE_STATE = 'conference SET_MIKE_STATE';
const SET_IS_SPEAKER_ON = 'conference SET_IS_SPEAKER_ON';
const SET_IS_BT_ON = 'conference SET_IS_BT_ON';

export interface state {
  roomId: string;
  room: any;
  isConference: boolean;
  topDisplayType: 'FUNCTION' | 'NAME';
  mainDisplayType:
    | 'CHARACTER'
    | 'RTCVIEW'
    | 'SCREENSHARE'
    | 'DOCUMENTSHARE'
    | 'SKETCH';
  videoState: any;
  mikeState: any;
  isSpeakerOn: boolean;
  isBtOn: boolean;
}

const initialState: state = {
  roomId: '',
  room: undefined,
  isConference: false,
  topDisplayType: 'FUNCTION',
  mainDisplayType: 'CHARACTER',
  videoState: undefined,
  mikeState: undefined,
  isSpeakerOn: false,
  isBtOn: false
};

const reducer: (state: state, action: AnyAction) => state = (
  state = initialState,
  action: AnyAction
) => {
  switch (action.type) {
    case SET_ROOM_ID:
      return _setRoomId(state, action);
    case SET_ROOM:
      return _setRoom(state, action);
    case SET_IS_CONFERENCE:
      return _setIsConference(state, action);
    case SET_TOPDISPLAY_TYPE:
      return _setTopDisplayType(state, action);
    case SET_MAINDISPLAY_TYPE:
      return _setMainDisplayType(state, action);
    case SET_VIDEO_STATE:
      return _setVideoState(state, action);
    case SET_MIKE_STATE:
      return _setMikeState(state, action);
    case SET_IS_SPEAKER_ON:
      return _setIsSpeakerOn(state, action);
    case SET_IS_BT_ON:
      return _setIsBtOn(state, action);

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

const setRoom = (room: Conference) => {
  return {
    type: SET_ROOM,
    room
  };
};
const _setRoom = (state: state, action: AnyAction) => {
  return { ...state, room: action.room };
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

const setVideoState = (videoTrack: any) => {
  return {
    type: SET_VIDEO_STATE,
    videoTrack
  };
};
const _setVideoState = (state: state, action: AnyAction) => {
  return { ...state, videoState: action.videoTrack };
};

const setMikeState = (audioTrack: any) => {
  return {
    type: SET_MIKE_STATE,
    audioTrack
  };
};
const _setMikeState = (state: state, action: AnyAction) => {
  return { ...state, mikeState: action.audioTrack };
};

const setIsSpeakerOn = (isSpeakerOn: boolean) => {
  return {
    type: SET_IS_SPEAKER_ON,
    isSpeakerOn
  };
};
const _setIsSpeakerOn = (state: state, action: AnyAction) => {
  return { ...state, isSpeakerOn: action.isSpeakerOn };
};

const setIsBtOn = (isBtOn: boolean) => {
  return {
    type: SET_IS_BT_ON,
    isBtOn
  };
};
const _setIsBtOn = (state: state, action: AnyAction) => {
  return { ...state, isBtOn: action.isBtOn };
};

export const actionCreators = {
  setRoomId,
  setRoom,
  setIsConference,
  setTopDisplayType,
  setMainDisplayType,
  setVideoState,
  setMikeState,
  setIsSpeakerOn,
  setIsBtOn
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
