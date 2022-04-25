// import JitsiMeetJS from '@jitsi/base/lib-jitsi-meet';
// import config from './config';
// import Connection from './Connection';
// import ConferenceConnector from './ConferenceConnector';
// import { actionCreators as localActionCreators } from '@redux/local';
// import { actionCreators as mainUserActionCreators } from '@redux/mainUser';
// import { actionCreators as participantsAcionCreators } from '@redux/participants';
// import { actionCreators as DocumentShareAcionCreators } from '@redux/documentShare';
// import { actionCreators as WedriveAcionCreators } from '@redux/wedrive';
// import { actionCreators as masterAcionCreators } from '@redux/master';
// import { actionCreators as toastAcionCreators } from '@redux/toast';
// import { actionCreators as alertAcionCreators } from '@redux/alert';
// import { actionCreators as indicatorAcionCreators } from '@redux/indicator';
// import { MeetApi } from '@services/index';
// import { ConferenceHandler } from './ConferenceHandler';
// import Conference from './Conference';

// class ConferenceManager {
//   private static instance: ConferenceManager;
//   private _handler: ConferenceHandler;
//   private _conferenceParams: { roomToken: string; roomId: string };
//   private _conference: any;
//   private _room: any;
//   constructor(
//     conferenceParams: { roomToken: string; roomId: string },
//     dispatch: any
//   ) {
//     this._conferenceParams = conferenceParams;
//     this._handler = ConferenceHandler(dispatch);
//     ConferenceManager.instance = this;
//   }

//   join = async () => {
//     this._init();
//     this._conference = new Conference(this._conferenceParams, this._handler);
//     await this._conference.connect();
//     await this._conference.join();

//     this._roomToken = token;
//     this._roomName = roomName.toLowerCase();
//     // 초기화
//     // 대화방 연결을 위한 Connection
//     this._connection = new Connection();
//     // 대화방 연결을 위한 ConferenceConnector
//     this._conferenceConnector = new ConferenceConnector(this.handler);
//     // connection 연결
//     await this._connection.connect(roomName.toLowerCase(), token);
//     // 대화방 참가
//     this._room = await this._conferenceConnector.connect(
//       this._connection,
//       roomName.toLowerCase(),
//       tracks,
//       attributes
//     );
//     this.tracks = tracks;
//     this._dispatch(masterAcionCreators.checkMasterList(this._roomToken));
//     if (this._room) return true;
//     else return false;
//   };

//   _init = () => {
//     // JitsiMeetJS 를 초기화 한다.
//     JitsiMeetJS.init({
//       ...config
//     });
//     JitsiMeetJS.isDesktopSharingEnabled();

//     // JitsiMeetJS Log Level을 설정한다.
//     JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);
//   };

//   // sendNative = (ExternalAPI, externalAPIScope, roomId) => {
//   //   ExternalAPI.sendEvent(
//   //     'CONFERENCE_JOINED',
//   //     {
//   //       url: `https://video.wehago.com/${roomId}`
//   //     },
//   //     externalAPIScope
//   //   );
//   // };
//   // setReceiverConstraints = id => {
//   //   this._room.setReceiverConstraints({
//   //     colibriClass: 'ReceiverVideoConstraints',
//   //     lastN: -1,
//   //     onStageEndpoints: [id],
//   //     defaultConstraints: { maxHeight: 180 },
//   //     constraints: {
//   //       [id]: { maxHeight: 720 }
//   //     }
//   //   });
//   // };
//   // getMutedPolicy = () => this._room.startMutedPolicy;
//   // getMyId = () => this._room.myUserId();

