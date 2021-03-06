import { AnyAction } from 'redux';

import { ThunkAction } from 'redux-thunk';
import { RootState } from '../configureStore';

// const SET_LOADED = 'root.SET_LOADED';
// const SET_DESTINATION = 'root.SET_DESTINATION';
// const SET_PARAMS = 'root.SET_PARAMS';
// const SET_URL = 'root.SET_URL';
const SET_VIDEO_ID = 'root.SET_VIDEO_ID';
const SET_NETWORK = 'root.SET_NETWORK';
const SET_VIDEO_POLICY = 'root.SET_VIDEO_POLICY';

export interface state {
  destination: string | null;
  params: {} | null;
  loaded: boolean | null;
  url: string | undefined;
  videoId: '';
  network: boolean;
  videoPolicy: string;
}

export const rootinitialState: state = {
  destination: '',
  params: {},
  loaded: false,
  url: undefined,
  videoId: '',
  network: true,
  videoPolicy: 'none'
};

export default function reducer(state: state = rootinitialState, action: any) {
  switch (action.type) {
    // case SET_LOADED:
    //   return _applySetLoaded(state, action);
    // case SET_DESTINATION:
    //   return _applySetDestination(state, action);
    // case SET_PARAMS:
    //   return _applySetParams(state, action);
    // case SET_URL:
    //   return _applySetUrl(state, action);
    case SET_VIDEO_ID:
      return _applySetVideoId(state, action);
    case SET_NETWORK:
      return _applySetNetwork(state, action);
    case SET_VIDEO_POLICY:
      return _applySetVideoPolicy(state, action);
    default:
      return state;
  }
}

const setNetwork = (network: boolean) => ({
  type: SET_NETWORK,
  network
});

const _applySetNetwork = (state: any, action: any) => {
  const { network } = action;
  return {
    ...state,
    network
  };
};

// const setLoaded = (loaded: boolean) => ({
//   type: SET_LOADED,
//   loaded
// });

// const _applySetLoaded = (state: any, action: any) => {
//   const { loaded } = action;
//   return {
//     ...state,
//     loaded
//   };
// };
const setVideoId = (videoId: string): ThunkAction<void, RootState, unknown> => {
  return dispatch => {
    dispatch({
      type: SET_VIDEO_ID,
      videoId
    });
    dispatch({
      type: 'conference.SET_ROOM_ID',
      id: videoId
    });
  };
};

const _applySetVideoId = (state: any, action: any) => {
  const { videoId } = action;
  return {
    ...state,
    videoId
  };
};

const setVideoPolicy = (videoPolicy: string) => ({
  type: SET_VIDEO_POLICY,
  videoPolicy
});

const _applySetVideoPolicy = (state: any, action: any) => {
  const { videoPolicy } = action;
  return {
    ...state,
    videoPolicy
  };
};

// const setDestination = (
//   destination: string
// ): ThunkAction<void, RootState, unknown> => {
//   return (dispatch, getState) => {
//     const { videoId } = getState().root;

//     dispatch({
//       type: SET_DESTINATION,
//       destination: videoId ? 'Setting' : destination
//     });
//   };
// };

// const _applySetDestination = (state: any, action: any) => {
//   const { destination } = action;
//   return {
//     ...state,
//     destination
//   };
// };

// const setParams = (params: {}) => ({
//   type: SET_PARAMS,
//   params
// });

// const _applySetParams = (state: any, action: any) => {
//   const { params } = action;
//   return {
//     ...state,
//     params
//   };
// };

// const setUrl = (url: string | undefined) => ({
//   type: SET_URL,
//   url
// });

// const _applySetUrl = (state: any, action: any) => {
//   const { url } = action;
//   return {
//     ...state,
//     url
//   };
// };

export const actionCreators = {
  setVideoId,
  setNetwork,
  setVideoPolicy
};
