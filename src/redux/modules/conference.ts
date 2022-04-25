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
const SET_TOP_DISPLAY_TYPE = 'conference SET_TOP_DISPLAY_TYPE';
const SET_BOTTOM_DISPLAY_TYPE = 'conference SET_BOTTOM_DISPLAY_TYPE';
const SET_VIDEO_STATE = 'conference SET_VIDEO_STATE';
const SET_MIKE_STATE = 'conference SET_MIKE_STATE';
const SET_IS_SPEAKER_ON = 'conference SET_IS_SPEAKER_ON';
const SET_IS_BT_ON = 'conference SET_IS_BT_ON';
const SET_FACING_MODE = 'conference SET_FACING_MODE';
const SET_MIRROR_MODE = 'conference SET_MIRROR_MODE';
const SET_EXPIRE_TIME = 'conference.SET_EXPIRE_TIME';

export interface state {
  roomId: string;
  room: any;
  isConference: boolean;
  topDisplayType: 'FUNCTION' | 'NAME';
  bottomDisplayType: 'MENU' | 'CHATTING' | 'PARTICIPANTS' | 'NONE';
  videoState: any;
  mikeState: any;
  isSpeakerOn: boolean;
  isBtOn: boolean;
  facingMode: 'FRONT' | 'BACK';
  mirrorMode: boolean;
  expireTime: number | null;
}

const initialState: state = {
  roomId: '',
  room: undefined,
  isConference: false,
  topDisplayType: 'FUNCTION',
  bottomDisplayType: 'NONE',
  videoState: undefined,
  mikeState: undefined,
  isSpeakerOn: false,
  isBtOn: false,
  facingMode: 'FRONT',
  mirrorMode: false,
  expireTime: null
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
    case SET_TOP_DISPLAY_TYPE:
      return _setTopDisplayType(state, action);
    case SET_BOTTOM_DISPLAY_TYPE:
      return _setBottomDisplayType(state, action);
    case SET_VIDEO_STATE:
      return _setVideoState(state, action);
    case SET_MIKE_STATE:
      return _setMikeState(state, action);
    case SET_IS_SPEAKER_ON:
      return _setIsSpeakerOn(state, action);
    case SET_IS_BT_ON:
      return _setIsBtOn(state, action);
    case SET_FACING_MODE:
      return _setFacingMode(state, action);
    case SET_MIRROR_MODE:
      return _setMirrorMode(state);
    case SET_EXPIRE_TIME:
      return _setExpireTime(state, action);

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
    type: SET_TOP_DISPLAY_TYPE,
    displayType
  };
};
const _setTopDisplayType = (state: state, action: AnyAction) => {
  return { ...state, topDisplayType: action.displayType };
};

const setBottomDisplayType = (
  displayType: 'MENU' | 'CHATTING' | 'PARTICIPANTS' | 'NONE'
) => {
  return {
    type: SET_BOTTOM_DISPLAY_TYPE,
    displayType
  };
};
const _setBottomDisplayType = (state: state, action: AnyAction) => {
  return { ...state, bottomDisplayType: action.displayType };
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

const setFacingMode = (
  facingMode: 'FRONT' | 'BACK'
): ThunkAction<void, RootState, unknown> => {
  return (distpach, getState) => {
    const { list } = getState()['participants_copy'];
    const copyList = list.slice(0);
    copyList[0] && copyList[0].videoTrack._switchCamera();
    distpach({ type: SET_FACING_MODE, facingMode });
  };
};
const _setFacingMode = (state: state, action: AnyAction) => {
  return { ...state, facingMode: action.facingMode };
};

const setMirrorMode = () => {
  return {
    type: SET_MIRROR_MODE
  };
};
const _setMirrorMode = (state: state) => {
  return { ...state, mirrorMode: !state.mirrorMode };
};

const setExpireTime = (
  expireTime: number | null
): ThunkAction<void, RootState, unknown> => {
  return async dispatch => {
    dispatch({
      type: SET_EXPIRE_TIME,
      expireTime
    });
  };
};

function _setExpireTime(state: state, action: AnyAction) {
  const { expireTime } = action;
  return {
    ...state,
    expireTime: expireTime
  };
}

export const actionCreators = {
  setRoomId,
  setRoom,
  setIsConference,
  setTopDisplayType,
  setBottomDisplayType,
  setVideoState,
  setMikeState,
  setIsSpeakerOn,
  setIsBtOn,
  setFacingMode,
  setMirrorMode,
  setExpireTime
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
