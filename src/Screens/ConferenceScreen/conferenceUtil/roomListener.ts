import JitsiMeetJS from '@jitsi/base/lib-jitsi-meet';
import { ConferenceHandler } from './ConferenceHandler';

type DEFAULT_PARAM = {
  value: string;
};

type UPDATE_MASTER_USERS_TYPE = DEFAULT_PARAM & {
  attributes: {
    isRemoveAuth?: string | undefined;
    myCommand?: boolean;
  };
  value: string;
};

type REQUEST_KICK = DEFAULT_PARAM & {
  attributes: {
    requestUser: string;
    targetUser: string;
  };
};

type WEHAGO_ID_TYPE = DEFAULT_PARAM & {
  attributes: {
    avatar: string;
    companyFullpath: string;
    host: string;
    is_screen: string;
    nickname: string;
    profile_url: string;
    userIdentificationCode: string;
    userName: string;
    user_contact: string;
    user_email: string;
    wehagoId: string;
  };
};

type SET_DRAWING_IS_SHARE_TYPE = DEFAULT_PARAM & {
  attributes: {
    isDrawingShare: 'true' | 'false';
  };
};

type UPDATE_DOCUMENT_DATA_TYPE = DEFAULT_PARAM & {
  attributes: {
    canvasType: string;
    dataURL: string;
    documentData: string;
    from: 'web' | 'mobile';
    selectResource: string;
  };
};

type DRAWING_SHARE_TARGET_TYPE = DEFAULT_PARAM & {
  attributes: { from: string; objectData: string; target: string };
};

type SET_DOCUMENT_SHARE_IS_OPEN_TYPE = DEFAULT_PARAM & {
  attributes: {
    fileName: string;
    owner: string;
    resources: string;
  };
};

type DOCUMENT_SHARE_TARGET_TYPE = DEFAULT_PARAM & {
  attributes: {
    fileName: string;
    objectData: string;
    owner: string;
    resources: string;
    selectResource: string;
    target: string;
  };
};

type REQUEST_MIC_CONTROL_TYPE = DEFAULT_PARAM & {
  attributes: {
    controlType: 'mute' | 'unmute';
  };
};

type REQUEST_FLOOR_TYPE = DEFAULT_PARAM & {
  attributes: {
    targetUser: string;
  };
};

type GRANT_FLOOR_TARGET_TYPE = DEFAULT_PARAM & {
  attributes: {
    isMasterControlTarget: 'false' | 'true';
    type: 'reject' | 'accept';
    targetUser: string;
  };
};

