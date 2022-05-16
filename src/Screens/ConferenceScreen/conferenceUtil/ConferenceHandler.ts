import { actionCreators as testAction } from '@redux/test';
import { actionCreators as participantsActions } from '@redux/participants_copy';
import { actionCreators as mainuserActions } from '@redux/mainUser_copy';
import { actionCreators as conferenceActions } from '@redux/conference';
import { actionCreators as documentShareActions } from '@redux/documentShare';
import { actionCreators as masterActions, requestUser } from '@redux/master';
import { actionCreators as toastActions } from '@redux/toast';
import { Alert } from 'react-native';

export const ConferenceHandler = (
  dispatch: any,
  t: any,
  token: string,
  endCall: any,
  dispose: any
) => ({
  test: () => {
    dispatch(testAction.test());
  },
  joinUser: (user: any) => {
    // dispatch(participantsActions.joinUser(user));
  },
  leftUser: (id: string) => {
    dispatch(participantsActions.setLeftUser(id));
    dispatch(masterActions.checkMasterList(token));
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
  changeMicControlModeByMaster: (flag: boolean) => {
    dispatch(masterActions.changeAudioActive(flag));
    const msg = flag
      ? t('toast_master_micoffbymaster') // 마스터가 마이크 비활성화
      : t('toast_master_miconbymaster'); // 마스터가 마이크 활성화
    dispatch(toastActions.setToastMessage(msg));
  },
  changeMicControlUserModeByMaster: (value: any) => {
    dispatch(
      masterActions.changeMasterControlMode(value !== undefined ? value : null)
    );
    const msg = value
      ? t('toast_master_clton') //발언권 제어 시작
      : t('toast_master_cltoff'); //발언권 제어 종료
    dispatch(toastActions.setToastMessage(msg));
  },
  changeMicMuteByMaster: (flag: boolean, name?: string) => {
    let message: string;

    if (flag !== undefined) {
      message = flag
        ? t('toast_master_micoffbymaster') // 마스터가 마이크 비활성화
        : t('toast_master_miconbymaster'); // 마스터가 마이크 활성화
      dispatch(toastActions.setToastMessage(message));
      dispatch(masterActions.changeMuteMicMaster(flag));
    } else {
      message = t('toast_speech_finish').replace('[@name@]', name);
      dispatch(toastActions.setToastMessage(message));
    }
  },
  rejectedByMaster: () => {
    dispatch(toastActions.setToastMessage(t('toast_master_denied')));
    dispatch(masterActions.setMicRequest(false));
  },
  requestFloor: (requestUser: requestUser) => {
    dispatch(masterActions.setOtherUserMicRequest(requestUser));
  },
  setRequestList: (jitsiid: string) => {
    dispatch(masterActions.setRequestList(jitsiid));
  },
  changeMasterList: (isRemoveAuth: string | undefined, myCommand: boolean) => {
    dispatch(masterActions.checkMasterList(token));

    if (myCommand) {
      const toastMessage = isRemoveAuth
        ? '마스터 권한을 해제했습니다.'
        : '마스터 권한을 부여했습니다.';

      dispatch(toastActions.setToastMessage(toastMessage));
    }
  },
  requestKick: (
    masterInfo: any,
    targetInfo: any,
    isTargetMe: boolean
  ) => {
    const { name: masterName } = JSON.parse(masterInfo);
    const { name: targetName } = JSON.parse(targetInfo);

    if (isTargetMe) {
      const message = `${masterName} 님이 ${targetName} 님을 \n화상회의방에서 추방하였습니다.`;
      dispose();
      endCall(true);
      Alert.alert(t('추방되었습니다.'), message);
    } else {
      dispatch(toastActions.kickMessage(targetName));
    }
  }
});

// ConferenceDispatch;

export type ConferenceHandler = ReturnType<typeof ConferenceHandler>;