//   // /**
//   //  * connect : 화상회의 참가
//   //  */
//   // join = async (roomName, token, tracks, attributes) => {
//   //   this._roomToken = token;
//   //   this._roomName = roomName.toLowerCase();
//   //   // 초기화
//   //   this._init();
//   //   // 대화방 연결을 위한 Connection
//   //   this._connection = new Connection();
//   //   // 대화방 연결을 위한 ConferenceConnector
//   //   this._conferenceConnector = new ConferenceConnector(this.handler);
//   //   // connection 연결
//   //   await this._connection.connect(roomName.toLowerCase(), token);
//   //   // 대화방 참가
//   //   this._room = await this._conferenceConnector.connect(
//   //     this._connection,
//   //     roomName.toLowerCase(),
//   //     tracks,
//   //     attributes
//   //   );
//   //   this.tracks = tracks;
//   //   this._dispatch(masterAcionCreators.checkMasterList(this._roomToken));
//   //   if (this._room) return true;
//   //   else return false;
//   // };

//   // getAudioMuted = () => {
//   //   return this._room.startAudioMuted;
//   // };

//   // changeTrack = async (type, oldTrack) => {
//   //   const newTrack = (
//   //     await JitsiMeetJS.createLocalTracks({
//   //       devices: [type],
//   //       resolution: 320
//   //     })
//   //   )[0];
//   //   await this._room.replaceTrack(oldTrack, newTrack);
//   //   this._dispatch(localActionCreators.setTrack(newTrack));
//   // };
//   // /**
//   //  * 연결을 해제한다.
//   //  */
//   // dispose = () => {
//   //   new Promise.all([
//   //     this._conferenceConnector & this._conferenceConnector.dispose(),
//   //     this._connection && this._connection.dispose(),
//   //     this._dispatch(WedriveAcionCreators.setInitInfo()),
//   //     this._dispatch(localActionCreators.leaveConference())
//   //   ]).then(() => {
//   //     this._dispatch(indicatorAcionCreators.resetIndicator());
//   //   });
//   // };

//   // /**
//   //  * selectParticipant
//   //  * 메인으로 선택된 사람의 화질을 높인다.
//   //  */
//   // selectParticipant = id => {
//   //   this._conferenceConnector.selectParticipant(id);
//   // };

//   // setDocumentData = data => {
//   //   this._conferenceConnector.setDocumentData(data);
//   // };

//   // // #endregion

//   // /**
//   //  * init: 화상회의 연결을 위한 초기화
//   //  */
//   // _createHandlers = () => {
//   //   const handler = {
//   //     JOIN_USER: this._joinUser,
//   //     KICK_USER: this._kickUser,
//   //     LEFT_USER: this._leftUser,
//   //     ADD_REMOTE_TRACK: this._addRemoteTrack,
//   //     VIDEO_MUTE_CHANGED: this._videoMutedChanged,
//   //     SUSPEND_DETECTED: () => {},
//   //     CREATED_TIME: this._createTime,
//   //     SET_USER_INFO: this._setUserInfo,
//   //     CHANGED_USER_STATUS: this._changedUserStatus,
//   //     CHANGED_DOCUMENT_PAGE: this.changeDocumentPage,
//   //     CHANGED_DOCUMENT_SHARE_MODE: this.changeDocumentShareMode,
//   //     CHANGED_DRAWING_SHARE_MODE: this.changeDrawingShareMode,
//   //     CHANGED_DRAW_DATA: this.changeDrawData,
//   //     DOCUMENT_SHARE_TARGET: this.documentShareTarget,
//   //     MESSAGE_RECEIVED: this.messageReceived,
//   //     CHANGED_MIC_CONTROL_MODE_BY_MASTER: this.changeMicControlModeByMaster,
//   //     CHANGED_MIC_CONTROL_USER_MODE_BY_MASTER:
//   //       this.changeMicControlUserModeByMaster,
//   //     CHANGED_MIC_MUTE_BY_MASTER: this.changeMicMuteByMaster,
//   //     REJECTED_BY_MASTER: this.rejectedByMaster,
//   //     CHANGE_MASTER_LIST: this.changeMasterList,
//   //     REQUEST_KICK: this.requestKick,
//   //     START_RECORDING: this.startRecord,
//   //     STOP_RECORDING: this.stopRecord,
//   //     REQUEST_RECORD_USER: this.requestRecordUser,
//   //     STOP_FLOOR: this.stopFloor,
//   //     REQUEST_FLOOR: this.requestFloor
//   //   };
//   //   return handler;
//   // };

