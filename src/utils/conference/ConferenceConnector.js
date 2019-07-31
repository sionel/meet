import JitsiMeetJS from '../../../jitsi/features/base/lib-jitsi-meet';
import config from './config';
import { getDrawingManager } from '../../utils';
import DrawingMananger from '../../utils/DrawingManager';

// 위하고 아이디 커멘드 이름 정의
const WEHAGO_ID = 'wehagoid';
// 드로잉 이미지 전달 커멘드 타입
export const UPDATE_DRAWING_DATA = 'UPDATE_DRAWING_DATA';
// 드로잉 전체 지우기
// export const CLEAR_DRAWING_CANVAS = 'CLEAR_DRAWING_CANVAS';
export const CLEAR_DOCUMENT_CANVAS = 'CLEAR_DOCUMENT_CANVAS';
// 문서공유 모드 설정 커맨드 타입
export const SET_DRAWING_IS_SHARE = 'SET_DRAWING_IS_SHARE';
// 캔버스 뒤로가기 앞으로가기 커맨드 타입
export const DRAWING_REDO_UNDO = 'DRAWING_REDO_UNDO';

// 문서 공유모드 설정 커맨드 타입
export const SET_DOCUMENT_SHARE_IS_OPEN = 'SET_DOCUMENT_SHARE_IS_OPEN';

// 문서 공유모드 해제 커맨드 타입
export const SET_DOCUMENT_SHARE_IS_CLOSE = 'SET_DOCUMENT_SHARE_IS_CLOSE';

// 문서 공유 페이지 설정 커맨드 타입
export const SET_DOCUMENT_PAGE = 'SET_DOCUMENT_PAGE';

// 문서공유 데이터 전달 커멘드 타입
export const UPDATE_DOCUMENT_DATA = 'UPDATE_DOCUMENT_DATA';

// 특정 타켓한데만 전달 커맨드 타입
export const DOCUMENT_SHARE_TARGET = 'DOCUMENT_SHARE_TARGET';

/**
 * ConferenceConnector
 * 화상회의 방 생성/참가 및 디바이스 연결을 담당하는 클래스
 */
class ConferenceConnector {
  constructor(handlers) {
    // room : 화상대화방
    this._room = null;
    this._tracks = [];
    this._handlers = handlers;
    // this.isShareMode = {
    //   share: false,
    //   attributes: false,
    //   drawingData: []
    // };
    // 드로잉 클래스
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
  connect = (connection, roomName, name, auth) => {
    return new Promise(async (resolve, reject) => {
      // 참여할 room object 생성
      this._room = this._createRoom(connection, roomName);
      // 이벤트 연결
      this._bindEvents(resolve, reject);
      // 트랙 생성
      const tracks = await this._createTracks();
      // 트랙 추가
      this._addTracks(tracks);
      // display Name 설정
      this._room.setDisplayName(name);
      // wehago id를 커맨드로 전송한다.
      // this._room.sendCommand(WEHAGO_ID, {
      this._room.sendCommand(WEHAGO_ID, {
        value: this._room.myUserId(),
        attributes: {
          wehagoId: auth.portal_id,
          companyFullpath: auth.last_company.full_path,
          profile_url: auth.profile_url ? auth.profile_url : ''
        }
      });

      // 대화방 참가
      this._room.join();

      return this._room;
    });
  };

  /**
   * 자원정리 및 대화방 나가기
   */
  dispose = async () => {
    if (this._room) {
      try {
        if (this._room.presenter === this._room.myUserId()) {
          this._room.sendCommandOnce(SET_DOCUMENT_SHARE_IS_CLOSE, {
            value: this._room.myUserId(),
            attributes: null
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
   * 화상대화방 관련 이벤트를 바인딩한다.
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
        this._handlers.CHANGED_USER_STATUS(userId, status);
        resolve(this._room);
      }
    );
    // ===== Additional ===== //

    // 대화방 참가 성공 이벤트 연결
    this._room.on(conferenceEvents.CONFERENCE_JOINED, () => {
      resolve(this._room);
    });

    // 컨퍼런스 참가 실패 이벤트 연결
    this._room.on(conferenceEvents.CONFERENCE_FAILED, () => {
      reject(new Error('컨퍼런스 참가에 실패했습니다.'));
    });

    // JOIN_USER 이벤트 연결
    this._room.on(conferenceEvents.USER_JOINED, (id, user) => {
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
    this._room.on(conferenceEvents.SUSPEND_DETECTED, () =>
      this._handlers.SUSPEND_DETECTED()
    );

    // 위하고 접속 아이디 및 정보 가져오기
    this._room.addCommandListener(WEHAGO_ID, user => {
      // console.log('user : ', user);
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

    /**
     * 문서 공유/드로잉 설정 감지
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
        // console.log('documentData', documentData);
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
     * 새로 참가한 사람만 받아라
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
  };

  /**
   * 트랙을 생성한다.
   */
  _createTracks = async () => {
    const devices = ['video', 'audio'];
    const tracks = await JitsiMeetJS.createLocalTracks({
      devices,
      resolution: 720
    });
    return tracks;
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
   * 드로잉 모드 전환 공유
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
      this._room.sendCommandOnce(DOCUMENT_SHARE_TARGET, {
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

  //#endregion
}

export default ConferenceConnector;
