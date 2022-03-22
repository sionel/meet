import JitsiMeetJS from '@jitsi/base/lib-jitsi-meet';
import config from './config';
import { getDrawingManager } from '@utils/index';
import DrawingMananger from '@utils/DrawingManager';

// 위하고 아이디 커멘드 이름 정의
const WEHAGO_ID = 'wehagoid';

// 드로잉 이미지 전달 커멘드 타입
export const UPDATE_DRAWING_DATA = 'UPDATE_DRAWING_DATA';

// 드로잉 전체 지우기
// export const CLEAR_DRAWING_CANVAS = 'CLEAR_DRAWING_CANVAS';
export const CLEAR_DOCUMENT_CANVAS = 'CLEAR_DOCUMENT_CANVAS';

// 캔버스 뒤로가기 앞으로가기 커맨드 타입
export const DRAWING_REDO_UNDO = 'DRAWING_REDO_UNDO';

// 문서 공유모드 설정 커맨드 타입
export const SET_DOCUMENT_SHARE_IS_OPEN = 'SET_DOCUMENT_SHARE_IS_OPEN';
// 문서 공유모드 해제 커맨드 타입
export const SET_DOCUMENT_SHARE_IS_CLOSE = 'SET_DOCUMENT_SHARE_IS_CLOSE';
// 드로잉 모드 설정 커맨드 타입
export const SET_DRAWING_IS_SHARE = 'SET_DRAWING_IS_SHARE';

// 문서 공유 페이지 설정 커맨드 타입
export const SET_DOCUMENT_PAGE = 'SET_DOCUMENT_PAGE';

// 문서공유 데이터 전달 커멘드 타입
export const UPDATE_DOCUMENT_DATA = 'UPDATE_DOCUMENT_DATA';

// 특정 타켓한데만 전달 커맨드 타입
export const DOCUMENT_SHARE_TARGET = 'DOCUMENT_SHARE_TARGET';
export const DRAWING_SHARE_TARGET = 'DRAWING_SHARE_TARGET';

// export const REQUEST_INVITE = 'CONFERENCE.EVENT.REQUEST.INVITE'; // 초대 요청 이벤트
// export const REQUEST_KICK = 'CONFERENCE.EVENT.REQUEST.KICK'; // 추방 요청 이벤트

export const REQUEST_MIC_CONTROL = 'CONFERENCE.EVENT.REQUEST.MIC_CONTROL'; // 화상대화 전체 마이크 제어 요청 이벤트
export const REQUEST_MIC_CONTROL_USER =
  'CONFERENCE.EVENT.REQUEST.MIC_CONTROL_USER'; // 화상대화 전체 마이크 제어 요청자 사용자 정보 이벤트
export const REQUEST_MIC_CONTROL_TARGET =
  'CONFERENCE.EVENT.REQUEST.MIC_CONTROL_TARGET'; // 화상대화 타겟 유저 마이크 제어 요청 이벤트

// 제어중일때 발언권 요청 보낸 뒤 승인 또는 거부 이벤트 (마스터가 전체 발언권 허용)
export const GRANT_FLOOR = 'GRANT_FLOOR';
// 제어중일때 발언권 요청 보낸 뒤 승인 또는 거부 이벤트 (마스터가 전체 특정 발언권 허용)
export const GRANT_FLOOR_TARGET = 'GRANT_FLOOR_TARGET';

// 제어중일때 발언권 요청
export const REQUEST_FLOOR = 'REQUEST_FLOOR';
// 제어중일때 발언권 취소
export const STOP_FLOOR = 'STOP_FLOOR';

export const KICK_PARTICIPANT = 'KICK_PARTICIPANT';

// export const REQUEST_GET_CONTROL = 'CONFERENCE.EVENT.REQUEST.REQUEST_GET_CONTROL'; // 마스터 제어 권한 위임 요청 이벤트

// export const RESPONSE_GET_CONTROL = 'CONFERENCE.EVENT.REQUEST.RESPONSE_GET_CONTROL'; // 마스터 제어 권한 위임 반환 이벤트

// 마스터 권한 유저 리스트 변경 이벤트
export const UPDATE_MASTER_USERS =
  'CONFERENCE.EVENT.REQUEST.UPDATE_MASTER_USERS';

