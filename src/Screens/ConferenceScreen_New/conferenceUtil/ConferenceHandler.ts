import { actionCreators as testAction } from '@redux/test';
import { actionCreators as participantsActions } from '@redux/participants_copy';
import { actionCreators as mainuserActions } from '@redux/mainUser_copy';
import { actionCreators as conferenceActions } from '@redux/conference';
import { actionCreators as documentShareActions } from '@redux/documentShare';
import { actionCreators as masterActions } from '@redux/master';
import { actionCreators as toastActions } from '@redux/toast';

export const ConferenceHandler = (dispatch: any, t: any) => ({
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
        isDrawingShare ? true : false,
        isDrawingShare ? presenter : '',
        0, // page
        documentData //documentData
      )
    );
  },
  changeDrawData: (drawData: any, selectResource: number) => {
    dispatch(documentShareActions.setDrawData(drawData, selectResource));
  },
  changeDocumentShareMode: (
    attributes = false,
    presenter = '',
    page = 0,
    documentData = []
  ) => {
    dispatch(
      documentShareActions.setSharingMode(
        attributes,
        presenter,
        page,
        documentData
      )
    );
  },
  changeDocumentPage: (page: number) => {
    dispatch(documentShareActions.setDocumentPage(page));
  },
  changeMicControlModeByMaster: (flag: boolean, iMaster: boolean) => {
    !iMaster && dispatch(masterActions.changeAudioActive(flag));

    const msg = flag
      ? t('toast_master_micoffbymaster') // 마스터가 마이크 비활성화
      : t('toast_master_miconbymaster'); // 마스터가 마이크 활성화
    !iMaster && dispatch(toastActions.setToastMessage(msg));
  },
  changeMicControlUserModeByMaster: (value: any, flag: boolean) => {
    flag && dispatch(masterActions.changeMasterControlMode(value));
    const msg = value
      ? t('toast_master_clton') //발언권 제어 시작
      : t('toast_master_cltoff'); //발언권 제어 종료
    dispatch(toastActions.setToastMessage(msg));
  },
  changeMicMuteByMaster: (flag: boolean) => {
    const msg = flag
      ? t('toast_master_micoffbymaster') // 마스터가 마이크 비활성화
      : t('toast_master_miconbymaster'); // 마스터가 마이크 활성화
    dispatch(toastActions.setToastMessage(msg));
    dispatch(masterActions.changeMuteMicMaster(flag));
  },
  rejectedByMaster: () => {
    dispatch(toastActions.setToastMessage(t('toast_master_denied')));
    dispatch(masterActions.setMicRequest(false));
  },
  requestFloor: (targetUser: any) => {
    dispatch(masterActions.setUserMicRequest(targetUser));
  }
});

// ConferenceDispatch;

export type ConferenceHandler = ReturnType<typeof ConferenceHandler>;
