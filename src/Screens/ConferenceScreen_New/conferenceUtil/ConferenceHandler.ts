import { actionCreators as testAction } from '@redux/test';
import { actionCreators as participantsAction } from '@redux/participants_copy';

export const ConferenceHandler = (dispatch: any) => ({
  test: () => {
    dispatch(testAction.test());
  },
  joinUser: (user: any) => {
    // dispatch(participantsAction.joinUser(user));
  },
  setUserInfo: (user:any) => {
    dispatch(participantsAction.setUserInfo(user));
  },
  setUserTrack: (track: any) => {
    dispatch(participantsAction.setUserTrack(track));
  }
});

// ConferenceDispatch;

export type ConferenceHandler = ReturnType<typeof ConferenceHandler>;