// 마스터가 유저 추방
export const REQUEST_KICK = 'CONFERENCE.EVENT.REQUEST.KICK';

export const REQUEST_ROOM_STOP_RECORDING =
  'CONFERENCE.EVENT.ROOM.REQUEST_ROOM_STOP_RECORDING';
export const REQUEST_ROOM_START_RECORDING =
  'CONFERENCE.EVENT.ROOM.REQUEST_ROOM_START_RECORDING';

/**
 * ConferenceConnector
 * 화상회의 방 생성/참가 및 디바이스 연결을 담당하는 클래스
 */
class ConferenceConnector {
  constructor(handlers) {
    // room : 화상회의방
    this._room = null;
    this._tracks = [];
    this._handlers = handlers;
    // this.isShareMode = {
    //   share: false,
    //   attributes: false,
    //   drawingData: []
    // };
    // 드로잉 클래스
    this._sessionID = null;
    this._drawingManager = new DrawingMananger();
  }

  get tracks() {
    return this._tracks;
  }

  get room() {
    return this._room;
  }
  //#region Public Functions

  /**
   * 대화방 참가
   */
  connect = (connection, roomName, tracks, attributes) => {
    return new Promise(async (resolve, reject) => {
      // 참여할 room object 생성
      this._room = this._createRoom(connection, roomName);
      // 이벤트 연결
      await this._bindEvents(resolve, reject);
      // 트랙 생성
      // if (!tracks) tracks = await this._createTracks();
      // 트랙 추가
      this._addTracks(tracks);
      this.tracks = tracks;
      // wehago id를 커맨드로 전송한다.
      this._room.sendCommand(WEHAGO_ID, {
        value: this._room.myUserId(),
        attributes
      });

      // 대화방 참가
      await this._room.join();
    });
  };

  /**
   * 자원정리 및 대화방 나가기
   */
  dispose = async () => {
    if (this._room) {
      try {
        this._removeEvents();
        if (this._room.presenter === this._room.myUserId()) {
          this._room.sendCommandOnce(SET_DOCUMENT_SHARE_IS_CLOSE, {
            value: this._room.myUserId(),
            attributes: null
          });
          this._room.sendCommandOnce(SET_DRAWING_IS_SHARE, {
            value: this._room.myUserId(),
            attributes: { isDrawingShare: 'false' }
          });
        }
        await this._room.leave();
        this._room = null;
      } catch (error) {
        // Nothing to do
      }
    }
  };

  /**
   * selectParticipant
   * 메인으로 선택된 사람의 화질을 높인다.
   */
  selectParticipant = id => {
    this._room.selectParticipant(id);
  };

  setDocumentData = data => {
    this._room.documentData = data;
  };
  //#endregion

  //#region Private Functions

  /**
   * 참가할 대화방을 생성한다.(실제 화상회의의 방을 생성하는 것은 아님)
   */
  _createRoom = (connection, roomName) => {
    const options = Object.assign({}, config);
    const room = connection.jitsiConnection.initJitsiConference(
      roomName,
      options
    );
    return room;
  };

