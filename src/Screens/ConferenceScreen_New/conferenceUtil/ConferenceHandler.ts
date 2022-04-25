import { actionCreators as testAction } from '@redux/test';
import { actionCreators as participantsAction } from '@redux/participants_copy';
import { actionCreators as mainuserAction } from '@redux/mainUser_copy';
import { actionCreators as masterAction } from '@redux/master';

export const ConferenceHandler = (dispatch: any) => ({
  test: () => {
    dispatch(testAction.test());
  },
  joinUser: (user: any) => {
    // dispatch(participantsAction.joinUser(user));
  },
  setUserInfo: (user: any) => {
    dispatch(participantsAction.setUserInfo(user));
  },
  setMainUser: (user: any) => {
    dispatch(mainuserAction.setMainUser(user));
  },
  retriveMasters: (token: string) => {
    dispatch(masterAction.checkMasterList(token));
  },
  setUserTrack: (track: any) => {
    dispatch(participantsAction.setUserTrack(track));
  }
});

// ConferenceDispatch;

export type ConferenceHandler = ReturnType<typeof ConferenceHandler>;
