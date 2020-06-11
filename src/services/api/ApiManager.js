// import $ from 'jquery';
import CryptoJS from 'crypto-js';
import config from './config';
import { securityRequest, serialize } from '../../utils';
import { Platform } from 'react-native';

const os = Platform.OS;

const baseApiUrl = config.baseApiUrl;
const baseGuestUrl = config.baseGuestUrl;
const baseGuestApiUrl = config.baseGuestApiUrl;
const wehagoBaseURL = config.wehagoBaseURL;

class APIManager {
  /**
   * constructor
   */
  constructor(connectionId, info) {
    // 초기 설정
    this.connectionId = connectionId;
    this.info = info;
    this.dummyWehagoId = this._createRandomString(); // FIXME - 비회원일 때 아이디 만들어야하는데 비회원은 아이디가 없어서 만들어준다. 나중에 고쳐라
  }

  /**
   * 접속자 확인
   */
  getParticipant = async (videoRoomId, callback) => {
    let participant = [];
    try {
      const url = `${baseApiUrl}videoChatMember?video_chat_id=${videoRoomId}`;
      const headers = this._makeHeaders(url);
      return {
        signature,
        ...headers
      };
      const result = await fetch(url, headers);
      participant = await result.json();
      callback(participant.resultData);
    } catch (e) {
      alert('사소한 문제가 발생했습니다. 다시 시도해 주세요');
      return participant;
    }
  };

  /**
   * 방에 유저가 참여하면 Wehago에 알림
   *
   * 파라미터
   * video_chat_id: 화상채팅방 id,
   * user_id: 참여자 id,
   * user_name: 참여자 이름,
   * video_seq: 비디오 시퀀스,
   * user_device: 디바이스 구분 (1. WEB 2.IOS 3.Android),
   * user_type: 사용자 타입 (1. 위하고 회원 2 외부 사용자)
   */
  insertUser = async () => {
    try {
      const { roomId } = this.info;
      let data = {
        video_chat_id: roomId,
        video_seq: this.connectionId,
        user_id: this.info.userId,
        user_name: this.info.userName,
        user_device: os === 'ios' ? 2 : 3,
        user_type: 1,
        IS_MOBILE: 'T'
      };

      const isLogin = false; // 외부접속인지
      // 로그인한 사용자 일 때
      if (!isLogin) {
        // insert api 호출 (참가)
        const endPoint = 'videoChatMember';
        const url = `${wehagoBaseURL}${endPoint}`;
        const headers = securityRequest(
          this.info.a_token,
          this.info.r_token,
          url,
          this.info.hash_key
        );

        const response = await this._callApi(url, data, 'POST', xhr => {
          xhr.setRequestHeader('transaction-id', headers['transaction-id']);
          xhr.setRequestHeader('Authorization', headers['Authorization']);
          xhr.setRequestHeader('wehago-sign', headers['wehago-sign']);
          xhr.setRequestHeader('client-id', headers['client-id']);
          xhr.setRequestHeader('timestamp', headers['timestamp']);
          xhr.setRequestHeader('service', headers['service']);
        });

        // if (response.resultData === 1) console.log('response', response);
        // else console.log('또안돼');
      } else {
        // 외부접속(비인증) 일 때
      }
    } catch (error) {
      console.log('insertUser ERROR : ', error);
    }
  };

  /**
   * Delete User
   * 사용 안함
   */
  deleteUser = async () => {
    try {
      const { roomId } = this.info;
      const userList = await this._getUserList(this.isLogin);

      const isExist = userList.resultData.find(
        data => data.user_id === this.dummyWehagoId
      );

      if (isExist) {
        // Delete api 호출(게스트)
        const url = `${baseGuestApiUrl}videoChatMemberDel`;
        const data = {
          video_chat_id: roomId,
          user_id: this.dummyWehagoId
        };
        const token = await this._getToken(
          '/communication/rtc/videoChatMemberDel'
        );
        const signature = this._createSignature(
          `/communication/rtc/videoChatMemberDel${token}`
        );
        await this._callApi(url, data, 'POST', xhr => {
          const headers = this._makeHeaders(url, token, signature);
          // const headers = this._makeHeaders(url);
          // return {
          // 	signature,
          // 	...headers
          // };
          xhr.setRequestHeader('transaction-id', headers['transaction-id']);
          xhr.setRequestHeader('Authorization', headers['Authorization']);
          xhr.setRequestHeader('wehago-sign', headers['wehago-sign']);
          xhr.setRequestHeader('client-id', headers['client-id']);
          xhr.setRequestHeader('timestamp', headers['timestamp']);
          xhr.setRequestHeader('service', headers['service']);
          xhr.setRequestHeader('signature', signature);
          xhr.setRequestHeader('Wehago-S', headers['Wehago-S']);
          xhr.setRequestHeader('Cookie', headers['Cookie']);
        });
      }
      // if (isExist && userList.resultData.length <= 1) {
      //   this._deleteRoom();
      // }
    } catch (error) {
      console.log('deleteUser ERROR : ', error);
    }
  };