  /**
   * 화상회의방 관련 이벤트를 바인딩한다.
   */
  _bindEvents = (resolve, reject) => {
    const conferenceEvents = JitsiMeetJS.events.conference;

    // ===== Additional ===== //
    this._room.on(conferenceEvents.CONNECTION_DROPPED_ERROR, () => {});

    this._room.on(
      conferenceEvents.PARTICIPANT_CONN_STATUS_CHANGED,
      (userId, status) => {
        /**
         * active : 카메라 꺼졌을 때
         * inactive : 참여했을 때
         * interrupted : 연결이 끊어졌을 때 - 네트워크
         * restoring : 복원중 - 네트워크 - 해결메시지가 없음! : 일단 무시
         */
        // this._handlers.CHANGED_USER_STATUS(userId, status);
        // resolve(this._room);
      }
    );
    // ===== Additional ===== //
    // this._room.on(
    //   conferenceEvents.CONFERENCE_CREATED_TIMESTAMP,
    //   createdTime => {
    //     this._handlers.CREATED_TIME(createdTime);
    //   }
    // );

    // 대화방 참가 성공 이벤트 연결
    this._room.on(conferenceEvents.CONFERENCE_JOINED, () => {
      // this._handlers.CONFERENCE_JOINED(this._room);
      resolve(this._room);
    });

    // 컨퍼런스 참가 실패 이벤트 연결
    this._room.on(conferenceEvents.CONFERENCE_FAILED, () => {
      reject(new Error('컨퍼런스 참가에 실패했습니다.'));
    });

    // JOIN_USER 이벤트 연결
    this._room.on(conferenceEvents.USER_JOINED, (id, user) => {
      if (new Set(['wehagorecord', 'wehagorecord-dev']).has(user.getStatsID()))
        return;
      this._handlers.JOIN_USER(user);
    });

    // LEFT_USER 이벤트 연결
    this._room.on(conferenceEvents.USER_LEFT, id => {
      if (this._room.presenter === id) {
        this._handlers.CHANGED_DOCUMENT_SHARE_MODE(false, false);
      }
      this._handlers.LEFT_USER(id);
    });

    // 트랙추가 이벤트 연결
    this._room.on(conferenceEvents.TRACK_ADDED, track => {
      if (!track.isLocal()) {
        this._handlers.ADD_REMOTE_TRACK(track);
      }
    });

    // 비디오 Mute 변경
    this._room.on(conferenceEvents.TRACK_MUTE_CHANGED, track => {
      if (track.getType() === 'video') {
        this._handlers.VIDEO_MUTE_CHANGED(track);
      }
      // this._handlers.VIDEO_MUTE_CHANGED(track);
    });

    // SUSPEND_DETECTED
    this._room.on(conferenceEvents.SUSPEND_DETECTED, () => {
      this._handlers.SUSPEND_DETECTED();
    });

    this._room.on(conferenceEvents.MESSAGE_RECEIVED, (user, text, date) => {
      this._handlers.MESSAGE_RECEIVED(user, text, date);
    });

    this._room.on(conferenceEvents.RECORDER_STATE_CHANGED, data => {
      const { _status, _sessionID, _initiator } = data;
      if ((_initiator || this._room.isModerator()) && _status === 'on') {
        this._handlers.START_RECORDING();
        this._sessionID = _sessionID;
      }

      if (_status === 'off') {
        this._handlers.STOP_RECORDING();
        this._sessionID = null;
      }
    });
    // ======== addEventListener ========== //

    // 위하고 접속 아이디 및 정보 가져오기
    this._room.addCommandListener(WEHAGO_ID, user => {
      const id = user.value;
      this._handlers.SET_USER_INFO(id, user.attributes);
      //
    });

    /**
     * 문서 공유 페이지 전환 감지
     */
    this._room.addCommandListener(SET_DOCUMENT_PAGE, value => {
      const {
        value: userId,
        attributes: { page }
      } = value;
      if (userId !== this._room.myUserId()) {
        this._handlers.CHANGED_DOCUMENT_PAGE(Number(page));
      }
    });

    this._room.on(conferenceEvents.RECORDER_STATE_CHANGED, data => {
      const { _status, _sessionID } = data;
      if (_status === 'on' && this._sessionID === null) {
        this._handlers.START_RECORDING();
        this._sessionID = _sessionID;
      } else if (_status === 'off') {
        this._handlers.STOP_RECORDING();
        this._sessionID = null;
      }
    });
    /**
     * @description 문서 공유 모드 설정 감지
     */
    this._room.addCommandListener(SET_DOCUMENT_SHARE_IS_OPEN, value => {
      const { value: userId, attributes } = value;
      // if (attributes.user === 'ALL' || attributes.user === this._room.myUserId())
      this._room.presenter = userId;
      if (userId !== this._room.myUserId()) {
        this._handlers.CHANGED_DOCUMENT_SHARE_MODE(attributes, userId);
      } else {
        this._handlers.CHANGED_DOCUMENT_SHARE_MODE(attributes, 'localUser');
      }
    });
    this._room.addCommandListener(SET_DOCUMENT_SHARE_IS_CLOSE, value => {
      // const { value: userId } = value;
      // if (userId !== this._room.myUserId()) {
      this._handlers.CHANGED_DOCUMENT_SHARE_MODE(false, false);
      // }
    });

    /**
     * @description 드로잉 모드 설정 감지
     */
    this._room.addCommandListener(SET_DRAWING_IS_SHARE, value => {
      const {
        value: userId,
        attributes: { isDrawingShare }
      } = value;
      const presenter = userId === this._room.myUserId() ? 'localUser' : userId;
      const isClosed = isDrawingShare === 'false';

      this._handlers.CHANGED_DRAWING_SHARE_MODE(!isClosed, presenter);
    });

    /**
     * 드로잉 데이터 변경 감지
     */
    this._room.addCommandListener(UPDATE_DOCUMENT_DATA, value => {
      const {
        attributes: { documentData, from, selectResource },
        value: userId
      } = value;

      // 데이터 변경자가 본인과 다를 경우 캔버스 그리기
      if (userId !== this._room.myUserId()) {
        // const _drawData = JSON.parse(drawData);
        // this._drawingManager.handleConvertFormat('web', value);
        this._handlers.CHANGED_DRAW_DATA(
          JSON.parse(documentData),
          selectResource
        );
      }
    });

    /**
     * 드로잉 캔버스 클리어 감지
     */
    this._room.addCommandListener(CLEAR_DOCUMENT_CANVAS, value => {
      // if (!this._drawingManager) {
      //   this._drawingManager = getDrawingManager();
      // }

      const { value: userId } = value;

      if (
        userId !== this._room.myUserId() &&
        this._drawingManager &&
        this._drawingManager.get('canvas')
      ) {
        this._drawingManager.clearAll();
      }
    });

    /**
     * 드로잉 뒤로가기, 앞으로가기 감지
     */
    this._room.addCommandListener(DRAWING_REDO_UNDO, value => {
      if (!this._drawingManager) {
        this._drawingManager = getDrawingManager();
      }

      const { attributes, value: userId } = value;

      if (userId !== this._room.myUserId() && this._drawingManager) {
        // 아이디랑 타입 보내기
        // redo
        // if (attributes.type === "redo") this._drawingManager.redo();
        // undo
        // if (attributes.type === "undo") this._drawingManager.undo();
      }
    });

    /**
     * 새로 참가한 사람만 받아라 (문서공유)
     */
    this._room.addCommandListener(DOCUMENT_SHARE_TARGET, value => {
      if (this._room.myUserId() === value.attributes.target) {
        this._handlers.CHANGED_DOCUMENT_SHARE_MODE(
          {
            fileName: value.attributes.fileName,
            owner: value.attributes.owner,
            resources: value.attributes.resources
          },
          value.value,
          Number(value.attributes.selectResource),
          JSON.parse(value.attributes.objectData)
        );
      }
    });

    /**
     * 새로 참가한 사람만 받아라 (드로잉공유)
     */
    this._room.addCommandListener(DRAWING_SHARE_TARGET, value => {
      if (this._room.myUserId() === value.attributes.target) {
        const drawingData = value.attributes.objectData
          ? JSON.parse(value.attributes.objectData)
          : [{ object: [] }];
        this._handlers.CHANGED_DRAWING_SHARE_MODE(
          { resources: '[]', ...value.attributes }, // attributes
          value.value, // presenter Id
          0, //page
          drawingData[0].object ? [drawingData[0].object] : drawingData //documentData
        );
      }
    });

    // 화상대화 전체 마이크 제어 요청 이벤트
    // - 마스터가 마이크 제어 mute를 함 사용자들은 마이크 임의로 킬 수 없음
    // 간단한 토스트 메시지 띄움
    this._room.addCommandListener(REQUEST_MIC_CONTROL, value => {
      console.log('REQUEST_MIC_CONTROL[ 마이크 전체 제어 ] : ', value);
      const {
        attributes: { controlType }
      } = value;
      this._handlers.CHANGED_MIC_CONTROL_MODE_BY_MASTER(controlType === 'mute');
      // value.attribute === 'mute' ? true : false
    });

    // 화상대화 전체 마이크 제어 요청자 사용자 정보 이벤트
    //- 마스터가 마이크 제어 모드 시작하기/종료하기
    this._room.addCommandListener(REQUEST_MIC_CONTROL_USER, value => {
      console.log('REQUEST_MIC_CONTROL_USER[ 발언권 제어모드 ] : ', value);
      this._handlers.CHANGED_MIC_CONTROL_USER_MODE_BY_MASTER(value.value);
    });

    // 화상대화 타겟 유저 마이크 제어 요청 이벤트
    // - 마스터가 단일 마일 제어 id형식 8자
    this._room.addCommandListener(REQUEST_MIC_CONTROL_TARGET, value => {
      console.log(
        'REQUEST_MIC_CONTROL_TARGET[ 특정 유저 마이크 제어 ] : ',
        value
      );
      if (this._room.myUserId() === value.attributes.target) {
        this._handlers.CHANGED_MIC_MUTE_BY_MASTER(
          value.attributes.isMute === 'true'
        );
      }
    });

    this._room.addCommandListener(GRANT_FLOOR, value => {
      const result = JSON.parse(value.attributes.targetUser);
      console.log('GRANT_FLOOR : ', result);
      if (result.find(e => e.jitsiId === this._room.myUserId())) {
        if (value.attributes.type === 'reject') {
          this._handlers.REJECTED_BY_MASTER();
        } else {
          this._handlers.CHANGED_MIC_MUTE_BY_MASTER(false);
        }
      }
    });

    this._room.addCommandListener(GRANT_FLOOR_TARGET, value => {
      const result = JSON.parse(value.attributes.targetUser);
      const iMaster = value.attributes.isMasterControlTarget;
      console.log('GRANT_FLOOR_TARGET : ', value);

      if (result.jitsiId === this._room.myUserId()) {
        if (value.attributes.type === 'reject') {
          iMaster !== 'true' && this._handlers.REJECTED_BY_MASTER();
        } else if (value.attributes.type === 'accept') {
          this._handlers.CHANGED_MIC_MUTE_BY_MASTER(false);
        }
      }
    });

    this._room.addCommandListener(UPDATE_MASTER_USERS, value => {
      const { cancel, myCommand } = value.attributes;
      console.log('UPDATE_MASTER_USERS : ', value);
      this._handlers.CHANGE_MASTER_LIST(cancel, myCommand);
    });

    this._room.addCommandListener(REQUEST_KICK, value => {
      const target = value.attributes.targetUser;
      const master = value.attributes.requestUser;
      this._handlers.REQUEST_KICK(master, target);
    });

    this._room.addCommandListener(STOP_FLOOR, value => {
      console.log('STOP_FLOOR : ', value);
      this._handlers.STOP_FLOOR();
      const result = JSON.parse(value.attributes.targetUser);
      if (
        result.jitsiId === this._room.myUserId() &&
        value.value !== this._room.myUserId() &&
        value.attributes.isMasterControlTarget !== 'true'
      ) {
        // 본인이 끈건지 마스터가 끈건지 판단
        this._handlers.CHANGED_MIC_MUTE_BY_MASTER(true);
      } else {
      }
    });

    this._room.addCommandListener(REQUEST_FLOOR, value => {
      console.log('REQUEST_FLOOR : ', value);
      const targetUser = JSON.parse(value.attributes.targetUser);

      
      //권한요청 받았을때( 권한요청자와 마스터가 다른 사람일경우)
      if (value.value !== this._room.myUserId()) {

        // this._room.sendCommandOnce(GRANT_FLOOR_TARGET, {
        //   value: this._room.myUserId(),
        //   attributes: {
        //     targetUser: JSON.stringify({
        //       jitsiId: targetUser.jitsiId,
        //       name: targetUser.name
        //     }),
        //     type: 'reject',
        //     isMasterControlTarget: 'false'
        //   }
        // });
      }
    });

    this._room.addCommandListener(REQUEST_ROOM_STOP_RECORDING, value => {
      if (this._room.isModerator()) {
        if (this._sessionID) {
          this._room.stopRecording(this._sessionID);
        }
      }
    });
    // 방 녹화 요청 이벤트 핸들러
    this._room.addCommandListener(REQUEST_ROOM_START_RECORDING, value => {
      const {
        attributes: { user }
      } = value;
      if (this._room.isModerator()) {
        // 녹화 요청 등록 API 호출
        this._handlers.REQUEST_RECORD_USER(user);
        // 녹화 시작
        this._room.startRecording({
          mode: 'file',
          appData: JSON.stringify({
            file_recording_metadata: {
              share: true
            }
          })
        });
      }
    });
  };

