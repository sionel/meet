import { actionCreators as testAction } from '@redux/test';
import { actionCreators as participantsActions } from '@redux/participants_copy';
import { actionCreators as mainuserActions } from '@redux/mainUser_copy';
import { actionCreators as conferenceActions } from '@redux/conference';
import { actionCreators as documentShareActions } from '@redux/documentShare';
import { actionCreators as masterAction } from '@redux/master';

export const ConferenceHandler = (dispatch: any) => ({
  test: () => {
    dispatch(testAction.test());
  },
  joinUser: (user: any) => {
    // dispatch(participantsActions.joinUser(user));
  },
  setUserInfo: (user: any) => {
    dispatch(participantsActions.setUserInfo(user));
  },
  setUserTrack: (track: any) => {
    dispatch(participantsActions.setUserTrack(track));
  },
  setMainUser: (jitsiId: string) => {
    dispatch(mainuserActions.setMainUser(jitsiId));
  },
  setMessage: (user: any, text: string, date: string) => {
    if (date) return;
    const message = {
      user,
      text,
      date: new Date().toISOString(),
      isRead: false
    };
    dispatch(conferenceActions.receivedMessage(message));
  },
  changeDrawingShareMode: (
    isDrawingShare: boolean,
    presenter: string,
    page: number,
    documentData: any
  ) => {
    dispatch(
      documentShareActions.setSharingMode(
        isDrawingShare ? { resources: '[]' } : false,
        isDrawingShare ? presenter : '',
        0, // page
        documentData //documentData
      )
    );
  },
  changeDrawData: (drawData: any, selectResource: number) => {
    dispatch(documentShareActions.setDrawData(drawData, selectResource));
  }
});

// ConferenceDispatch;

export type ConferenceHandler = ReturnType<typeof ConferenceHandler>;
