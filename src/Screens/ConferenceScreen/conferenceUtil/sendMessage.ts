import { requestUser } from '@redux/master';
import { MeetApi } from '@services/index';
import DrawingMananger from './DrawingManager';
// 위하고 아이디 커멘드 이름 정의
const WEHAGO_ID = 'wehagoid';

// 드로잉 이미지 전달 커멘드 타입
const UPDATE_DRAWING_DATA = 'UPDATE_DRAWING_DATA';

// 드로잉 전체 지우기
// const CLEAR_DRAWING_CANVAS = 'CLEAR_DRAWING_CANVAS';
const CLEAR_DOCUMENT_CANVAS = 'CLEAR_DOCUMENT_CANVAS';

// 캔버스 뒤로가기 앞으로가기 커맨드 타입
const DRAWING_REDO_UNDO = 'DRAWING_REDO_UNDO';

// 문서 공유모드 설정 커맨드 타입
const SET_DOCUMENT_SHARE_IS_OPEN = 'SET_DOCUMENT_SHARE_IS_OPEN';
// 문서 공유모드 해제 커맨드 타입
const SET_DOCUMENT_SHARE_IS_CLOSE = 'SET_DOCUMENT_SHARE_IS_CLOSE';
// 드로잉 모드 설정 커맨드 타입
const SET_DRAWING_IS_SHARE = 'SET_DRAWING_IS_SHARE';

// 문서 공유 페이지 설정 커맨드 타입
const SET_DOCUMENT_PAGE = 'SET_DOCUMENT_PAGE';

// 문서공유 데이터 전달 커멘드 타입
const UPDATE_DOCUMENT_DATA = 'UPDATE_DOCUMENT_DATA';

// 특정 타켓한데만 전달 커맨드 타입
const DOCUMENT_SHARE_TARGET = 'DOCUMENT_SHARE_TARGET';
const DRAWING_SHARE_TARGET = 'DRAWING_SHARE_TARGET';

// const REQUEST_INVITE = 'CONFERENCE.EVENT.REQUEST.INVITE'; // 초대 요청 이벤트
// const REQUEST_KICK = 'CONFERENCE.EVENT.REQUEST.KICK'; // 추방 요청 이벤트

const REQUEST_MIC_CONTROL = 'CONFERENCE.EVENT.REQUEST.MIC_CONTROL'; // 화상대화 전체 마이크 제어 요청 이벤트
const REQUEST_MIC_CONTROL_USER = 'CONFERENCE.EVENT.REQUEST.MIC_CONTROL_USER'; // 화상대화 전체 마이크 제어 요청자 사용자 정보 이벤트
const REQUEST_MIC_CONTROL_TARGET =
  'CONFERENCE.EVENT.REQUEST.MIC_CONTROL_TARGET'; // 화상대화 타겟 유저 마이크 제어 요청 이벤트

// 제어중일때 발언권 요청 보낸 뒤 승인 또는 거부 이벤트 (마스터가 전체 발언권 허용)
const GRANT_FLOOR = 'GRANT_FLOOR';
// 제어중일때 발언권 요청 보낸 뒤 승인 또는 거부 이벤트 (마스터가 전체 특정 발언권 허용)
const GRANT_FLOOR_TARGET = 'GRANT_FLOOR_TARGET';

// 제어중일때 발언권 요청
const REQUEST_FLOOR = 'REQUEST_FLOOR';
// 제어중일때 발언권 취소
const STOP_FLOOR = 'STOP_FLOOR';

const KICK_PARTICIPANT = 'KICK_PARTICIPANT';

// const REQUEST_GET_CONTROL = 'CONFERENCE.EVENT.REQUEST.REQUEST_GET_CONTROL'; // 마스터 제어 권한 위임 요청 이벤트

// const RESPONSE_GET_CONTROL = 'CONFERENCE.EVENT.REQUEST.RESPONSE_GET_CONTROL'; // 마스터 제어 권한 위임 반환 이벤트

// 마스터 권한 유저 리스트 변경 이벤트
const UPDATE_MASTER_USERS = 'CONFERENCE.EVENT.REQUEST.UPDATE_MASTER_USERS';

// 마스터가 유저 추방
const REQUEST_KICK = 'CONFERENCE.EVENT.REQUEST.KICK';