  _removeEvents = () => {
    this._room.removeCommandListener(WEHAGO_ID);
    this._room.removeCommandListener(SET_DOCUMENT_PAGE);
    this._room.removeCommandListener(SET_DOCUMENT_SHARE_IS_OPEN);
    this._room.removeCommandListener(SET_DOCUMENT_SHARE_IS_CLOSE);
    this._room.removeCommandListener(SET_DRAWING_IS_SHARE);
    this._room.removeCommandListener(UPDATE_DOCUMENT_DATA);
    this._room.removeCommandListener(CLEAR_DOCUMENT_CANVAS);
    this._room.removeCommandListener(DRAWING_REDO_UNDO);
    this._room.removeCommandListener(DOCUMENT_SHARE_TARGET);
    this._room.removeCommandListener(DRAWING_SHARE_TARGET);
    this._room.removeCommandListener(REQUEST_MIC_CONTROL);
    this._room.removeCommandListener(REQUEST_MIC_CONTROL_USER);
    this._room.removeCommandListener(REQUEST_MIC_CONTROL_TARGET);
    this._room.removeCommandListener(GRANT_FLOOR);
    this._room.removeCommandListener(STOP_FLOOR);
    this._room.removeCommandListener(GRANT_FLOOR_TARGET);
    this._room.removeCommandListener(UPDATE_MASTER_USERS);
    this._room.removeCommandListener(REQUEST_KICK);
    this._room.removeCommandListener(REQUEST_ROOM_STOP_RECORDING);
    this._room.removeCommandListener(REQUEST_ROOM_START_RECORDING);
    this._room.removeCommandListener(REQUEST_FLOOR);
  };

