/**
 * We talk API
 * 사용자 관련 API
 * 참조 : http://wiki.duzon.com:8080/display/sky/3.+API
 */

import {
  isDev,
  meetURL,
  securityRequest,
  wehagoBaseURL0,
  wehagoBaseURL,
  serialize
} from '../../utils';
import * as CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';

const getToken = async accessUrl => {
  try {
    const url = `${wehagoBaseURL0}/get_token/?url=${accessUrl}`;
    const data = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    };

    const response = await fetch(url, data);

    return response.json();
  } catch (err) {
    return false;
  }
};

// #region
export default {
  // 3-1 화상회의방 생성
  createMeetRoom: async (auth, param) => {
    const { AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY, cno } = auth;
    const url = `${meetURL}/room?cno=${cno}`;
    const headers = securityRequest(AUTH_A_TOKEN, AUTH_R_TOKEN, url, HASH_KEY);
    try {
      const data = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify({
          ...param
        })
      };

      const response = await fetch(url, data);

      if (response.status !== 201) {
        throw response.resultCode;
      }
      return response.json();
    } catch (err) {
      console.warn('1.createMeetRoom : ', err);
      return false;
    }
  },

  // 3-2 화상회의방 상세 조회
  getMeetRoom: async (auth, roomId) => {
    const { AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY } = auth;
    const url = `${meetURL}/room?room=${roomId}`;
    const headers = securityRequest(AUTH_A_TOKEN, AUTH_R_TOKEN, url, HASH_KEY);
    try {
      const data = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      };

      const response = await fetch(url, data);
      if (response.status !== 200) {
        throw response.resultCode;
      }
      return response.json();
    } catch (err) {
      console.warn('2.getMeetRoom : ', err);
      return false;
    }
  },
  // 3-2-2 화상회의방 상세 조회
  getMeetRoomNoCert: async roomId => {
    let url = '';
    let signature;
    if (isDev) {
      url = `${meetURL}/room?room=${roomId}`;
    } else {
      const accsessUrl = `/video/room?room=${roomId}`;
      const token = await getToken(accsessUrl);
      const encText = accsessUrl + token.cur_date + token.token;
      const hashText = CryptoJS.SHA256(encText);
      signature = CryptoJS.enc.Base64.stringify(hashText);
      url = `${wehagoBaseURL0}${accsessUrl}`;
    }
    try {
      const data = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          signature: signature
        }
      };

      const response = await fetch(url, data);
      if (response.status !== 200) {
        throw await response.json();
      }
      return response.json();
    } catch (err) {
      console.warn('3-2-2.getMeetRoomNoCert : ', err);
      return false;
    }
  },

  // 3-3 화상회의방 수정
  updateMeetRoom: async (auth, roomId) => {
    const { AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY, cno } = auth;
    const url = `${meetURL}/room?cno=${cno}&room=${roomId}`;
    const headers = securityRequest(AUTH_A_TOKEN, AUTH_R_TOKEN, url, HASH_KEY);
    try {
      const data = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      };

      const response = await fetch(url, data);
      if (response.status !== 200) {
        throw response.resultCode;
      }
      return response.json();
    } catch (err) {
      console.warn('3.updateMeetRoom : ', err);
      return false;
    }
  },

  // 3-4 화상회의방 리스트 조회
  getMeetRoomsList: async auth => {
    const { AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY, cno } = auth;

    const url = `${meetURL}/room/list?cno=${cno}`;
    const headers = securityRequest(AUTH_A_TOKEN, AUTH_R_TOKEN, url, HASH_KEY);
    try {
      const data = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          ...headers
        }
      };
      const response = await fetch(url, data);
      if (response.status !== 200) {
        throw response;
      }
      const { resultData } = await response.json();
      return resultData;
    } catch (err) {
      console.log(err);
      debugger;
      const errDetail = await err.json();
      console.warn('4.getMeetRoomsList : ', errDetail);
      return false;
    }
  },

  getUserInfoList: async (auth, portalIdList) => {
    const { AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY, cno } = auth;

    // const url = `${config.baseTempApiHost}/user/userinfo/list`;

    const url = `${meetURL}/user/userinfo/list?cno=${cno}&portal_id=${portalIdList}`;
    const headers = securityRequest(AUTH_A_TOKEN, AUTH_R_TOKEN, url, HASH_KEY);

    try {
      const data = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          ...headers
        }
      };
      const response = await fetch(url, data);
      if (response.status !== 200) {
        throw response;
      }
      const { resultData } = await response.json();
      return resultData;
    } catch (err) {
      const errDetail = await err.json();
      console.warn('3-?? 사용자 프로필 리스트 : ', errDetail);
      return false;
    }
  },

  getUserList: async (auth, roomId) => {
    const { AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY, cno } = auth;

    // const url = `${config.baseTempApiHost}/user/userinfo/list`;

    const url = `${meetURL}/room/connecting-user?cno=${cno}&room=${roomId}`;
    const headers = securityRequest(AUTH_A_TOKEN, AUTH_R_TOKEN, url, HASH_KEY);

    try {
      const data = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          ...headers
        }
      };
      const response = await fetch(url, data);
      if (response.status !== 200) {
        throw response;
      }
      const { resultData } = await response.json();
      return resultData;
    } catch (err) {
      const errDetail = await err.json();
      console.warn('3-?? 사용자 프로필 리스트 : ', errDetail);
      return false;
    }
  },

  // 3-?? 회의 기록
  getMeetFinished: async (auth, start, end, offset, limit) => {
    const { AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY, cno } = auth;
    const param = serialize({ cno, start, end, offset, limit });
    const url = `${meetURL}/room/finished?${param}`;
    const headers = securityRequest(AUTH_A_TOKEN, AUTH_R_TOKEN, url, HASH_KEY);
    try {
      const data = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          ...headers
        }
      };
      const response = await fetch(url, data);
      if (response.status !== 200) {
        throw response;
      }
      const { resultData } = await response.json();
      return resultData;
    } catch (err) {
      const errDetail = await err.json();
      console.warn('3-?? 회의기록 : ', errDetail);
      return false;
    }
  },

  // 3-5 마스터 설정
  // 3-6 참가자 설정
  // 3-7 화상회의방 삭제
  // 3-8 화상회의방 종료 리스트 조회
  // 3-9 화상회의방 참가자 허용 리스트 조회
  getAccessUsers: async (auth, roomId) => {
    const { AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY, cno } = auth;

    const url = `${meetURL}/room/access-user?cno=${cno}&room=${roomId}`;
    const headers = securityRequest(AUTH_A_TOKEN, AUTH_R_TOKEN, url, HASH_KEY);

    try {
      const data = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          ...headers
        }
      };
      const response = await fetch(url, data);
      if (response.status !== 200) {
        throw response.resultCode;
      }
      const { resultData } = await response.json();
      return resultData;
    } catch (err) {
      console.warn('9.getAccessUsers : ', err);
      return false;
    }
  },

  // 3-10 화상회의방 접속중인 사용자 리스트 조회
  getParticipant: async (auth, roomId) => {
    const { AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY, cno } = auth;

    const url = `${meetURL}/room/connecting-user?cno=${cno}&room=${roomId}`;
    const headers = securityRequest(AUTH_A_TOKEN, AUTH_R_TOKEN, url, HASH_KEY);

    try {
      const data = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          ...headers
        }
      };
      const response = await fetch(url, data);
      if (response.status !== 200) {
        throw response.resultCode;
      }
      return response.json();
    } catch (err) {
      console.warn('10.getMeetRoomsList : ', err);
      return false;
    }
  },

  // 3-11 화상회의방 접속했던 사용자 리스트 조회

  // 3-12 화상회의 토큰 생성
  getMeetRoomToken: async (auth, roomId) => {
    const { AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY, cno } = auth;
    const url = `${meetURL}/token?cno=${cno}`;
    const headers = securityRequest(AUTH_A_TOKEN, AUTH_R_TOKEN, url, HASH_KEY);
    try {
      const data = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify({
          room: roomId
        })
      };

      const response = await fetch(url, data);
      if (response.status !== 200) {
        throw response.resultCode;
      }
      return response.json();
    } catch (err) {
      console.warn('12.getMeetRoomToken : ', err);
      return false;
    }
  },
  // 3-12-2 화상회의 토큰 생성 (email)
  getMeetRoomTokenEmail: async (room, emailToken, username) => {
    let url = '';
    let signature;
    if (isDev) {
      url = `${meetURL}/token`;
    } else {
      const accsessUrl = `/video/token`;
      const token = await getToken(accsessUrl);
      const encText = accsessUrl + token.cur_date + token.token;
      const hashText = CryptoJS.SHA256(encText);
      signature = CryptoJS.enc.Base64.stringify(hashText);
      url = `${wehagoBaseURL0}${accsessUrl}`;
    }

    try {
      const data = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          signature
        },
        body: JSON.stringify({
          room,
          token: emailToken,
          username
        })
      };

      const response = await fetch(url, data);
      if (response.status !== 200) {
        throw response.resultCode;
      }
      return response.json();
    } catch (err) {
      console.warn('12-2.getMeetRoomTokenEmail : ', err);
      return false;
    }
  },
  // 3-12-3 화상회의 토큰 생성 (joincode)
  getMeetRoomTokenJoincode: async (room, joincode, username, user) => {
    let url = '';
    let signature;
    if (isDev) {
      url = `${meetURL}/token`;
    } else {
      const accsessUrl = `/video/token`;
      const token = await getToken(accsessUrl);
      const encText = accsessUrl + token.cur_date + token.token;
      const hashText = CryptoJS.SHA256(encText);
      signature = CryptoJS.enc.Base64.stringify(hashText);
      url = `${wehagoBaseURL0}${accsessUrl}`;
    }

    try {
      const data = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          signature
        },
        body: JSON.stringify({
          room,
          joincode,
          username,
          user
        })
      };

      const response = await fetch(url, data);
      if (response.status !== 200) {
        throw response.resultCode;
      }
      return response.json();
    } catch (err) {
      console.warn('12-3 getMeetRoomTokenJoincode : ', err);
      return false;
    }
  },
  // 3-12-4 wehagoV화상회의 토큰 생성
  getMeetVRoomToken: async (auth, roomId, access_token) => {
    const { AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY, cno } = auth;
    const url = `${meetURL}/token?cno=${cno}`;
    const headers = securityRequest(AUTH_A_TOKEN, AUTH_R_TOKEN, url, HASH_KEY);
    try {
      const data = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify({
          room: roomId,
          access_token
        })
      };

      const response = await fetch(url, data);
      if (response.status !== 200) {
        throw response.resultCode;
      }
      return response.json();
    } catch (err) {
      console.warn('12-4.getMeetVRoomToken : ', err);
      return false;
    }
  },
  // 3-13 화상회의 접속
  enterMeetRoom: async (videoToken, videoseq, username) => {
    let url = '';
    let signature;
    if (isDev) {
      url = `${meetURL}/connect`;
    } else {
      const accsessUrl = `/video/connect`;
      const token = await getToken(accsessUrl);
      const encText = accsessUrl + token.cur_date + token.token;
      const hashText = CryptoJS.SHA256(encText);
      signature = CryptoJS.enc.Base64.stringify(hashText);
      url = `${wehagoBaseURL0}${accsessUrl}`;
    }

    try {
      const data = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          signature
        },
        body: JSON.stringify({
          token: videoToken,
          videoseq: videoseq,
          is_mobile: 'T',
          username
        })
      };

      const response = await fetch(url, data);
      if (response.status !== 200) {
        throw await response.json();
      }
      return response.json();
    } catch (err) {
      console.warn('13.enterMeetRoom : ', err);
      return false;
    }
  },

  // 6-2 화상회의 모바일 버전 체크
  checkVersion: async (os, major) => {
    let url = '';
    let signature;
    if (isDev) {
      url = `${meetURL}/mobile/version?os=${os}&major=${major}`;
    } else {
      const accsessUrl = `/video/mobile/version?os=${os}&major=${major}`;
      const token = await getToken(accsessUrl);
      const encText = accsessUrl + token.cur_date + token.token;
      const hashText = CryptoJS.SHA256(encText);
      signature = CryptoJS.enc.Base64.stringify(hashText);
      url = `${wehagoBaseURL0}${accsessUrl}`;
    }
    try {
      const data = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          signature
        }
      };

      const response = await fetch(url, data);

      if (response.status !== 200) {
        throw await response.json();
      }
      return response.json();
    } catch (err) {
      console.log(err);
      console.warn('6-2.checkVersion : ', err);
      return false;
    }
  },

  checkNotice: async () => {
    const date = new Date().getTime();

    let url = '';
    let signature;
    if (isDev) {
      url = `${meetURL}/mobile/noti?timestamp=${date}`;
    } else {
      const accsessUrl = `/video/mobile/noti?timestamp=${date}`;
      const token = await getToken(accsessUrl);
      const encText = accsessUrl + token.cur_date + token.token;
      const hashText = CryptoJS.SHA256(encText);
      signature = CryptoJS.enc.Base64.stringify(hashText);
      url = `${wehagoBaseURL0}${accsessUrl}`;
    }

    try {
      const data = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          signature
        }
      };

      const response = await fetch(url, data);
      if (response.status !== 200) {
        throw await response.json();
      }
      return response.json();
    } catch (err) {
      console.warn('6-3.checkNotice : ', err);
      return false;
    }
  },

  // 3-22 화상회의 접속코드 검색
  searchJoincode: async joincode => {
    let url = '';
    let signature;
    if (isDev) {
      url = `${meetURL}/joincode/search?joincode=${joincode}`;
    } else {
      const accsessUrl = `/video/joincode/search?joincode=${joincode}`;
      const token = await getToken(accsessUrl);
      const encText = accsessUrl + token.cur_date + token.token;
      const hashText = CryptoJS.SHA256(encText);
      signature = CryptoJS.enc.Base64.stringify(hashText);
      url = `${wehagoBaseURL0}${accsessUrl}`;
    }

    try {
      const data = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          signature
        }
      };

      const response = await fetch(url, data);
      if (response.status !== 200) {
        throw await response.json();
      }
      return response.json();
    } catch (err) {
      console.warn('21.checkNotice : ', err);
      return false;
    }
  },

  // 3-23 마스터 발언권 제어 유저 조회
  checkMasterControlUser: async roomId => {
    let url = '';
    let signature;
    if (isDev) {
      url = `${meetURL}/room/master/control/user?room=${roomId}`;
    } else {
      const accsessUrl = `/video/room/master/control/user?room=${roomId}`;
      const token = await getToken(accsessUrl);
      const encText = accsessUrl + token.cur_date + token.token;
      const hashText = CryptoJS.SHA256(encText);
      signature = CryptoJS.enc.Base64.stringify(hashText);
      url = `${wehagoBaseURL0}${accsessUrl}`;
    }

    try {
      const data = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          signature
        }
      };

      const response = await fetch(url, data);
      if (response.status !== 200) {
        throw await response.json();
      }
      return response.json();
    } catch (err) {
      console.warn('23.checkNotice : ', err);
      return false;
    }
  },

  // 3-27 화상회의방 접속중인 사용자 리스트 조회
  getParticipantCount: async roomId => {
    let url = '';
    let signature;
    if (isDev) {
      url = `${meetURL}/room/connecting/count?room=${roomId}`;
    } else {
      const accsessUrl = `/video/room/connecting/count?room=${roomId}`;
      const token = await getToken(accsessUrl);
      const encText = accsessUrl + token.cur_date + token.token;
      const hashText = CryptoJS.SHA256(encText);
      signature = CryptoJS.enc.Base64.stringify(hashText);
      url = `${wehagoBaseURL0}${accsessUrl}`;
    }

    try {
      const data = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          signature
        }
      };
      const response = await fetch(url, data);
      if (response.status !== 200) {
        throw response.resultCode;
      }
      return response.json();
    } catch (err) {
      console.warn('27.getParticipantCount : ', err);
      return false;
    }
  },

  // 3-29 마스터 발언권 제어 유저 조회
  checkMasterControl: async roomId => {
    let url = '';
    let signature;
    if (isDev) {
      url = `${meetURL}/room/master/control/user?room=${roomId}`;
    } else {
      const accsessUrl = `/video/room/master/control/user?room=${roomId}`;
      const token = await getToken(accsessUrl);
      const encText = accsessUrl + token.cur_date + token.token;
      const hashText = CryptoJS.SHA256(encText);
      signature = CryptoJS.enc.Base64.stringify(hashText);
      url = `${wehagoBaseURL0}${accsessUrl}`;
    }

    try {
      const data = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          signature
        }
      };

      const response = await fetch(url, data);
      if (response.status !== 200) {
        throw await response.json();
      }
      return response.json();
    } catch (err) {
      console.warn('20.checkVersion : ', err);
      return false;
    }
  },

  // 3-31 마스터 리스트 조회
  getMasterList: async roomToken => {
    let url = '';
    let signature;
    if (isDev) {
      url = `${meetURL}/room/masters?jwt=${roomToken}`;
    } else {
      const accsessUrl = `/video/room/masters?jwt=${roomToken}`;
      const token = await getToken(accsessUrl);
      const encText = accsessUrl + token.cur_date + token.token;
      const hashText = CryptoJS.SHA256(encText);
      signature = CryptoJS.enc.Base64.stringify(hashText);
      url = `${wehagoBaseURL0}${accsessUrl}`;
    }

    try {
      const data = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          signature
        }
      };

      const response = await fetch(url, data);
      if (response.status !== 200) {
        throw await response.json();
      }
      return response.json();
    } catch (err) {
      console.warn('31.getMasterList : ', err);
      return false;
    }
  },

  // 넘버링 없음 이름없는 외부참여자 아이디 가져오기
  getExternalUserId: async roomId => {
    let url = '';
    let signature;
    if (isDev) {
      url = `${meetURL}/user/default-name?room=${roomId}`;
    } else {
      const accsessUrl = `/video/user/default-name?room=${roomId}`;
      const token = await getToken(accsessUrl);
      const encText = accsessUrl + token.cur_date + token.token;
      const hashText = CryptoJS.SHA256(encText);
      signature = CryptoJS.enc.Base64.stringify(hashText);
      url = `${wehagoBaseURL0}${accsessUrl}`;
    }

    try {
      const data = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          signature
        }
      };

      const response = await fetch(url, data);
      if (response.status !== 200) {
        throw await response.json();
      }
      return response.json();
    } catch (err) {
      console.warn('20.checkVersion : ', err);
      return false;
    }
  },

  checkMasterList: async roomId => {
    let url = '';
    let signature;
    if (isDev) {
      url = `${meetURL}/master/remaining-master?room=${roomId}`;
    } else {
      const accsessUrl = `/video/master/remaining-master?room=${roomId}`;
      const token = await getToken(accsessUrl);
      const encText = accsessUrl + token.cur_date + token.token;
      const hashText = CryptoJS.SHA256(encText);
      signature = CryptoJS.enc.Base64.stringify(hashText);
      url = `${wehagoBaseURL0}${accsessUrl}`;
    }

    try {
      const data = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          signature
        }
      };

      const response = await fetch(url, data);
      if (response.status === 404) return { resultData: { count: 0 } };
      if (response.status !== 200) {
        throw await response.json();
      }
      return response.json();
    } catch (err) {
      console.warn('20.checkVersion : ', err);
      return false;
    }
  },

  // 공개방 참석 가능한 사람인지 확인(이메일만으로 확인)
  checkAccessUser: async (auth, roomId) => {
    const { AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY } = auth;
    const url = `${meetURL}/check/access_user?room=${roomId}`;
    const headers = securityRequest(AUTH_A_TOKEN, AUTH_R_TOKEN, url, HASH_KEY);
    try {
      const data = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      };

      const response = await fetch(url, data);

      if (response.status !== 200) {
        throw response.resultCode;
      }
      return response.json();
    } catch (err) {
      console.warn('42.checkAccessUser : ', err);
      return false;
    }
  },

  // auth가 있는 사람들 기준으로 access_token 요청
  getAccessToken: async (auth, room) => {
    const { AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY, portal_id } = auth;
    const url = `${meetURL}/token/access-token`;
    const headers = securityRequest(AUTH_A_TOKEN, AUTH_R_TOKEN, url, HASH_KEY);
    try {
      const data = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify({
          room,
          user_identify: portal_id
        })
      };

      const response = await fetch(url, data);
      if (response.status !== 200) {
        throw response.resultCode;
      }
      return response.json();
    } catch (err) {
      console.log(err);

      console.warn('39.getAccessToken : ', err);
      return false;
    }
  },

  // longpolling
  // 1. curl --location --request
  // POST 'http://localhost:8080/video/
  // lpevent?room=5114fd61-a596-4903-aa0f-33911a45964a&user_identify=e41d94ca-545a-46fd-9bb0-fca60c9e5502&timeout=60'
  longPolling: async (room, id) => {
    // const a = {
    //   extra_data: {
    //     type: 'join_response',
    //     status: 'allow',
    //     access_key: 'uPwTIyJoZPEMNzVMdCVDcmDNmbvGlwUErvCcGUt/8UccVVH6'
    //   }
    // };
    let url = '';
    let signature;
    // url = `${meetURL}/lpevent?room=${room}&user_identify=${id}&timeout=30`;
    // url = `http://localhost:8080/video/lpevent?room=5114fd61-a596-4903-aa0f-33911a45964a&user_identify=e41d94ca-545a-46fd-9bb0-fca60c9e5502&timeout=5`;
    // if (isDev) {
    //   url = `${meetURL}/lpevent?room=${room}&user_identify=${id}&timeout=60`;
    // } else {
    const accsessUrl = `/video/lpevent?room=${room}&user_identify=${id}&timeout=60`;
    const token = await getToken(accsessUrl);
    const encText = accsessUrl + token.cur_date + token.token;
    const hashText = CryptoJS.SHA256(encText);
    signature = CryptoJS.enc.Base64.stringify(hashText);
    // 운영기
    url = `${wehagoBaseURL0}${accsessUrl}`;
    // }

    try {
      const data = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          signature
        }
      };
      const response = await fetch(url, data);
      if (response.status !== 200) {
        throw response.resultCode;
      }
      return response.json();
    } catch (err) {
      console.log(err);

      console.warn('longPolling err : ', err);
      return false;
    }
  },
  requestTokenNonauth: async (room, id, name, joincode) => {
    let url = '';
    let signature;
    if (isDev) {
      url = `${meetURL}/standby/request/joinroom`;
    } else {
      const accsessUrl = `/video/standby/request/joinroom`;
      const token = await getToken(accsessUrl);
      const encText = accsessUrl + token.cur_date + token.token;
      const hashText = CryptoJS.SHA256(encText);
      signature = CryptoJS.enc.Base64.stringify(hashText);
      url = `${wehagoBaseURL0}${accsessUrl}`;
    }

    try {
      const data = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          signature
        },
        body: JSON.stringify({
          room,
          user_identify: id,
          user_name: name,
          joincode
        })
      };

      const response = await fetch(url, data);
      if (response.status !== 200) {
        throw response.resultCode;
      }
      return response.json();
    } catch (err) {
      console.warn('requestTokenNonauth : ', err);
      return false;
    }
  },
  requestTokenAuth: async (room, id, name, auth) => {
    const url = `${meetURL}/standby/request/joinroom`;

    const { AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY } = auth;
    const headers = securityRequest(AUTH_A_TOKEN, AUTH_R_TOKEN, url, HASH_KEY);

    try {
      const data = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify({
          room,
          user_identify: id,
          user_name: name
        })
      };

      const response = await fetch(url, data);
      if (response.status !== 200) {
        throw response.resultCode;
      }
      return response.json();
    } catch (err) {
      console.warn('requestTokenAuth : ', err);
      return false;
    }
  },

  checkWedrive: async auth => {
    const { AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY, cno } = auth;
    const url = `${wehagoBaseURL}/common/company/deploy/whether/employee?service_code=wedrive&cno=${cno}`;
    const headers = securityRequest(AUTH_A_TOKEN, AUTH_R_TOKEN, url, HASH_KEY);
    try {
      const data = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      };

      const response = await fetch(url, data);

      if (response.status !== 200) {
        throw response.resultCode;
      }
      return response.json();
    } catch (err) {
      console.warn('checkWedrive : ', err);
      return false;
    }
  },

  recordRequest: async (room, requestUser) => {
    let url = '';
    let signature;
    if (isDev) {
      url = `${meetURL}/record/request`;
    } else {
      const accsessUrl = `/video/record/request`;
      const token = await getToken(accsessUrl);
      const encText = accsessUrl + token.cur_date + token.token;
      const hashText = CryptoJS.SHA256(encText);
      signature = CryptoJS.enc.Base64.stringify(hashText);
      url = `${wehagoBaseURL0}${accsessUrl}`;
    }

    try {
      const data = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          signature
        },
        body: JSON.stringify({
          room,
          request_user: requestUser
        })
      };
      const response = await fetch(url, data);
      if (response.status !== 200) {
        throw await response.json();
      }
      return response.json();
    } catch (err) {
      console.warn('recordRequest : ', err);
      return false;
    }
  },

  checkTest: async () => {
    const accsessUrl = '/test';
    // const signature = await getSignature(accsessUrl);
    const url = `${meetURL}${accsessUrl}`;
    try {
      const data = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const response = await fetch(url, data);
      if (response.status !== 200) {
        throw await response.json();
      }
      return response.json();
    } catch (err) {
      console.warn('22.checkTest : ', err);
      return false;
    }
  }
};
// #endregion