const REQUEST_ROOM_STOP_RECORDING =
  'CONFERENCE.EVENT.ROOM.REQUEST_ROOM_STOP_RECORDING';
const REQUEST_ROOM_START_RECORDING =
  'CONFERENCE.EVENT.ROOM.REQUEST_ROOM_START_RECORDING';

export default class sendMessage {
  private _room: any;
  private _drawingManager: any;
  private _handlers: any;
  constructor(room: any, handler: any) {
    this._room = room;
    this._drawingManager = new DrawingMananger();
    this._handlers = handler;
  }

  sendWehagoId = (user: any) => {
    const attributes = {
      ...user
      // wehagoId: user.portal_id,
      // companyFullpath: user.last_company?.full_path,
      // profile_url: user.profile_url ? user.profile_url : '',
      // userName: user.name,
      // nickname: user.nickname,
      // isExternalParticipant: user.isLogin,
      // externalUserId: user.externalUser,
      // isMobile: true,
      // user_contact: user.user_contact,
      // user_email: user.user_eamil ? user.user_eamil : user.user_default_email,
      // avatar: user.avatar ? user.avatar : '{"label":"기본 제공 캐릭터1","value":"jangok"}'
    };

    // console.log('니 혹시 여러번 날아가나 진짜?');

    this._room.sendCommand(WEHAGO_ID, {
      value: this._room.myUserId(),
      attributes
    });
    return attributes;
  };

  // 스케치 모드를 알림
  setDrawingShareMode = (isDrawingShare: boolean) => {
    this._room.sendCommandOnce(SET_DRAWING_IS_SHARE, {
      value: this._room.myUserId(),
      attributes: { isDrawingShare }
    });
  };

  // 스케치한 데이터들을 회의 참가자들에게 전송
  setDrawingData = (data: any, page: any) => {
    // 로그 기록이 있을 경우 참여자들에게 기록 전송
    const newData = this._drawingManager.handleConvertFormat('mobile', data);

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
    this._handlers.changeDrawData(
      JSON.parse(newData.attributes.documentData),
      page
    );
  };

  // 문서공유를 알림
  setToogleDocumentShare = (attributes: any, user = 'ALL') => {
    const command = attributes
      ? SET_DOCUMENT_SHARE_IS_OPEN
      : SET_DOCUMENT_SHARE_IS_CLOSE;

    // 공유모드 설정 참가자들에게 공유
    this._room.sendCommandOnce(command, {
      value: this._room.myUserId(),
      attributes
    });

    this._handlers.changeDocumentShareMode(attributes, this._room.myUserId());
  };

  // 문서공유시 페이지 전환
  setDocumentPage = (page: number, presenter: string) => {
    if (presenter === 'localUser' || presenter === this._room.myUserId()) {
      this._room.sendCommandOnce(SET_DOCUMENT_PAGE, {
        value: this._room.myUserId(),
        attributes: { page: page }
      });
    }

    this._handlers.changeDocumentPage(page);
  };

  //스케치 및 문서공유 진행중 회의 참여 했을경우
  documentShareTarget = (user: any, documentData: any, mode: string) => {
    if (documentData.presenter === 'localUser') {
      const command =
        mode === 'document' ? DOCUMENT_SHARE_TARGET : DRAWING_SHARE_TARGET;

      this._room.sendCommandOnce(command, {
        value: this._room.myUserId(),
        attributes: {
          ...documentData.attributes,
          selectResource: documentData.page,
          target: user.jitsiId,
          objectData: JSON.stringify(documentData.documentData),
          from: 'mobile'
        }
      });
    }
  };

  stopAttention = (myName: string) => {
    // 이름이 담겨 있으면 본인이 끈거여서 이름을 보내서 마스터 하단에 메시지를 띄워줘야하고
    // 이름이 없으면 마스터가 껐기때문에 이름을 보내줄 필요 없음
    this._room.sendCommandOnce(STOP_FLOOR, {
      value: this._room.myUserId(),
      attributes: {
        targetUser: JSON.stringify({
          jitsiId: this._room.myUserId(),
          name: myName ? myName : null
        }),
        isMasterControlTarget: myName ? false : true
      }
    });
  };

