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
  constructor(room: any) {
    this._room = room;
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
}