  /**
   * 트랙을 생성한다.
   */
  _createTracks = async () => {
    // const devices = ['video', 'audio'];
    // const tracks = await JitsiMeetJS.createLocalTracks({
    //   devices,
    //   resolution: 320
    // });
    const videoTrack = await JitsiMeetJS.createLocalTracks({
      devices: ['video'],
      resolution: 320
    });
    const audioTrack = await JitsiMeetJS.createLocalTracks({
      devices: ['audio'],
      resolution: 320
    });

    return [videoTrack[0], audioTrack[0]];
  };

  /**
   * 트랙을 추가한다.
   */
  _addTracks = tracks => {
    // 기존에 트랙이 있다면 dispose한다.
    this._tracks.forEach(async track => await track.dispose());
    // 대화방에 트랙을 추가한다.
    tracks.forEach(track => this._room.addTrack(track));
    this._tracks = tracks;
  };

  /**
   * 문서공유 모드 전환 공유
   */
  setToogleDocumentShare = (attributes, user = 'ALL') => {
    const command = attributes
      ? SET_DOCUMENT_SHARE_IS_OPEN
      : SET_DOCUMENT_SHARE_IS_CLOSE;
    // 공유모드 설정 참가자들에게 공유

    this._room.sendCommandOnce(command, {
      value: this._room.myUserId(),
      attributes
    });
    this._handlers.CHANGED_DOCUMENT_SHARE_MODE(
      attributes,
      this._room.myUserId()
    );
  };