  requestAttention = (myName: string) => {
    this._room.sendCommandOnce(REQUEST_FLOOR, {
      value: this._room.myUserId(),
      attributes: {
        targetUser: JSON.stringify({
          jitsiId: this._room.myUserId(),
          name: myName
        })
      }
    });
  };

  //마이크 제어모드
  micControlMode = async (
    flag: boolean,
    cno: string,
    roomToken: string,
    audio_active: boolean
  ) => {
    if (flag) {
      await this._room.sendCommandOnce(REQUEST_MIC_CONTROL_USER, {
        value: this._room.myUserId(),
        attributes: {}
      });

      this._room.sendCommandOnce(REQUEST_MIC_CONTROL, {
        value: this._room.myUserId(),
        attributes: { controlType: 'mute' }
      });

      let param = {
        audio_active: false,
        videoseq: this._room.myUserId()
      };

      MeetApi.updateMasterControlUser(cno, roomToken, param);
    } else {
      await this._room.sendCommandOnce(REQUEST_MIC_CONTROL, {
        value: this._room.myUserId(),
        attributes: { controlType: 'unmute' }
      });

      this._room.sendCommandOnce(REQUEST_MIC_CONTROL_USER, {
        attributes: {}
      });

      let param = {
        audio_active: true,
        videoseq: null
      };

      MeetApi.updateMasterControlUser(cno, roomToken, param);
    }
  };

  //다른 유저 마이크 요청처리
  replyUserRequest = (requestUser: requestUser, command: boolean) => {
    this._handlers.setRequestList(requestUser.jitsiId);
    if (command) {
      this._room.sendCommandOnce(GRANT_FLOOR_TARGET, {
        value: this._room.myUserId(),
        attributes: {
          targetUser: JSON.stringify({
            jitsiId: requestUser.jitsiId,
            name: requestUser.name
          }),
          type: 'accept',
          isMasterControlTarget: 'false'
        }
      });
    } else {
      this._room.sendCommandOnce(GRANT_FLOOR_TARGET, {
        value: this._room.myUserId(),
        attributes: {
          targetUser: JSON.stringify({
            jitsiId: requestUser.jitsiId,
            name: requestUser.name
          }),
          type: 'reject',
          isMasterControlTarget: 'false'
        }
      });
    }
  };

  handleOtherUserMikeDirectControl = (muteFlag: boolean, jitsiID: string) => {
    if (muteFlag) {
      //유저 마이크가 꺼져있을때
      this._room.sendCommandOnce(GRANT_FLOOR_TARGET, {
        value: this._room.myUserId(),
        attributes: {
          targetUser: JSON.stringify({
            jitsiId: jitsiID
          }),
          type: 'accept',
          isMasterControlTarget: 'false'
        }
      });
    } else {
      //유저 마이크가 켜져있을때
      this._room.sendCommandOnce(STOP_FLOOR, {
        value: this._room.myUserId(),
        attributes: {
          targetUser: JSON.stringify({
            jitsiId: jitsiID
          }),
          isMasterControlTarget: 'false'
        }
      });
    }
  };

  empowerMaster = async (
    wehagoID: string,
    removeAuthUser: string | undefined
  ) => {
    await this._room.sendCommandOnce(UPDATE_MASTER_USERS, {
      value: this._room.myUserId(),
      attributes: {
        isRemoveAuth: removeAuthUser,
        myCommand: true
      }
    });

    if (!removeAuthUser) {
      this._room.sendCommandOnce(GRANT_FLOOR_TARGET, {
        value: this._room.myUserId(),
        attributes: {
          targetUser: JSON.stringify({
            jitsiId: wehagoID
          }),
          type: 'reject',
          isMasterControlTarget: 'true'
        }
      });

      this._room.sendCommandOnce(STOP_FLOOR, {
        value: this._room.myUserId(),
        attributes: {
          targetUser: JSON.stringify({
            jitsiId: wehagoID
          }),
          isMasterControlTarget: 'true'
        }
      });
    }
  };

  kickUser = async (id: string, masterName: string, targetName: string) => {
    // this._room.kickParticipant(id);
    await this._room.sendCommandOnce(REQUEST_KICK, {
      value: this._room.myUserId(),
      attributes: {
        targetUser: JSON.stringify({
          id,
          name: targetName
        }),
        requestUser: JSON.stringify({
          jitsiId: this._room.myUserId(),
          name: masterName
        })
      }
    });
  };
}