//   // /**
//   //  * init: 화상회의 연결을 위한 초기화
//   //  */
//   // _init = () => {
//   //   // JitsiMeetJS 를 초기화 한다.
//   //   JitsiMeetJS.init({
//   //     ...config
//   //   });
//   //   JitsiMeetJS.isDesktopSharingEnabled();

//   //   // JitsiMeetJS Log Level을 설정한다.
//   //   JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);
//   // };

//   // /**
//   //  * JOIN_USER
//   //  * 대화방에 참여자가 접속하면 호출된다.
//   //  */
//   // _joinUser = user => {
//   //   this._dispatch(participantsAcionCreators.joinUser(user));
//   //   this._dispatch(masterAcionCreators.checkMasterList(this._roomToken));
//   // };

//   // /**
//   //  * KICK_USER
//   //  * 대화방에 참여자 강퇴
//   //  */

//   // // _kickUser = id => {
//   // //   this._dispatch(participantsAcionCreators.kickUser(id))
//   // // }

//   // /**
//   //  * LEFT_USER
//   //  * 대화방에 참여자가 나가면 호출된다.
//   //  */
//   // _leftUser = id => {
//   //   this._dispatch(participantsAcionCreators.leftUser(id));
//   //   MeetApi.checkMasterList(this._roomName).then(res => {
//   //     if (res && res?.resultData?.count === 0) {
//   //       this._dispatch(masterAcionCreators.noWhereMaster());
//   //       // this._dispatch(masterAcionCreators.changeMasterControlMode(null));
//   //       // this._dispatch(localActionCreators.toggleMuteMic(false));
//   //     } else {
//   //       this._dispatch(masterAcionCreators.checkMasterList(this._roomToken));
//   //     }
//   //   });
//   // };

//   // _createTime = time => {
//   //   this._dispatch(localActionCreators.setConferenceCreatedTime(time));
//   // };
//   // /**
//   //  * ADD_REMOTE_TRACK
//   //  * 대화방에 참여자의 트랙이 추가되면 호출된다.
//   //  */
//   // _addRemoteTrack = track => {
//   //   this._dispatch(participantsAcionCreators.setRemoteTrack(track));
//   // };

//   // /**
//   //  * VIDEO_MUTE_CHANGED
//   //  * 카메라 또는 오디오(마이크)가 온/오프되면 발생한다.
//   //  */
//   // _videoMutedChanged = track => {
//   //   this._dispatch(participantsAcionCreators.updateMuteVideo(track));
//   // };

//   // /**
//   //  * 위하고 아이디등 유저 정보를 설정한다.
//   //  */
//   // _setUserInfo = (id, info) => {
//   //   this._dispatch(participantsAcionCreators.setUserInfo(id, info));
//   // };

//   // /**
//   //  *
//   //  */
//   // _changedUserStatus = (userId, status) => {
//   //   this._dispatch(participantsAcionCreators.changedStatus(userId, status));
//   // };

//   // /**
//   //  * 문서공유/드로잉모드 전환
//   //  */
//   // // _changeDocumentShareMode = status => {
//   // changeDrawData = (drawData, selectResource) => {
//   //   this._dispatch(
//   //     DocumentShareAcionCreators.setDrawData(drawData, selectResource)
//   //   );
//   // };

//   // /**
//   //  * 문서공유 모드 전환
//   //  */
//   // // _changeDocumentShareMode = status => {
//   // changeDocumentShareMode = (
//   //   attributes = false,
//   //   presenter = false,
//   //   page = 0,
//   //   documentData = []
//   // ) => {
//   //   this._dispatch(
//   //     DocumentShareAcionCreators.setSharingMode(
//   //       attributes,
//   //       presenter,
//   //       page,
//   //       documentData,
//   //       'document'
//   //     )
//   //   );
//   // };

