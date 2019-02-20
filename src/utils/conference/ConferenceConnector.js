import JitsiMeetJS from "../../../jitsi/features/base/lib-jitsi-meet";
import config from "./config";

// 위하고 아이디 커멘드 이름 정의
const WEHAGO_ID = "wehagoid";

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
      this._room.sendCommandOnce(WEHAGO_ID, {
        value: this._room.myUserId(),
        attributes: {
          wehagoId: auth.portal_id,
          companyFullpath: auth.last_company.full_path,
          profile_url: auth.profile_url ? auth.profile_url : ""
        }
      });

      // 대화방 참가
      this._room.join();
    });
  };

  /**
   * 자원정리 및 대화방 나가기
   */
  dispose = async () => {
    if (this._room) {
      try {
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
    // 대화방 참가 성공 이벤트 연결
    this._room.on(conferenceEvents.CONFERENCE_JOINED, () => {
      resolve(this._room);
    });

    // 컨퍼런스 참가 실패 이벤트 연결
    this._room.on(conferenceEvents.CONFERENCE_FAILED, () => {
      reject(new Error("컨퍼런스 참가에 실패했습니다."));
    });

    // JOIN_USER 이벤트 연결
    this._room.on(conferenceEvents.USER_JOINED, (id, user) =>
      this._handlers.JOIN_USER(user)
    );

    // JOIN_USER 이벤트 연결
    this._room.on(conferenceEvents.USER_LEFT, id =>
      this._handlers.LEFT_USER(id)
    );

    // 트랙추가 이벤트 연결
    this._room.on(conferenceEvents.TRACK_ADDED, track => {
      if (!track.isLocal()) {
        this._handlers.ADD_REMOTE_TRACK(track);
      }
    });

    // 비디오 Mute 변경
    this._room.on(conferenceEvents.TRACK_MUTE_CHANGED, track => {
      if (track.getType() === "video") {
        this._handlers.VIDEO_MUTE_CHANGED(track);
      }
    });

    // SUSPEND_DETECTED
    this._room.on(conferenceEvents.SUSPEND_DETECTED, () =>
      this._handlers.SUSPEND_DETECTED()
    );

    // 위하고 접속 아이디 및 정보 가져오기
    this._room.addCommandListener(WEHAGO_ID, user => {
      const id = user.value;
      this._handlers.SET_USER_INFO(id, user.attributes);
    });
  };

  /**
   * 트랙을 생성한다.
   */
  _createTracks = async () => {
    const devices = ["video", "audio"];
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

  //#endregion
}

export default ConferenceConnector;
