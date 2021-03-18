import { wehagoBaseURL, securityRequest, serialize } from '../../utils';
import { getT } from '../../utils/translateManager';
export default {
  create: async (
    room_id,
    owner_id,
    owner_name,
    cno,
    ccode,
    a_token,
    r_token,
    HASH_KEY
  ) => {
    try {
      const url = `${wehagoBaseURL}/communication/rtc/videoChat`;
      const headers = securityRequest(a_token, r_token, url, HASH_KEY);
      const response = await fetch(url, {
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
      return response.json();
    } catch (err) {
      return err;
    }
  },

  sendWetalk: async (
    room_id,
    video_chat_id,
    cno,
    ccode,
    a_token,
    r_token,
    HASH_KEY
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

    try {
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
      const response = await fetch(url, requestData);
      return response.json();
    } catch (err) {
      throw err;
    }
  },

  check: async (conferenceId, a_token, r_token, HASH_KEY) => {
    try {
      const url = `${wehagoBaseURL}/communication/rtc/videoChat?video_chat_id=${conferenceId}`;
      const headers = securityRequest(a_token, r_token, url, HASH_KEY);
      const requestData = {
        method: 'GET',
        headers
      };
      const response = await fetch(url, requestData);
      const result = await response.json();
      return result;
    } catch (err) {
      return err;
    }
  },

  getParticipant: async (
    videoRoomId = null,
    a_token = null,
    r_token = null,
    HASH_KEY = null
  ) => {
    const t = getT();
    try {
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
      const response = await fetch(url, requestData);
      const result = await response.json();
      return result;
    } catch (e) {
      alert(t('alert.text.problem_ocurred'));
      return participant;
    }
  }
};
