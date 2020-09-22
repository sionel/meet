/**
 * We talk API
 * 사용자 관련 API
 * 참조 : http://wiki.duzon.com:8080/display/sky/3.+API
 */

import { meetURL, securityRequest } from '../../utils';

// #region
export default {
  // 3-1 화상회의방 생성
  createMeetRoom: async (a_token, r_token, HASH_KEY, cno, param) => {
    const url = `${meetURL}/room?cno=${cno}`;
    const headers = securityRequest(a_token, r_token, url, HASH_KEY);
    //service_code = videoconference || communication || schedule
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
        throw response.resultCode;
      }
      return response.json();
    } catch (err) {
      console.warn('4.getMeetRoomsList : ', err);
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

  // 3-13 화상회의 접속
  enterMeetRoom: async (a_token, r_token, HASH_KEY, token, videoseq) => {
    const url = `${meetURL}/connect`;
    const headers = securityRequest(a_token, r_token, url, HASH_KEY);
    try {
      const data = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify({
          token: token,
          videoseq: videoseq
        })
      };

      const response = await fetch(url, data);
      if (response.status !== 200) {
        throw response.json();
      }
      return response.json();
    } catch (err) {
      console.warn('13.enterMeetRoom : ', err);
      return false;
    }
  },

  // 3-20 화상회의 모바일 버전 체크
  checkVersion: async (a_token, r_token, HASH_KEY) => {
    const url = `${meetURL}/mobile/version/check`;
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
        throw response.json();
      }
      return response.json();
    } catch (err) {
      console.warn('20.enterMeetRoom : ', err);
      return false;
    }
  }
};
// #endregion
