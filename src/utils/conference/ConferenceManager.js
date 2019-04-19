/**
 * 화상대화
 **/
import JitsiMeetJS from '../../../jitsi/features/base/lib-jitsi-meet';
import config from './config';
import Connection from './Connection';
import ConferenceConnector from './ConferenceConnector';
import { actionCreators as localActionCreators } from '../../redux/modules/local';
import { actionCreators as mainUserActionCreators } from '../../redux/modules/mainUser';
import { actionCreators as participantsAcionCreators } from '../../redux/modules/participants';
// import APIManager from '../../services/api/ApiManager_new';
import APIManager from '../../services/api/ApiManager';

/**
 * ConferenceManager 화상대화 접속을 총괄하는 매니저
 */
class ConferenceManager {
  constructor(dispatch) {
    // Singleton
    if (!ConferenceManager.instance) {
      // 싱글톤 변수 할당
      ConferenceManager.instance = this;
      this._dispatch = dispatch;
    }
    return ConferenceManager.instance;
  }

  // #region Public Functions

  /**
   * connect : 화상대화 참가
   */
  join = async (roomName, name, handleClose, auth) => {
    // 초기화
    this._init();
    // 대화방 연결을 위한 Connection
    this._connection = new Connection();
    // 대화방 연결을 위한 ConferenceConnector
    this._conferenceConnector = new ConferenceConnector(
      this._createHandlers(handleClose)
    );
    // connection 연결
    await this._connection.connect(roomName.toLowerCase(), handleClose);
    // 대화방 참가
    await this._conferenceConnector.connect(
      this._connection,
      roomName.toLowerCase(),
      name,
      auth
    );

    this._apiManager = new APIManager(
      this._conferenceConnector.room.myUserId(),
      {
        roomId: roomName,
        name: name,
        a_token: auth.AUTH_A_TOKEN,
        r_token: auth.AUTH_R_TOKEN,
        hash_key: auth.HASH_KEY
      }
    );

    // 접속자 확인 로직
    // this._apiManager.getParticipant(1, result => {
    // 	if (result.length < 1) {
    // 		alert(1);
    // 	}
    // });

    this._apiManager.insertUser();

    const id = 'localUser';
    const tracks = this._conferenceConnector.tracks;
    const videoTrack = tracks.find(track => track.getType() === 'video');
    const audioTrack = tracks.find(track => track.getType() === 'audio');
    await this._dispatch(
      localActionCreators.joinConference({
        id,
        name,
        videoTrack,
        audioTrack
      })
    );
    this._dispatch(mainUserActionCreators.setMainUserNotExist(id));
  };

  /**
   * 연결을 해제한다.
   */
  dispose = async () => {
    // 대화방 삭제 및 나오기
    // if (this._apiManager) {
    //   await this._apiManager.deleteUser();
    // }

    if (this._conferenceConnector) {
      await this._conferenceConnector.dispose();
    }
    if (this._connection) {
      this._connection.dispose();
    }
    this._dispatch(localActionCreators.leaveConference());
  };

  /**
   * selectParticipant
   * 메인으로 선택된 사람의 화질을 높인다.
   */
  selectParticipant = id => {
    this._conferenceConnector.selectParticipant(id);
  };

  // #endregion

  /**
   * init: 화상대화 연결을 위한 초기화
   */
  _createHandlers = handleClose => {
    const handler = {
      JOIN_USER: this._joinUser,
      LEFT_USER: this._leftUser,
      ADD_REMOTE_TRACK: this._addRemoteTrack,
      VIDEO_MUTE_CHANGED: this._videoMutedChanged,
      SUSPEND_DETECTED: handleClose,
      SET_USER_INFO: this._setUserInfo,
      CHANGED_USER_STATUS: this._changedUserStatus,
      CHANGED_DOCUMENT_SHARE_MODE: this._changeDocumentShareMode
    };
    return handler;
  };

  /**
   * init: 화상대화 연결을 위한 초기화
   */
  _init = () => {
    // JitsiMeetJS 를 초기화 한다.
    JitsiMeetJS.init({
      ...config
    });

    // JitsiMeetJS Log Level을 설정한다.
    JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);
  };

  /**
   * JOIN_USER
   * 대화방에 참여자가 접속하면 호출된다.
   */
  _joinUser = user => {
    this._dispatch(participantsAcionCreators.joinUser(user));
  };

  /**
   * LEFT_USER
   * 대화방에 참여자가 나가면 호출된다.
   */
  _leftUser = id => {
    this._dispatch(participantsAcionCreators.leftUser(id));
  };

  /**
   * ADD_REMOTE_TRACK
   * 대화방에 참여자의 트랙이 추가되면 호출된다.
   */
  _addRemoteTrack = track => {
    this._dispatch(participantsAcionCreators.setRemoteTrack(track));
  };

  /**
   * VIDEO_MUTE_CHANGED
   * 카메라가 오프되면 발생한다.
   */
  _videoMutedChanged = track => {
    this._dispatch(participantsAcionCreators.updateMuteVideo(track));
  };

  /**
   * 위하고 아이디등 유저 정보를 설정한다.
   */
  _setUserInfo = (id, info) => {
    this._dispatch(participantsAcionCreators.setUserInfo(id, info));
  };

  /**
   *
   */
  _changedUserStatus = (userId, status) => {
    this._dispatch(participantsAcionCreators.changedStatus(userId, status));
  };

  /**
   * 문서공유/드로잉모드 전환
   */
  _changeDocumentShareMode = status => {
    this._dispatch(
      mainUserActionCreators.setDrawingMode(status === 'true' ? true : false)
    );
  };

  /**
   * setDrawingData
   * 드로잉데이터 전송
   */
  setDrawingData = data => {
    // alert(JSON.stringify(data));
    this._conferenceConnector.setDrawingData(data);
  };

  /**
   * setClear
   * 드로잉데이터 전송
   */
  setClear = () => {
    alert(111);
    this._conferenceConnector.setClear();
  };
}

export default ConferenceManager;