//   // /**
//   //  * @description 드로잉 모드 전환
//   //  */
//   // changeDrawingShareMode = (isDrawingShare, presenter, page, documentData) => {
//   //   this._dispatch(
//   //     DocumentShareAcionCreators.setSharingMode(
//   //       isDrawingShare ? { resources: '[]' } : false,
//   //       isDrawingShare ? presenter : undefined,
//   //       0, // page
//   //       documentData, //documentData
//   //       'drawing'
//   //     )
//   //   );
//   // };

//   // /**
//   //  * 문서공유 페이지 전환
//   //  */
//   // changeDocumentPage = page => {
//   //   this._dispatch(DocumentShareAcionCreators.setDocumentPage(page));
//   // };

//   // /**
//   //  * 문서공유 페이지 전환
//   //  */
//   // setDocumentPage = (page, presenter) => {
//   //   this._conferenceConnector.setDocumentPage(page, presenter);
//   // };

//   // /**
//   //  * @description setDrawingShareMode
//   //  * 드로잉 모드 전환
//   //  */
//   // setDrawingShareMode = isDrawingShare => {
//   //   this._conferenceConnector.setDrawingShareMode(isDrawingShare);
//   // };

//   // /**
//   //  * setDrawingData
//   //  * 드로잉데이터 전송
//   //  */
//   // setDrawingData = (data, page) => {
//   //   this._conferenceConnector.setDrawingData(data, page);
//   // };

//   // /**
//   //  * setToogleDocumentShare
//   //  * 드로잉데이터 전송
//   //  */
//   // setToogleDocumentShare = attributes => {
//   //   // alert(JSON.stringify(data));
//   //   this._conferenceConnector.setToogleDocumentShare(attributes);
//   // };

//   // /**
//   //  * setClear
//   //  * 드로잉데이터 전송
//   //  */
//   // setClear = () => {
//   //   this._conferenceConnector.setClear();
//   // };

//   // /**
//   //  * documentShareTarget
//   //  * 특정 타겟에게만 데이터 전송
//   //  */
//   // documentShareTarget = (user, drawData) => {
//   //   this._conferenceConnector.documentShareTarget(user, drawData);
//   // };

//   // /**
//   //  * messageReceived
//   //  * 참가자로부터 메시지를 받았을 경우 (전체 메세지)
//   //  */
//   // messageReceived = (user, text, date) => {
//   //   if (date) return;
//   //   // if (date < new Date().toISOString()) return;
//   //   const message = {
//   //     user,
//   //     text,
//   //     date: new Date().toISOString(),
//   //     isRead: false
//   //   };
//   //   this._dispatch(localActionCreators.receiceConferenceMessage(message));
//   // };

//   // sendTextMessage = text => {
//   //   if (text && text === '') return;
//   //   this._room.sendTextMessage(text);
//   // };

//   // /*
//   //  * 마스터가 참가자들 컨트롤 할 때
//   //  */
//   // //CHANGED_MIC_CONTROL_MODE_BY_MASTER : 전체 마이크 제어
//   // //CHANGED_MIC_CONTROL_USER_MODE_BY_MASTER : 마스터의 발언권 제어모드 시작/종료
//   // //CHANGED_MIC_MODE_BY_MASTER : 특저 유정 마이크 제어
//   // changeMicControlUserModeByMaster = (value, flag) => {
//   //   flag && this._dispatch(masterAcionCreators.changeMasterControlMode(value));
//   //   const msg = value
//   //     ? this.t('toast_master_clton') //발언권 제어 시작
//   //     : this.t('toast_master_cltoff'); //발언권 제어 종료
//   //   this._dispatch(toastAcionCreators.setToastMessage(msg));
//   // };
//   // changeMicControlModeByMaster = (flag, iMaster) => {
//   //   !iMaster && this._dispatch(masterAcionCreators.changeAudioActive(flag));