  /**
   * 페이지 전환 공유
   */
  setDocumentPage = (page, presenter) => {
    if (presenter === 'localUser' || presenter === this._room.myUserId()) {
      this._room.sendCommandOnce(SET_DOCUMENT_PAGE, {
        value: this._room.myUserId(),
        attributes: { page: page }
      });
    }
    this._handlers.CHANGED_DOCUMENT_PAGE(page);
  };

  /**
   * @description setDrawingShare
   * 드로잉 모드 전환 공유
   */
  setDrawingShareMode = isDrawingShare => {
    this._room.sendCommandOnce(SET_DRAWING_IS_SHARE, {
      value: this._room.myUserId(),
      attributes: { isDrawingShare }
    });
  };
  /**
   *
   */
  setDrawingData = (data, page) => {
    // 로그 기록이 있을 경우 참여자들에게 기록 전송
    const newData = this._drawingManager.handleConvertFormat('mobile', data);
    // this._room.sendCommand(UPDATE_DOCUMENT_DATA, {
    this._room.sendCommandOnce(UPDATE_DOCUMENT_DATA, {
      value: this._room.myUserId(),
      attributes: {
        documentData: newData.attributes.documentData,
        selectResource: page,
        width: newData.attributes.width,
        height: newData.attributes.height,
        from: 'mobile'
      }
    });
    this._handlers.CHANGED_DRAW_DATA(
      JSON.parse(newData.attributes.documentData),
      page
    );
  };

