import JitsiMeetJS from '@jitsi/base/lib-jitsi-meet';
import { ConferenceHandler } from './ConferenceHandler';
// 위하고 아이디 커멘드 이름 정의

// 드로잉 이미지 전달 커멘드 타입
export const actions = {
  WEHAGO_ID: 'wehagoid',

  UPDATE_DRAWING_DATA: 'UPDATE_DRAWING_DATA',

  // 드로잉 전체 지우기
  // export const CLEAR_DRAWING_CANVAS : 'CLEAR_DRAWING_CANVAS',
  CLEAR_DOCUMENT_CANVAS: 'CLEAR_DOCUMENT_CANVAS',

  // 캔버스 뒤로가기 앞으로가기 커맨드 타입
  DRAWING_REDO_UNDO: 'DRAWING_REDO_UNDO',

  // 문서 공유모드 설정 커맨드 타입
  SET_DOCUMENT_SHARE_IS_OPEN: 'SET_DOCUMENT_SHARE_IS_OPEN',
  // 문서 공유모드 해제 커맨드 타입
  SET_DOCUMENT_SHARE_IS_CLOSE: 'SET_DOCUMENT_SHARE_IS_CLOSE',
  // 드로잉 모드 설정 커맨드 타입
  SET_DRAWING_IS_SHARE: 'SET_DRAWING_IS_SHARE',

  // 문서 공유 페이지 설정 커맨드 타입
  SET_DOCUMENT_PAGE: 'SET_DOCUMENT_PAGE',

  // 문서공유 데이터 전달 커멘드 타입
  UPDATE_DOCUMENT_DATA: 'UPDATE_DOCUMENT_DATA',

  // 특정 타켓한데만 전달 커맨드 타입
  DOCUMENT_SHARE_TARGET: 'DOCUMENT_SHARE_TARGET',
  DRAWING_SHARE_TARGET: 'DRAWING_SHARE_TARGET',

  // export const REQUEST_INVITE : 'CONFERENCE.EVENT.REQUEST.INVITE', // 초대 요청 이벤트
  // export const REQUEST_KICK : 'CONFERENCE.EVENT.REQUEST.KICK', // 추방 요청 이벤트

  REQUEST_MIC_CONTROL: 'CONFERENCE.EVENT.REQUEST.MIC_CONTROL', // 화상대화 전체 마이크 제어 요청 이벤트
  REQUEST_MIC_CONTROL_USER: 'CONFERENCE.EVENT.REQUEST.MIC_CONTROL_USER', // 화상대화 전체 마이크 제어 요청자 사용자 정보 이벤트
  REQUEST_MIC_CONTROL_TARGET: 'CONFERENCE.EVENT.REQUEST.MIC_CONTROL_TARGET', // 화상대화 타겟 유저 마이크 제어 요청 이벤트

  // 제어중일때 발언권 요청 보낸 뒤 승인 또는 거부 이벤트 (마스터가 전체 발언권 허용)
  GRANT_FLOOR: 'GRANT_FLOOR',
  // 제어중일때 발언권 요청 보낸 뒤 승인 또는 거부 이벤트 (마스터가 전체 특정 발언권 허용)
  GRANT_FLOOR_TARGET: 'GRANT_FLOOR_TARGET',

  // 제어중일때 발언권 요청
  REQUEST_FLOOR: 'REQUEST_FLOOR',
  // 제어중일때 발언권 취소
  STOP_FLOOR: 'STOP_FLOOR',

  KICK_PARTICIPANT: 'KICK_PARTICIPANT',

  // export const REQUEST_GET_CONTROL : 'CONFERENCE.EVENT.REQUEST.REQUEST_GET_CONTROL', // 마스터 제어 권한 위임 요청 이벤트

  // export const RESPONSE_GET_CONTROL : 'CONFERENCE.EVENT.REQUEST.RESPONSE_GET_CONTROL', // 마스터 제어 권한 위임 반환 이벤트

  // 마스터 권한 유저 리스트 변경 이벤트
  UPDATE_MASTER_USERS: 'CONFERENCE.EVENT.REQUEST.UPDATE_MASTER_USERS',

  // 마스터가 유저 추방
  REQUEST_KICK: 'CONFERENCE.EVENT.REQUEST.KICK',

  REQUEST_ROOM_STOP_RECORDING:
    'CONFERENCE.EVENT.ROOM.REQUEST_ROOM_STOP_RECORDING',
  REQUEST_ROOM_START_RECORDING:
    'CONFERENCE.EVENT.ROOM.REQUEST_ROOM_START_RECORDING'
};

