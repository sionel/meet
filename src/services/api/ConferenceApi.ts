import { isSuccess } from '@services/types';
import { wehagoBaseURL, securityRequest, serialize } from '@utils/index';
import { getT } from '@utils/translateManager';
import Axios from './Axios';
import { conferenceCreateParams } from './types';
export default {
  create: async (bodyData: conferenceCreateParams) => {
    const {
      room_id, // 방 id
      portal_id: owner_id, // 유저아이디
      user_name: owner_name, // 유저이름
      last_access_company_no: cno, // 회사번호
      company_code: ccode, // 회사코드
      AUTH_A_TOKEN, // 토큰
      AUTH_R_TOKEN, // 토큰
      HASH_KEY
    } = bodyData;
    const url = `${wehagoBaseURL}/communication/rtc/videoChat`;
    const headers = securityRequest(AUTH_A_TOKEN, AUTH_R_TOKEN, url, HASH_KEY);
    const response = await Axios(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify({
        room_id,
        owner_id,
        owner_name,
        cno,
        ccode
      })
    });
    if (isSuccess(response)) {
      return response;
    } else {
      return response;
    }
  },

  sendWetalk: async (
    room_id: string,
    video_chat_id: any,
    cno: string,
    ccode: string,
    a_token: string,
    r_token: string,
    HASH_KEY: string
  ) => {
    let body = new FormData();
    // 가변값
    body.append('room_id', room_id);
    body.append('chat_type', '1');
    body.append('content_type', '8');
    body.append('content', '');
    body.append('service_code', 'webrtc');
    body.append('service_data', JSON.stringify([{ video_chat_id }]));
    body.append('mobile_key', video_chat_id);
    body.append('file', '');
    body.append('ccode', ccode);
    body.append('cno', cno);

    const bodyData = {
      room_id: room_id,
      chat_type: '1',
      content_type: '8',
      content: '',
      service_code: 'webrtc',
      service_data: JSON.stringify([{ video_chat_id }]),
      mobile_key: video_chat_id,
      file: '',
      ccode: ccode,
      cno: cno
    };

    const url = `${wehagoBaseURL}/communication/we-talk/talk-send`;
    const headers = securityRequest(a_token, r_token, url, HASH_KEY);
    const requestData = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...headers
      },
      // body
      body: serialize(bodyData)
    };
    const response = await Axios<any>(url, requestData);
    if (isSuccess(response)) {
      return response;
    } else {
      return response;
    }
  },

  check: async (
    conferenceId: string,
    a_token: string,
    r_token: string,
    HASH_KEY: string
  ) => {
    const url = `${wehagoBaseURL}/communication/rtc/videoChat?video_chat_id=${conferenceId}`;
    const headers = securityRequest(a_token, r_token, url, HASH_KEY);
    const requestData = {
      method: 'GET',
      headers
    };
    const response = await Axios(url, requestData);
    if (isSuccess(response)) {
      return response;
    } else {
      return response;
    }
  },

  getParticipant: async (
    videoRoomId = null,
    a_token = null,
    r_token = null,
    HASH_KEY = null
  ) => {
    const t = getT();

    if (!videoRoomId || !a_token || !r_token || !HASH_KEY) {
      return {
        resultCode: 404,
        resultData: []
      };
    }
    const url = `${wehagoBaseURL}/communication/rtc/videoChatMember?video_chat_id=${videoRoomId}`;
    const headers = securityRequest(a_token, r_token, url, HASH_KEY);
    const requestData = {
      method: 'GET',
      headers
    };
    const response = await Axios(url, requestData);
    if (isSuccess(response)) {
      return response;
    } else {
      return response;
    }
    //   const result = await response.json();
    //   return result;
    // } catch (e) {
    //   alert(t('alert_text_problem_ocurred'));
    //   return participant;
    // }
  }
};
