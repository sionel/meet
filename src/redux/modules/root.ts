import { AnyAction } from 'redux';

import { ThunkAction } from 'redux-thunk';
import { RootState } from '../configureStore';

const SET_LOADED = 'root.SET_LOADED';
const SET_DESTINATION = 'root.SET_DESTINATION';
const SET_PARAMS = 'root.SET_PARAMS';
const SET_URL = 'root.SET_URL';
const SET_VIDEO_ID = 'root.SET_VIDEO_ID';

// export interface Rootsstate {
//   destination?: string | null;
//   params?: {} | null;
//   loaded?: boolean | null;
//   url?: string | null;
// }

export const rootinitialState = {
  destination: '',
  params: {},
  loaded: false,
  url: undefined,
  videoId: '',
};

export default function reducer(state = rootinitialState, action: any) {
  switch (action.type) {
    case SET_LOADED:
      return _applySetLoaded(state, action);
    case SET_DESTINATION:
      return _applySetDestination(state, action);
    case SET_PARAMS:
      return _applySetParams(state, action);
    case SET_URL:
      return _applySetUrl(state, action);
    case SET_VIDEO_ID:
      return _applySetVideoId(state, action);
    default:
      return state;
  }
}

const setLoaded = (loaded: boolean) => ({
  type: SET_LOADED,
  loaded
});

const _applySetLoaded = (state: any, action: any) => {
  const { loaded } = action;
  return {
    ...state,
    loaded
  };
};
const setVideoId = (videoId: string) => ({
  type: SET_VIDEO_ID,
  videoId
});

const _applySetVideoId = (state: any, action: any) => {
  const { videoId } = action;
  return {
    ...state,
    videoId
  };
};

const setDestination = (destination: string) : ThunkAction<void, RootState, unknown> => {
  return (dispatch, getState) => {
    const {videoId} = getState().root;
    console.log('destination');
    console.log(destination);
    console.log(videoId);
    
    dispatch({
      type: SET_DESTINATION,
      destination: videoId ? 'Setting' : destination
    });
  }
  
};

const _applySetDestination = (state: any, action: any) => {
  const { destination } = action;
  return {
    ...state,
    destination
  };
};

const setParams = (params: {}) => ({
  type: SET_PARAMS,
  params,
});

const _applySetParams = (state: any, action: any) => {
  const { params } = action;
  return {
    ...state,
    params
  };
};

const setUrl = (url: string|undefined) => ({
  type: SET_URL,
  url
});

const _applySetUrl = (state: any, action: any) => {
  const { url } = action;
  return {
    ...state,
    url
  };
};

export const actionCreators = {
  setLoaded,
  setDestination,
  setParams,
  setUrl,
  setVideoId
};
