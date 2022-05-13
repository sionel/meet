import Conference from '@screens/ConferenceScreen_New/conferenceUtil/Conference';
import { MediaStreamTrackState, RTCViewProps } from 'react-native-webrtc';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../configureStore';
import { MobileInfoType, WebInfoType } from './participants';
import { Participant } from './participants_copy';

const SET_LIST = 'conference.SET_LIST';
const SET_INITIAL_LIST = 'conference.SET_INITIAL_LIST';
const SET_ROOM_ID = 'conference.SET_ROOM_ID';
const SET_ROOM = 'conference.SET_ROOM';
const SET_DRAWING = 'conference.SET_DRAWING';
const SET_IS_CONFERENCE = 'conference.SET_IS_CONFERENCE';
const SET_TOP_DISPLAY_TYPE = 'conference.SET_TOP_DISPLAY_TYPE';
const SET_BOTTOM_DISPLAY_TYPE = 'conference.SET_BOTTOM_DISPLAY_TYPE';
const SET_VIDEO_STATE = 'conference.SET_VIDEO_STATE';
const SET_MIKE_STATE = 'conference.SET_MIKE_STATE';
const SET_IS_SPEAKER_ON = 'conference.SET_IS_SPEAKER_ON';
const SET_IS_BT_ON = 'conference.SET_IS_BT_ON';
const SET_FACING_MODE = 'conference.SET_FACING_MODE';
const SET_MIRROR_MODE = 'conference.SET_MIRROR_MODE';
const SET_EXPIRE_TIME = 'conference.SET_EXPIRE_TIME';
const MESSAGE_RECEIVED = 'conference.MESSAGE_RECEIVED';
const INIT_MESSAGES_COUNT = 'conference.INIT_MESSAGES_COUNT';
const SET_EXTERNAL = 'conference.SET_EXTERNAL';
const SET_IS_MUTE_MIKE = 'conference.SET_IS_MUTE_MIKE';
// const SET_IS_KICK = 'conference.SET_IS_KICK';

const RESET_RESOURCE = 'conference.RESET_RESOURCE';

export type messageType = {
  user: string;
  name: string;
  profileUrl: string;
  text: string;
  date: string;
  isRead: boolean;
};
export interface state {
  roomId: string;
  room: Conference | undefined;
  // drawing: any;
  // isConference: boolean;
  topDisplayType: 'FUNCTION' | 'NAME';
  bottomDisplayType: 'MENU' | 'CHATTING' | 'PARTICIPANTS' | 'FILELIST' | 'NONE';
  videoState: any;
  mikeState: any;
  isSpeakerOn: boolean;
  isBtOn: boolean;
  isMuteMike: boolean;
  facingMode: 'FRONT' | 'BACK';
  mirrorMode: boolean;
  expireTime: number | null;
  messages: messageType[];
  externalAPIScope: string;
  // isKick: string | undefined;
}

const initialState: state = {
  roomId: '',
  room: undefined,
  // drawing: undefined,
  // isConference: false,
  topDisplayType: 'FUNCTION',
  bottomDisplayType: 'NONE',
  videoState: undefined,
  mikeState: undefined,
  isSpeakerOn: false,
  isBtOn: false,
  isMuteMike: false,
  facingMode: 'FRONT',
  mirrorMode: false,
  expireTime: null,
  messages: [],
  externalAPIScope: ''
  // isKick: undefined
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
    // case SET_DRAWING:
    //   return _setDrawing(state, action);
    // case SET_IS_CONFERENCE:
    //   return _setIsConference(state, action);
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
    case SET_EXTERNAL:
      return _setExternalAPI(state, action);
    case SET_IS_MUTE_MIKE:
      return _setIsMuteMike(state, action);
    case MESSAGE_RECEIVED:
      return _setMessage(state, action);
    case INIT_MESSAGES_COUNT:
      return _initMessagesCount(state);
    case RESET_RESOURCE:
      return _resetResource(state);

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

// const setDrawing = (drawing: any) => {
//   return {
//     type: SET_DRAWING,
//     drawing
//   };
// };
// const _setDrawing = (state: state, action: AnyAction) => {
//   return { ...state, drawing: action.drawing };
// };

// function setIsConference(isConference: boolean) {
//   return {
//     type: SET_IS_CONFERENCE,
//     isConference
//   };
// }
// const _setIsConference = (state: state, action: AnyAction) => {
//   return { ...state, isConference: action.isConference };
// };

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
  displayType: 'MENU' | 'CHATTING' | 'PARTICIPANTS' | 'FILELIST' | 'NONE'
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

const receivedMessage = (newMessage: {
  user: any;
  text: string;
  date: string;
  isRead: boolean;
}): ThunkAction<void, RootState, unknown> => {
  return async (dispatch, getState) => {
    dispatch({
      type: MESSAGE_RECEIVED,
      newMessage,
      participants: getState()['participants_copy'].list
    });
  };
};

const _setMessage = (state: state, action: AnyAction) => {
  const { newMessage, participants } = action;
  const { messages } = state;

  const sendUserInfo: Participant = participants.find(
    (v: Participant) => v.jitsiId === newMessage.user
  );

  const messageList = messages.slice(0);
  messageList.push({
    ...newMessage,
    name: sendUserInfo.name,
    profileUrl: sendUserInfo.profileUrl
  });

  return {
    ...state,
    messages: messageList
  };
};

const initMessagesCount = () => {
  return {
    type: INIT_MESSAGES_COUNT
  };
};
const _initMessagesCount = (state: state) => {
  const { messages } = state;
  const messagesList = messages.slice(0);
  messages.forEach(message => {
    if (message.isRead === false) {
      message.isRead = true;
    }
  });
  return { ...state, messages: messagesList };
};

const setExternalAPI = (externalAPI: string) => {
  return {
    type: SET_EXTERNAL,
    externalAPI
  };
};

const _setExternalAPI = (state: state, action: AnyAction) => {
  const { externalAPIScope } = action;
  return {
    ...state,
    externalAPIScope
  };
};

const setIsMuteMike = (flag?: boolean) => {
  return {
    type: SET_IS_MUTE_MIKE,
    flag
  };
};

const _setIsMuteMike = (state: state, action: AnyAction) => {
  const { mikeState } = state;
  const { flag } = action;

  const currentMute = typeof flag === 'undefined' ? mikeState.isMute() : !flag;

  if (currentMute) {
    mikeState.unmute();
  } else {
    mikeState.mute();
  }
  return {
    ...state,
    mikeState,
    isMuteMike: !currentMute
  };
};

const resetResource = () => {
  return {
    type: RESET_RESOURCE
  };
};
const _resetResource = (state: state) => {
  const { mikeState, videoState } = state;
  videoState && videoState.dispose();
  mikeState && mikeState.dispose();

  return { ...state, externalAPIScope: state.externalAPIScope };
};

export const actionCreators = {
  setRoomId,
  setRoom,
  // setDrawing,
  // setIsConference,
  setTopDisplayType,
  setBottomDisplayType,
  setVideoState,
  setMikeState,
  setIsSpeakerOn,
  setIsBtOn,
  setIsMuteMike,
  setFacingMode,
  setMirrorMode,
  setExpireTime,
  receivedMessage,
  initMessagesCount,
  resetResource,
  setExternalAPI
};
export default reducer;
