import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import ConferenceConnector from '../../utils/conference/ConferenceConnector';
import Connection from '../../utils/conference/Connection';
import { RootState } from '../configureStore';

const SET_JOIN = 'conferenceManager.SET_JOIN';

export interface state {
  roomToken: string;
  roomName: string;
  connection: any;
  conferenceConnector: any;
  room: any;
  tracks: any;
}

const initialState: state = {
    roomToken: '',
    roomName: '',
    connection : null,
    conferenceConnector: null,
    room: null,
    tracks: null
};

const reducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    default:
      return state;
  }
};


const join = (roomName: string, token: string, tracks: any, attributes: any) => {
    return {
        type: SET_JOIN,
        roomName,
        token,
        tracks,
        attributes,
    }
}

const _setJoin = (state: state, action: AnyAction) => {
    const {roomName, token, tracks, attributes} = action;
    let _connection = new Connection();
    let _conferenceConnector = new ConferenceConnector();




    return { 
        ...state,
        roomName: roomName.toLowerCase(),
        token,
        tracks
    }
    
}