  /**
   * 사용자가 다 나간상태라면 방을 지운다.
   * 사용 안함
   */
  _deleteRoom = async () => {
    const { roomId } = this.info;

    const url = `${baseGuestApiUrl}videoChatDel`;
    const data = { video_chat_id: roomId };
    const token = await this._getToken('/communication/rtc/videoChatDel');
    const signature = this._createSignature(
      `/communication/rtc/videoChatDel${token}`
    );
    await this._callApi(url, data, 'POST', xhr => {
      const headers = this._makeHeaders(url, token, signature);
      // const headers = this._makeHeaders(url);
      // return {
      // 	signature,
      // 	...headers
      // };
      xhr.setRequestHeader('transaction-id', headers['transaction-id']);
      xhr.setRequestHeader('Authorization', headers['Authorization']);
      xhr.setRequestHeader('wehago-sign', headers['wehago-sign']);
      xhr.setRequestHeader('client-id', headers['client-id']);
      xhr.setRequestHeader('timestamp', headers['timestamp']);
      xhr.setRequestHeader('service', headers['service']);
      xhr.setRequestHeader('signature', signature);
      xhr.setRequestHeader('Wehago-S', headers['Wehago-S']);
      xhr.setRequestHeader('Cookie', headers['Cookie']);
    });
  };

  /**
   * 시그니쳐를 만든다.
   */
  _createSignature = url => {
    return CryptoJS.enc.Base64.stringify(CryptoJS.SHA256(url));
  };

  /**
   * API를 호출한다.
   **/
  _callApi = (url, data, method, beforeSend) => {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: url,
        data: data,
        type: method,
        xhrFields: {
          withCredentials: false
        },
        beforeSend: beforeSend,
        error: jqXHR => {
          reject(jqXHR);
        },
        success: result => {
          resolve(result);
        }
      });
    });
  };

  /**
   * 토큰을 얻어온다.
   */
  _getToken = async url => {
    const apiUrl = `${baseGuestUrl}/get_token/?url=${url}`;
    const result = await this._callApi(apiUrl, null, 'GET', null);
    return result.cur_date + result.token;
  };

  /**
   * 방에 사용자가 입장하면 위하고에 알린다.
   */
  _getUserList = async () => {
    const { roomId } = this.info;
    const url = `${baseGuestApiUrl}videoChatMember`;

    const token = await this._getToken(
      `/communication/rtc/videoChatMember?video_chat_id=${roomId}`
    );
    const signature = this._createSignature(
      `/communication/rtc/videoChatMember?video_chat_id=${roomId}${token}`
    );
    const data = { video_chat_id: roomId };

    const result = await this._callApi(url, data, 'GET', xhr => {
      const headers = this._makeHeaders(url, token, signature);
      // const headers = this._makeHeaders(url);
      // return {
      // 	signature,
      // 	...headers
      // };
      xhr.setRequestHeader('transaction-id', headers['transaction-id']);
      xhr.setRequestHeader('Authorization', headers['Authorization']);
      xhr.setRequestHeader('wehago-sign', headers['wehago-sign']);
      xhr.setRequestHeader('client-id', headers['client-id']);
      xhr.setRequestHeader('timestamp', headers['timestamp']);
      xhr.setRequestHeader('service', headers['service']);
      xhr.setRequestHeader('signature', signature);
      xhr.setRequestHeader('Wehago-S', headers['Wehago-S']);
      xhr.setRequestHeader('Cookie', headers['Cookie']);
    });
    return result;
  };

  /**
   * 10자의의 랜덤 스트링을 생성한다.
   */
  _createRandomString = () => {
    return Math.random().toString(36).replace('0.', '').substring(0, 10);
  };

  /**
   * MAKE HEADERS
   */
  _makeHeaders = (url, token, HASH_KEY) => {
    // const { token, HASH_KEY } = this.info;
    // token, HASH_KEY 모두 undefined
    // ConferenceManager.js/join() 에서 해당 값을 넘겨주지 않고 있음
    return securityRequest(
      this.info.a_token,
      this.info.r_token,
      url,
      this.info.hash_key
      // 'vcvZsk7471fMweERvr3c6zmI2emKcn',
      // 'eGnIbyMY57HxxcZKE4zYYw9lzZeDEX',
      // url,
      // '195562397410753821916402270099163728463'
    );
  };
}

export default APIManager;
