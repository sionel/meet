/**
 * We talk API
 * 사용자 관련 API
 * 참조 : http://wiki.duzon.com:8080/display/sky/3.+API
 */

import { meetURL, securityRequest, wehagoBaseURL0 } from '../../utils';
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
  createMeetRoom: async (a_token, r_token, HASH_KEY, cno, param) => {
    const url = `${meetURL}/room?cno=${cno}`;
    const headers = securityRequest(a_token, r_token, url, HASH_KEY);
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
  getMeetRoom: async (a_token, r_token, HASH_KEY, roomId) => {
    const url = `${meetURL}/room?room=${roomId}`;
    const headers = securityRequest(a_token, r_token, url, HASH_KEY);
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
    const accsessUrl = `/video/room?room=${roomId}`;
    const token = await getToken(accsessUrl);
    const encText = accsessUrl + token.cur_date + token.token;
    const hashText = CryptoJS.SHA256(encText);
    const signature = CryptoJS.enc.Base64.stringify(hashText);

    // 운영기
    const url = `${wehagoBaseURL0}${accsessUrl}`;
    // 개발기
    // const url = `${meetURL}/room?room=${roomId}`;

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
  updateMeetRoom: async (a_token, r_token, HASH_KEY, cno, roomId) => {
    const url = `${meetURL}/room?cno=${cno}&room=${roomId}`;
    const headers = securityRequest(a_token, r_token, url, HASH_KEY);
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
  getMeetRoomsList: async (a_token, r_token, cno, user_id, HASH_KEY) => {
    const url = `${meetURL}/room/list?cno=${cno}`;
    const headers = securityRequest(a_token, r_token, url, HASH_KEY);
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
      return response.json();
    } catch (err) {
      const errDetail = await err.json();
      console.warn('4.getMeetRoomsList : ', errDetail);
      return false;
    }
  },

  // 3-5 마스터 설정
  // 3-6 참가자 설정
  // 3-7 화상회의방 삭제
  // 3-8 화상회의방 종료 리스트 조회
  // 3-9 화상회의방 참가자 허용 리스트 조회
  getAccessUsers: async (a_token, r_token, HASH_KEY, cno, roomId) => {
    const url = `${meetURL}/room/access-user?cno=${cno}&room=${roomId}`;
    const headers = securityRequest(a_token, r_token, url, HASH_KEY);

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
      console.warn('9.getAccessUsers : ', err);
      return false;
    }
  },

  // 3-10 화상회의방 접속중인 사용자 리스트 조회
  getParticipant: async (a_token, r_token, HASH_KEY, cno, roomId) => {
    const url = `${meetURL}/room/connecting-user?cno=${cno}&room=${roomId}`;
    const headers = securityRequest(a_token, r_token, url, HASH_KEY);

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
  getMeetRoomToken: async (a_token, r_token, HASH_KEY, cno, roomId) => {
    const url = `${meetURL}/token?cno=${cno}`;
    const headers = securityRequest(a_token, r_token, url, HASH_KEY);
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
    const accsessUrl = `/video/token`;
    const token = await getToken(accsessUrl);
    const encText = accsessUrl + token.cur_date + token.token;
    const hashText = CryptoJS.SHA256(encText);
    const signature = CryptoJS.enc.Base64.stringify(hashText);

    // 운영기
    const url = `${wehagoBaseURL0}${accsessUrl}`;
    // 개발기
    // const url = `${meetURL}/token`;

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
      console.warn('12.getMeetRoomToken : ', err);
      return false;
    }
  },
  // 3-12-3 화상회의 토큰 생성 (joincode)
  getMeetRoomTokenJoincode: async (room, joincode, username, user) => {
    const accsessUrl = `/video/token`;
    const token = await getToken(accsessUrl);
    const encText = accsessUrl + token.cur_date + token.token;
    const hashText = CryptoJS.SHA256(encText);
    const signature = CryptoJS.enc.Base64.stringify(hashText);

    // 운영기
    const url = `${wehagoBaseURL0}${accsessUrl}`;
    // 개발기
    // const url = `${meetURL}/token`;

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
  // 3-13 화상회의 접속
  enterMeetRoom: async (videoToken, videoseq) => {
    const accsessUrl = `/video/connect`;
    const token = await getToken(accsessUrl);
    const encText = accsessUrl + token.cur_date + token.token;
    const hashText = CryptoJS.SHA256(encText);
    const signature = CryptoJS.enc.Base64.stringify(hashText);

    // 운영기
    const url = `${wehagoBaseURL0}${accsessUrl}`;
    // 개발기
    // const url = `${meetURL}/connect`;

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
          is_mobile: 'T'
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
  checkVersion: async () => {
    const date = new Date().getTime();

    const accsessUrl = `/video/mobile/version?timestamp=${date}`;
    const token = await getToken(accsessUrl);
    const encText = accsessUrl + token.cur_date + token.token;
    const hashText = CryptoJS.SHA256(encText);
    const signature = CryptoJS.enc.Base64.stringify(hashText);

    // 운영기
    const url = `${wehagoBaseURL0}${accsessUrl}`;
    // 개발기
    // const url = `${meetURL}/mobile/version?timestamp=${date}`;

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
      console.warn('6-2.checkVersion : ', err);
      return false;
    }
  },

  checkNotice: async () => {
    const date = new Date().getTime();

    const accsessUrl = `/video/mobile/noti?timestamp=${date}`;
    const token = await getToken(accsessUrl);
    const encText = accsessUrl + token.cur_date + token.token;
    const hashText = CryptoJS.SHA256(encText);
    const signature = CryptoJS.enc.Base64.stringify(hashText);

    // 운영기
    const url = `${wehagoBaseURL0}${accsessUrl}`;
    // 개발기
    // const url = `${meetURL}/mobile/noti?timestamp=${date}`;

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
    const accsessUrl = `/video/joincode/search?joincode=${joincode}`;
    const token = await getToken(accsessUrl);
    const encText = accsessUrl + token.cur_date + token.token;
    const hashText = CryptoJS.SHA256(encText);
    const signature = CryptoJS.enc.Base64.stringify(hashText);

    // 운영기
    const url = `${wehagoBaseURL0}${accsessUrl}`;
    // 개발기
    // const url = `${meetURL}/joincode/search?joincode=${joincode}`;

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
    const accsessUrl = `/video/room/master/control/user?room=${roomId}`;
    const token = await getToken(accsessUrl);
    const encText = accsessUrl + token.cur_date + token.token;
    const hashText = CryptoJS.SHA256(encText);
    const signature = CryptoJS.enc.Base64.stringify(hashText);

    // 운영기
    const url = `${wehagoBaseURL0}${accsessUrl}`;
    // 개발기
    // const url = `${meetURL}/room/master/control/user?room=${roomId}`;

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
    const accsessUrl = `/video/room/connecting/count?room=${roomId}`;
    const token = await getToken(accsessUrl);
    const encText = accsessUrl + token.cur_date + token.token;
    const hashText = CryptoJS.SHA256(encText);
    const signature = CryptoJS.enc.Base64.stringify(hashText);

    // 운영기
    const url = `${wehagoBaseURL0}${accsessUrl}`;
    // 개발기
    // const url = `${meetURL}/room/connecting/count?room=${roomId}`;

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
    const accsessUrl = `/video/room/master/control/user?room=${roomId}`;
    const token = await getToken(accsessUrl);
    const encText = accsessUrl + token.cur_date + token.token;
    const hashText = CryptoJS.SHA256(encText);
    const signature = CryptoJS.enc.Base64.stringify(hashText);

    // 운영기
    const url = `${wehagoBaseURL0}${accsessUrl}`;
    // 개발기
    // const url = `${meetURL}/room/master/control/user?room=${roomId}`;

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
    const accsessUrl = `/video/room/masters?jwt=${roomToken}`;
    const token = await getToken(accsessUrl);
    const encText = accsessUrl + token.cur_date + token.token;
    const hashText = CryptoJS.SHA256(encText);
    const signature = CryptoJS.enc.Base64.stringify(hashText);

    // 운영기
    const url = `${wehagoBaseURL0}${accsessUrl}`;
    // 개발기
    // const url = `${meetURL}/room/masters?jwt=${roomToken}`;

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
    const accsessUrl = `/video/user/default-name?room=${roomId}`;
    const token = await getToken(accsessUrl);
    const encText = accsessUrl + token.cur_date + token.token;
    const hashText = CryptoJS.SHA256(encText);
    const signature = CryptoJS.enc.Base64.stringify(hashText);

    // 운영기
    const url = `${wehagoBaseURL0}${accsessUrl}`;
    // 개발기
    // const url = `${meetURL}/user/default-name?room=${roomId}`;

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
    const accsessUrl = `/video/master/remaining-master?room=${roomId}`;
    const token = await getToken(accsessUrl);
    const encText = accsessUrl + token.cur_date + token.token;
    const hashText = CryptoJS.SHA256(encText);
    const signature = CryptoJS.enc.Base64.stringify(hashText);

    // 운영기
    const url = `${wehagoBaseURL0}${accsessUrl}`;
    // 개발기
    // const url = `${meetURL}/master/remaining-master?room=${roomId}`;

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

  checkTest: async () => {
    const accsessUrl = '/test';
    // const signature = await getSignature(accsessUrl);
    const url = `${meetURL}${accsessUrl}`;
    try {
      const data = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
          // signature
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
