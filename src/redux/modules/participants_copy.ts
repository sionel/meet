import { actionCreators as mainUserActionCreators } from './mainUser';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../configureStore';


export interface Participant {

  // isMainUser:boolean

  jitsiId: string;
  // isLocal: false,
  // name: string,
  // isMuteVideo: false,
  videoTrack: any;
  audioTrack: any;

  wehagoUserInfo: null;

  isMaster : boolean
}
export interface InitialState {
  list: Participant[];
}
const initialState: InitialState = {
  list: []
};


function reducer(state = initialState, action: AnyAction) {
  switch (action.type) {
    default:
      return state;
  }
}


export const actionCreators = {
  
};

export default reducer;