//   //   const msg = flag
//   //     ? this.t('toast_master_micoffbymaster') // 마스터가 마이크 비활성화
//   //     : this.t('toast_master_miconbymaster'); // 마스터가 마이크 활성화
//   //   !iMaster && this._dispatch(toastAcionCreators.setToastMessage(msg));
//   // };
//   // changeMicMuteByMaster = flag => {
//   //   const msg = flag
//   //     ? this.t('toast_master_micoffbymaster') // 마스터가 마이크 비활성화
//   //     : this.t('toast_master_miconbymaster'); // 마스터가 마이크 활성화
//   //   this._dispatch(toastAcionCreators.setToastMessage(msg));
//   //   this._dispatch(masterAcionCreators.changeMuteMicMaster(flag));
//   // };

//   // requestAttention = name => {
//   //   this._conferenceConnector.requestAttention(name);
//   // };
//   // stopAttention = name => {
//   //   this._conferenceConnector.stopAttention(name);
//   // };

//   // rejectedByMaster = () => {
//   //   this._dispatch(
//   //     toastAcionCreators.setToastMessage(this.t('toast_master_denied'))
//   //   );
//   //   this._dispatch(masterAcionCreators.setMicRequest(false));
//   // };

//   // requestFloor = targetUser => {
//   //   this._dispatch(masterAcionCreators.setUserMicRequest(targetUser));
//   // };

//   // replyUserRequest = (targetUser, command) => {
//   //   this._dispatch(masterAcionCreators.setTargetUserList(targetUser.jitsiId));
//   //   this._conferenceConnector.replyUserRequest(targetUser, command);
//   // };

//   // //UPDATE_MASTER_USERS 요청을 들었을때
//   // changeMasterList = (cancel, myCommand) => {
//   //   this._dispatch(masterAcionCreators.checkMasterList(this._roomToken));
//   //   if (myCommand) {
//   //     const toastMessage = cancel
//   //       ? '마스터 권한을 해제했습니다.'
//   //       : '마스터 권한을 부여했습니다.';

//   //     this._dispatch(toastAcionCreators.setToastMessage(toastMessage));
//   //   }
//   // };

//   // //UPDATE_MASTER_USERS 커맨트를 요청할때
//   // updateRolefromMaster = (newMaster, cancel) => {
//   //   this._conferenceConnector.updateRolefromMaster(newMaster, cancel);
//   // };

//   // // 마스터가 참여자를 추방
//   // requestKick = (masterInfo, targetInfo) => {
//   //   const { name: masterName } = JSON.parse(masterInfo);
//   //   const { name: targetName, id: targetId } = JSON.parse(targetInfo);

//   //   const myId = this._room.myUserId();
//   //   if (myId === targetId) {
//   //     const message = `${masterName} 님이 ${targetName} 님을 \n화상회의방에서 추방하였습니다.`;
//   //     this._endCall();
//   //     this._dispatch(
//   //       alertAcionCreators.setAlert({
//   //         type: 1,
//   //         title: 'alert_kick',
//   //         message
//   //       })
//   //     );
//   //   } else {
//   //     this._dispatch(toastAcionCreators.kickMessage(targetName));
//   //   }
//   // };

//   // //REQUEST_KICK 커맨드를 요청할때
//   // kickUserFromMaster = (id, masterName, targetName) => {
//   //   this._conferenceConnector.kickUserFromMaster(id, masterName, targetName);
//   // };

//   // micControlFromMaster = (flag, cno, audio_active) => {
//   //   this._conferenceConnector.micControlFromMaster(
//   //     flag,
//   //     cno,
//   //     this._roomToken,
//   //     audio_active
//   //   );
//   // };

//   // startRecord = () => {
//   //   this._dispatch(
//   //     toastAcionCreators.setToastMessage(this.t('녹화가 시작 되었습니다.'))
//   //   );
//   // };

//   // stopRecord = () => {
//   //   this._dispatch(
//   //     toastAcionCreators.setToastMessage(this.t('녹화가 중지 되었습니다.'))
//   //   );
//   // };
//   // requestRecordUser = user => {
//   //   MeetApi.recordRequest(this._roomName, user);
//   // };
// }

// export default ConferenceManager;