type STOP_FLOOR_TYPE = DEFAULT_PARAM & {
  attributes: {
    isMasterControlTarget: 'false' | 'true';
    targetUser: string;
  };
};

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
  let presenter = '';
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

  // LEFT_USER 이벤트 연결
  room.on(conferenceEvents.USER_LEFT, (id: string) => {
    if (id === room.myUserId()) return;
    if (presenter === id) {
      handler.changeDocumentShareMode(false, false);
    }
    handler.leftUser(id);
  });

  // 트랙추가 이벤트 연결
  room.on(conferenceEvents.TRACK_ADDED, (track: any) => {
    if (!track.isLocal()) {
      handler.setUserTrack(track);
    }
  });

  // 참가자 오디오트랙 mute 여부 실시간 감지
  room.on(conferenceEvents.TRACK_MUTE_CHANGED, (track: any) => {
    const trackType = track.getType();
    if (trackType === 'audio' && !track.isLocal()) {
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

  room.on(
    conferenceEvents.MESSAGE_RECEIVED,
    (sendUser: string, receivedMessage: string, sendDate: string) => {
      handler.setMessage(sendUser, receivedMessage, sendDate);
    }
  );

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
  room.addCommandListener(actions.WEHAGO_ID, (user: WEHAGO_ID_TYPE) => {
    // if (user.id === room.myUserId()) return;
    if (user.value === room.myUserId()) return;
    handler.setUserInfo(user);
  });

  /**
   * 문서 공유 페이지 전환 감지
   */
  room.addCommandListener(actions.SET_DOCUMENT_PAGE, (value: any) => {
    console.log('SET_DOCUMENT_PAGE : ', value);

    const {
      value: userId,
      attributes: { page }
    } = value;
    if (userId !== room.myUserId()) {
      handler.changeDocumentPage(Number(page));
    }
  });

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
  /**
   * @description 문서 공유 모드 설정 감지
   */
  room.addCommandListener(
    actions.SET_DOCUMENT_SHARE_IS_OPEN,
    (value: SET_DOCUMENT_SHARE_IS_OPEN_TYPE) => {
      const { value: userId, attributes } = value;
      presenter = userId;

      if (userId !== room.myUserId()) {
        handler.changeDocumentShareMode(attributes, userId);
      } else {
        handler.changeDocumentShareMode(attributes, 'localUser');
      }
    }
  );

  room.addCommandListener(
    actions.SET_DOCUMENT_SHARE_IS_CLOSE,
    (value: DEFAULT_PARAM) => {
      presenter = '';
      handler.changeDocumentShareMode(false);
    }
  );

  // /**
  //  * @description 드로잉 모드 설정 감지
  //  */
  room.addCommandListener(
    actions.SET_DRAWING_IS_SHARE,
    (value: SET_DRAWING_IS_SHARE_TYPE) => {
      const {
        value: userId,
        attributes: { isDrawingShare }
      } = value;
      const presenter = userId === room.myUserId() ? 'localUser' : userId;
      const isClosed = isDrawingShare === 'false';

      handler.changeDrawingShareMode(!isClosed, presenter);
    }
  );

  // /**
  //  * 드로잉 데이터 변경 감지
  //  */
  room.addCommandListener(
    actions.UPDATE_DOCUMENT_DATA,
    (value: UPDATE_DOCUMENT_DATA_TYPE) => {
      const {
        attributes: { documentData, selectResource },
        value: userId
      } = value;
      // 데이터 변경자가 본인과 다를 경우 캔버스 그리기
      if (userId !== room.myUserId()) {
        handler.changeDrawData(JSON.parse(documentData), selectResource);
      }
    }
  );

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

  /**
   * 새로 참가한 사람만 받아라 (문서공유)
   */
  room.addCommandListener(
    actions.DOCUMENT_SHARE_TARGET,
    (value: DOCUMENT_SHARE_TARGET_TYPE) => {
      if (room.myUserId() === value.attributes.target) {
        const { fileName, owner, resources, selectResource, objectData } =
          value.attributes;

        handler.changeDocumentShareMode(
          {
            fileName,
            owner,
            resources
          },
          value.value,
          Number(selectResource),
          JSON.parse(objectData)
        );
      }
    }
  );

  // /**
  //  * 새로 참가한 사람만 받아라 (드로잉공유)
  //  */
  room.addCommandListener(
    actions.DRAWING_SHARE_TARGET,
    (value: DRAWING_SHARE_TARGET_TYPE) => {
      if (room.myUserId() === value.attributes.target) {
        const drawingData = value.attributes.objectData
          ? JSON.parse(value.attributes.objectData)
          : [{ object: [] }];

        handler.changeDrawingShareMode(
          { resources: '[]', ...value.attributes }, // attributes
          value.value, // presenter Id
          0, //page
          drawingData[0].object ? [drawingData[0].object] : drawingData //documentData
        );
      }
    }
  );

  // 화상대화 전체 마이크 제어 요청자 사용자 정보 이벤트
  //- 마스터가 마이크 제어 모드 시작하기/종료하기
  room.addCommandListener(
    actions.REQUEST_MIC_CONTROL_USER,
    async (value: DEFAULT_PARAM) => {
      // console.log('REQUEST_MIC_CONTROL_USER[ 발언권 제어모드 ] : ', value);
      handler.changeMicControlUserModeByMaster(value.value);
    }
  );

  // // 화상대화 전체 마이크 제어 요청 이벤트
  // // - 마스터가 마이크 제어 mute를 함 사용자들은 마이크 임의로 킬 수 없음
  // // 간단한 토스트 메시지 띄움
  room.addCommandListener(
    actions.REQUEST_MIC_CONTROL,
    (value: REQUEST_MIC_CONTROL_TYPE) => {
      // console.log('REQUEST_MIC_CONTROL[ 마이크 전체 제어 ] : ', value);
      const {
        attributes: { controlType }
      } = value;

      if (value?.value === room.myUserId()) {
      } else {
        handler.changeMicControlModeByMaster(controlType === 'mute');
      }
    }
  );

  // // 화상대화 타겟 유저 마이크 제어 요청 이벤트
  // // - 마스터가 단일 마일 제어 id형식 8자
  room.addCommandListener(actions.REQUEST_MIC_CONTROL_TARGET, (value: any) => {
    console.log(
      'REQUEST_MIC_CONTROL_TARGET[ 특정 유저 마이크 제어 ] : ',
      value
    );
    if (room.myUserId() === value.attributes.target) {
      handler.changeMicMuteByMaster(value.attributes.isMute === 'true');
    }
  });

  room.addCommandListener(actions.GRANT_FLOOR, (value: any) => {
    console.log('GRANT_FLOOR : ', value);

    const result = JSON.parse(value.attributes.targetUser);
    // console.log('GRANT_FLOOR : ', result);
    if (result.find((e: any) => e.jitsiId === room.myUserId())) {
      if (value.attributes.type === 'reject') {
        handler.rejectedByMaster();
      } else {
        handler.changeMicMuteByMaster(false);
      }
    }
  });

  room.addCommandListener(
    actions.GRANT_FLOOR_TARGET,
    (value: GRANT_FLOOR_TARGET_TYPE) => {
      // [ 특정 유저 마이크 제어 ];
      console.log('GRANT_FLOOR_TARGET : ', value);
      
      const {
        attributes: { targetUser, isMasterControlTarget, type }
      } = value;

      // PARSE DATA TYPE : {jitsiId: string; name: string;}
      const targetUserInfo = JSON.parse(targetUser);
      const iMaster = isMasterControlTarget;
      if (targetUserInfo.jitsiId === room.myUserId()) {
        if (type === 'reject') {
          iMaster !== 'true' && handler.rejectedByMaster();
        } else if (type === 'accept') {
          handler.changeMicMuteByMaster(false);
        }
      } else if(value.value !== room.myUserId()){
        // const isProcessedMy = value.value === room.myUserId();
        handler.handleRequestFloor(targetUserInfo, true);
      }
    }
  );

  room.addCommandListener(
    actions.UPDATE_MASTER_USERS,
    (value: UPDATE_MASTER_USERS_TYPE) => {
      console.log('UPDATE_MASTER_USERS [ 마스터 유저 업데이트 시 ] : ', value);
      const { isRemoveAuth, myCommand } = value.attributes;
      handler.changeMasterList(isRemoveAuth, myCommand);
    }
  );

  room.addCommandListener(actions.REQUEST_KICK, (value: REQUEST_KICK) => {
    //강퇴 요청 리스너
    const {
      attributes: { targetUser: target, requestUser: master }
    } = value;

    // JSON-PARSE DATA TYPE {id: string, name: string}
    const { id: targetId } = JSON.parse(target);

    const isTargetMe = targetId === room.myUserId() ? true : false;

    handler.requestKick(master, target, isTargetMe);
  });

  //마스터유저로부터 마이크 권한 OFF
  room.addCommandListener(actions.STOP_FLOOR, (value: STOP_FLOOR_TYPE) => {
    console.log('STOP_FLOOR [ 마이크 권한 OFF ]: ', value);
    const { isMasterControlTarget , targetUser } = value.attributes;
    const result = JSON.parse(targetUser);

    // if (isMasterControlTarget === 'true') {
    //   // 내가 마스터일때
    // } else {
    // 내가 마스터가 아닐때
    if (value.value !== room.myUserId()) {
      if (result.jitsiId === room.myUserId()) {
        handler.changeMicMuteByMaster(true);
      } else {
        handler.changeMicMuteByMaster(undefined, result.name);
      }
      // }
    }
  });

  //마스터 일때 다른 유저로부터 마이크 권한 요쳥이 들어온 경우
  room.addCommandListener(
    actions.REQUEST_FLOOR,
    (value: REQUEST_FLOOR_TYPE) => {
      console.log('REQUEST_FLOOR [ 마이크 제어 권한 요청 ] : ', value);

      // PARSE DATA TYPE : {jitsiID: string; name: string;}
      const targetUser = JSON.parse(value.attributes.targetUser);
      if (value.value !== room.myUserId()) {
        handler.handleRequestFloor(targetUser, false);
      }
    }
  );

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