export function bindEvent(handler: any, room: any, resolve: any, reject: any) {
  const conferenceEvents = JitsiMeetJS.events.conference;

  // ===== Additional ===== //
  // room.on(conferenceEvents.CONNECTION_DROPPED_ERROR, () => {});

  // room.on(
  //   conferenceEvents.PARTICIPANT_CONN_STATUS_CHANGED,
  //   (userId, status) => {
  //     /**
  //      * active : 카메라 꺼졌을 때
  //      * inactive : 참여했을 때
  //      * interrupted : 연결이 끊어졌을 때 - 네트워크
  //      * restoring : 복원중 - 네트워크 - 해결메시지가 없음! : 일단 무시
  //      */
  //     // handler.CHANGED_USER_STATUS(userId, status);
  //     // resolve(room);
  //   }
  // );

  // 대화방 참가 성공 이벤트 연결
  room.on(conferenceEvents.CONFERENCE_JOINED, () => {
    resolve(true);
  });

  // 컨퍼런스 참가 실패 이벤트 연결
  room.on(conferenceEvents.CONFERENCE_FAILED, () => {
    reject('bindEvent - 화상 연결에 실패하였습니다.');
  });

  // JOIN_USER 이벤트 연결
  room.on(conferenceEvents.USER_JOINED, (id: any, user: any) => {
    if (new Set(['wehagorecord', 'wehagorecord-dev']).has(user.getStatsID()))
      return;
    if (id === room.myUserId()) return;
    handler.joinUser(user);
  });

  // // LEFT_USER 이벤트 연결
  // room.on(conferenceEvents.USER_LEFT, id => {
  //   if (room.presenter === id) {
  //     handler.CHANGED_DOCUMENT_SHARE_MODE(false, false);
  //   }
  //   handler.LEFT_USER(id);
  // });

  // 트랙추가 이벤트 연결
  room.on(conferenceEvents.TRACK_ADDED, (track: any) => {
    if (!track.isLocal()) {
      handler.setUserTrack(track);
    }
  });

  // // 비디오 Mute 변경
  // room.on(conferenceEvents.TRACK_MUTE_CHANGED, track => {
  //   if (track.getType() === 'video') {
  //     handler.VIDEO_MUTE_CHANGED(track);
  //   }
  //   // handler.VIDEO_MUTE_CHANGED(track);
  // });

  // // SUSPEND_DETECTED
  // room.on(conferenceEvents.SUSPEND_DETECTED, () => {
  //   handler.SUSPEND_DETECTED();
  // });

  room.on(conferenceEvents.MESSAGE_RECEIVED, (user: any, text: any, date: any) => {
    handler.setMessage(user, text, date);
  });

  // room.on(conferenceEvents.RECORDER_STATE_CHANGED, data => {
  //   const { _status, _sessionID, _initiator } = data;
  //   if ((_initiator || room.isModerator()) && _status === 'on') {
  //     handler.START_RECORDING();
  //     this._sessionID = _sessionID;
  //   }

  //   if (_status === 'off') {
  //     handler.STOP_RECORDING();
  //     this._sessionID = null;
  //   }
  // });
  // ======== addEventListener ========== //

  // // 위하고 접속 아이디 및 정보 가져오기
  room.addCommandListener(actions.WEHAGO_ID, (user: any) => {
    // if (user.id === room.myUserId()) return;
    if (user.value === room.myUserId()) return;

    handler.setUserInfo(user);
  });

  // /**
  //  * 문서 공유 페이지 전환 감지
  //  */
  // room.addCommandListener(SET_DOCUMENT_PAGE, value => {
  //   const {
  //     value: userId,
  //     attributes: { page }
  //   } = value;
  //   if (userId !== room.myUserId()) {
  //     handler.CHANGED_DOCUMENT_PAGE(Number(page));
  //   }
  // });

  // room.on(conferenceEvents.RECORDER_STATE_CHANGED, data => {
  //   const { _status, _sessionID } = data;
  //   if (_status === 'on' && this._sessionID === null) {
  //     handler.START_RECORDING();
  //     this._sessionID = _sessionID;
  //   } else if (_status === 'off') {
  //     handler.STOP_RECORDING();
  //     this._sessionID = null;
  //   }
  // });
  // /**
  //  * @description 문서 공유 모드 설정 감지
  //  */
  // room.addCommandListener(SET_DOCUMENT_SHARE_IS_OPEN, value => {
  //   const { value: userId, attributes } = value;
  //   // if (attributes.user === 'ALL' || attributes.user === room.myUserId())
  //   room.presenter = userId;
  //   if (userId !== room.myUserId()) {
  //     handler.CHANGED_DOCUMENT_SHARE_MODE(attributes, userId);
  //   } else {
  //     handler.CHANGED_DOCUMENT_SHARE_MODE(attributes, 'localUser');
  //   }
  // });
  // room.addCommandListener(SET_DOCUMENT_SHARE_IS_CLOSE, value => {
  //   // const { value: userId } = value;
  //   // if (userId !== room.myUserId()) {
  //   handler.CHANGED_DOCUMENT_SHARE_MODE(false, false);
  //   // }
  // });

  // /**
  //  * @description 드로잉 모드 설정 감지
  //  */
  // room.addCommandListener(SET_DRAWING_IS_SHARE, value => {
  //   const {
  //     value: userId,
  //     attributes: { isDrawingShare }
  //   } = value;
  //   const presenter = userId === room.myUserId() ? 'localUser' : userId;
  //   const isClosed = isDrawingShare === 'false';

  //   handler.CHANGED_DRAWING_SHARE_MODE(!isClosed, presenter);
  // });

  // /**
  //  * 드로잉 데이터 변경 감지
  //  */
  // room.addCommandListener(UPDATE_DOCUMENT_DATA, value => {
  //   const {
  //     attributes: { documentData, from, selectResource },
  //     value: userId
  //   } = value;

  //   // 데이터 변경자가 본인과 다를 경우 캔버스 그리기
  //   if (userId !== room.myUserId()) {
  //     // const _drawData = JSON.parse(drawData);
  //     // this._drawingManager.handleConvertFormat('web', value);
  //     handler.CHANGED_DRAW_DATA(JSON.parse(documentData), selectResource);
  //   }
  // });

  // /**
  //  * 드로잉 캔버스 클리어 감지
  //  */
  // room.addCommandListener(CLEAR_DOCUMENT_CANVAS, value => {
  //   // if (!this._drawingManager) {
  //   //   this._drawingManager = getDrawingManager();
  //   // }

  //   const { value: userId } = value;

  //   if (
  //     userId !== room.myUserId() &&
  //     this._drawingManager &&
  //     this._drawingManager.get('canvas')
  //   ) {
  //     this._drawingManager.clearAll();
  //   }
  // });

  // /**
  //  * 드로잉 뒤로가기, 앞으로가기 감지
  //  */
  // room.addCommandListener(DRAWING_REDO_UNDO, value => {
  //   if (!this._drawingManager) {
  //     this._drawingManager = getDrawingManager();
  //   }

  //   const { attributes, value: userId } = value;

  //   if (userId !== room.myUserId() && this._drawingManager) {
  //     // 아이디랑 타입 보내기
  //     // redo
  //     // if (attributes.type === "redo") this._drawingManager.redo();
  //     // undo
  //     // if (attributes.type === "undo") this._drawingManager.undo();
  //   }
  // });

  // /**
  //  * 새로 참가한 사람만 받아라 (문서공유)
  //  */
  // room.addCommandListener(DOCUMENT_SHARE_TARGET, value => {
  //   if (room.myUserId() === value.attributes.target) {
  //     handler.CHANGED_DOCUMENT_SHARE_MODE(
  //       {
  //         fileName: value.attributes.fileName,
  //         owner: value.attributes.owner,
  //         resources: value.attributes.resources
  //       },
  //       value.value,
  //       Number(value.attributes.selectResource),
  //       JSON.parse(value.attributes.objectData)
  //     );
  //   }
  // });

  // /**
  //  * 새로 참가한 사람만 받아라 (드로잉공유)
  //  */
  // room.addCommandListener(DRAWING_SHARE_TARGET, value => {
  //   if (room.myUserId() === value.attributes.target) {
  //     const drawingData = value.attributes.objectData
  //       ? JSON.parse(value.attributes.objectData)
  //       : [{ object: [] }];
  //     handler.CHANGED_DRAWING_SHARE_MODE(
  //       { resources: '[]', ...value.attributes }, // attributes
  //       value.value, // presenter Id
  //       0, //page
  //       drawingData[0].object ? [drawingData[0].object] : drawingData //documentData
  //     );
  //   }
  // });

  // // 화상대화 전체 마이크 제어 요청 이벤트
  // // - 마스터가 마이크 제어 mute를 함 사용자들은 마이크 임의로 킬 수 없음
  // // 간단한 토스트 메시지 띄움
  // room.addCommandListener(REQUEST_MIC_CONTROL, value => {
  //   // console.log('REQUEST_MIC_CONTROL[ 마이크 전체 제어 ] : ', value);
  //   const {
  //     attributes: { controlType }
  //   } = value;

  //   if (value.value === room.myUserId()) {
  //     handler.CHANGED_MIC_CONTROL_MODE_BY_MASTER(controlType === 'mute', true);
  //   } else {
  //     handler.CHANGED_MIC_CONTROL_MODE_BY_MASTER(controlType === 'mute', false);
  //   }
  //   // value.attribute === 'mute' ? true : false
  // });

  // // 화상대화 전체 마이크 제어 요청자 사용자 정보 이벤트
  // //- 마스터가 마이크 제어 모드 시작하기/종료하기
  // room.addCommandListener(REQUEST_MIC_CONTROL_USER, value => {
  //   // console.log('REQUEST_MIC_CONTROL_USER[ 발언권 제어모드 ] : ', value);
  //   let controlMode = value.value !== room.myUserId();
  //   handler.CHANGED_MIC_CONTROL_USER_MODE_BY_MASTER(value.value, controlMode);
  // });

  // // 화상대화 타겟 유저 마이크 제어 요청 이벤트
  // // - 마스터가 단일 마일 제어 id형식 8자
  // room.addCommandListener(REQUEST_MIC_CONTROL_TARGET, value => {
  //   // console.log(
  //   //   'REQUEST_MIC_CONTROL_TARGET[ 특정 유저 마이크 제어 ] : ',
  //   //   value
  //   // );
  //   if (room.myUserId() === value.attributes.target) {
  //     handler.CHANGED_MIC_MUTE_BY_MASTER(value.attributes.isMute === 'true');
  //   }
  // });

  // room.addCommandListener(GRANT_FLOOR, value => {
  //   const result = JSON.parse(value.attributes.targetUser);
  //   console.log('GRANT_FLOOR : ', result);
  //   if (result.find(e => e.jitsiId === room.myUserId())) {
  //     if (value.attributes.type === 'reject') {
  //       handler.REJECTED_BY_MASTER();
  //     } else {
  //       handler.CHANGED_MIC_MUTE_BY_MASTER(false);
  //     }
  //   }
  // });

  // room.addCommandListener(GRANT_FLOOR_TARGET, value => {
  //   const result = JSON.parse(value.attributes.targetUser);
  //   const iMaster = value.attributes.isMasterControlTarget;
  //   console.log('GRANT_FLOOR_TARGET : ', value);

  //   if (result.jitsiId === room.myUserId()) {
  //     if (value.attributes.type === 'reject') {
  //       iMaster !== 'true' && handler.REJECTED_BY_MASTER();
  //     } else if (value.attributes.type === 'accept') {
  //       handler.CHANGED_MIC_MUTE_BY_MASTER(false);
  //     }
  //   }
  // });

  // room.addCommandListener(UPDATE_MASTER_USERS, value => {
  //   const { cancel, myCommand } = value.attributes;
  //   console.log('UPDATE_MASTER_USERS : ', value);
  //   handler.CHANGE_MASTER_LIST(cancel, myCommand);
  // });

  // room.addCommandListener(REQUEST_KICK, value => {
  //   const target = value.attributes.targetUser;
  //   const master = value.attributes.requestUser;
  //   handler.REQUEST_KICK(master, target);
  // });

  // room.addCommandListener(STOP_FLOOR, value => {
  //   console.log('STOP_FLOOR : ', value);
  //   const result = JSON.parse(value.attributes.targetUser);
  //   if (
  //     result.jitsiId === room.myUserId() &&
  //     value.value !== room.myUserId() &&
  //     value.attributes.isMasterControlTarget !== 'true'
  //   ) {
  //     // 본인이 끈건지 마스터가 끈건지 판단
  //     handler.CHANGED_MIC_MUTE_BY_MASTER(true);
  //   } else {
  //   }
  // });

  // room.addCommandListener(REQUEST_FLOOR, value => {
  //   console.log('REQUEST_FLOOR : ', value);
  //   const targetUser = JSON.parse(value.attributes.targetUser);

  //   //권한요청 받았을때( 권한요청자와 마스터가 다른 사람일경우)
  //   if (value.value !== room.myUserId()) {
  //     handler.REQUEST_FLOOR(targetUser);
  //   }
  // });

  // room.addCommandListener(REQUEST_ROOM_STOP_RECORDING, value => {
  //   if (room.isModerator()) {
  //     if (this._sessionID) {
  //       room.stopRecording(this._sessionID);
  //     }
  //   }
  // });
  // // 방 녹화 요청 이벤트 핸들러
  // room.addCommandListener(REQUEST_ROOM_START_RECORDING, value => {
  //   const {
  //     attributes: { user }
  //   } = value;
  //   if (room.isModerator()) {
  //     // 녹화 요청 등록 API 호출
  //     handler.REQUEST_RECORD_USER(user);
  //     // 녹화 시작
  //     room.startRecording({
  //       mode: 'file',
  //       appData: JSON.stringify({
  //         file_recording_metadata: {
  //           share: true
  //         }
  //       })
  //     });
  //   }
  // });
}