  /**
   *
   */
  setClear = () => {
    // 지우기 액션 send
    this._drawingManager.clearAll();
    // this._room.sendCommandOnce(CLEAR_DRAWING_CANVAS, {
    this._room.sendCommandOnce(CLEAR_DRAWING_CANVAS, {
      value: this._room.myUserId()
    });
  };

  documentShareTarget = (user, documentData) => {
    if (documentData.presenter === 'localUser') {
      const command =
        documentData.mode === 'document'
          ? DOCUMENT_SHARE_TARGET
          : DRAWING_SHARE_TARGET;
      this._room.sendCommandOnce(command, {
        value: this._room.myUserId(),
        attributes: {
          ...documentData.attributes,
          selectResource: documentData.page,
          target: user.id,
          objectData: JSON.stringify(documentData.documentData),
          from: 'mobile'
        }
      });
    }
  };

  requestAttention = name => {
    this._room.sendCommandOnce(REQUEST_FLOOR, {
      value: this._room.myUserId(),
      attributes: {
        targetUser: JSON.stringify({
          jitsiId: this._room.myUserId(),
          name
        })
      }
    });
  };

  stopAttention = name => {
    // 이름이 담겨 있으면 본인이 끈거여서 이름을 보내서 마스터 하단에 메시지를 띄워줘야하고
    // 이름이 없으면 마스터가 껐기때문에 이름을 보내줄 필요 없음
    this._room.sendCommandOnce(STOP_FLOOR, {
      value: this._room.myUserId(),
      attributes: {
        targetUser: JSON.stringify({
          jitsiId: this._room.myUserId(),
          name: name ? name : null
        }),
        isMasterControlTarget: name ? false : true
      }
    });
  };

  //추방
  kickUserFromMaster = async (id, masterName, targetName) => {
    // this._room.kickParticipant(id);
    await this._room.sendCommandOnce(REQUEST_KICK, {
      value: id,
      attributes: {
        targetUser: JSON.stringify({
          id,
          name: targetName ? targetName : null
        }),
        requestUser: JSON.stringify({
          jitsiId: this._room.myUserId(),
          name: masterName ? masterName : null
        })
      }
    });
  };
  //#endregion

  //마스터권한 부여하기
  updateRolefromMaster = async (newMaster, cancel) => {
    await this._room.sendCommandOnce(UPDATE_MASTER_USERS, {
      value: this._room.myUserId(),
      attributes: {
        cancel,
        myCommand: true
      }
    });

    if (!cancel) {
      this._room.sendCommandOnce(GRANT_FLOOR_TARGET, {
        value: this._room.myUserId(),
        attributes: {
          targetUser: JSON.stringify({
            jitsiId: newMaster
          }),
          type: 'reject',
          isMasterControlTarget: 'true'
        }
      });

      this._room.sendCommandOnce(STOP_FLOOR, {
        value: this._room.myUserId(),
        attributes: {
          targetUser: JSON.stringify({
            jitsiId: newMaster
          }),
          isMasterControlTarget: 'true'
        }
      });
    }
  };

  //발언권 제어모드
  micControlFromMaster = async flag => {
    if (flag) {
      await this._room.sendCommandOnce(REQUEST_MIC_CONTROL_USER, {
        value: this._room.myUserId(),
        attributes: {}
      });

      this._room.sendCommandOnce(REQUEST_MIC_CONTROL, {
        value: this._room.myUserId(),
        attributes: { controlType: 'mute' }
      });
    } else {
      await this._room.sendCommandOnce(REQUEST_MIC_CONTROL, {
        value: this._room.myUserId(),
        attributes: { controlType: 'unmute' }
      });

      this._room.sendCommandOnce(REQUEST_MIC_CONTROL_USER, {
        attributes: {}
      });
    }
  };
}

export default ConferenceConnector;