export function disposeEvent(room: any) {
  // room.removeCommandListener(WEHAGO_ID);
  // room.removeCommandListener(SET_DOCUMENT_PAGE);
  // room.removeCommandListener(SET_DOCUMENT_SHARE_IS_OPEN);
  // room.removeCommandListener(SET_DOCUMENT_SHARE_IS_CLOSE);
  // room.removeCommandListener(SET_DRAWING_IS_SHARE);
  // room.removeCommandListener(UPDATE_DOCUMENT_DATA);
  // room.removeCommandListener(CLEAR_DOCUMENT_CANVAS);
  // room.removeCommandListener(DRAWING_REDO_UNDO);
  // room.removeCommandListener(DOCUMENT_SHARE_TARGET);
  // room.removeCommandListener(DRAWING_SHARE_TARGET);
  // room.removeCommandListener(REQUEST_MIC_CONTROL);
  // room.removeCommandListener(REQUEST_MIC_CONTROL_USER);
  // room.removeCommandListener(REQUEST_MIC_CONTROL_TARGET);
  // room.removeCommandListener(GRANT_FLOOR);
  // room.removeCommandListener(STOP_FLOOR);
  // room.removeCommandListener(GRANT_FLOOR_TARGET);
  // room.removeCommandListener(UPDATE_MASTER_USERS);
  // room.removeCommandListener(REQUEST_KICK);
  // room.removeCommandListener(REQUEST_ROOM_STOP_RECORDING);
  // room.removeCommandListener(REQUEST_ROOM_START_RECORDING);
  // room.removeCommandListener(REQUEST_FLOOR);
}
