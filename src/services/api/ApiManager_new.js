// import $ from 'jquery';
import CryptoJS from 'crypto-js';
import config from './config';
import { securityRequest } from '../../utils';

const baseApiUrl = config.baseApiUrl;
const baseGuestUrl = config.baseGuestUrl;
const baseGuestApiUrl = config.baseGuestApiUrl;

class APIManager {
  /**
   * constructor
   */
  constructor(connectionId, info) {
    // 초기 설정
    this.connectionId = connectionId;
    this.info = info;
    this.dummyWehagoId = this._createRandomString();
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
      alert('요청된 작업을 처리하던중 문제가 발생했습니다. 다시 시도해 주세요');
      return participant;
    }
  };

  /**
   * 방에 유저가 참여하면 Wehago에 알림
   */
  insertUser = async () => {
    try {
      const { roomId } = this.info;
      // 유저리스트를 가지고 온다.
      const userList = await this._getUserList();
      console.log('유저목록 : ', userList);
      // 비인증일때
      const isExist = userList.resultData.find(
        data => data.user_id === this.dummyWehagoId
      );

      if (!isExist) {
        // insert api 호출(게스트)
        const url = `${baseGuestApiUrl}videoChatMember`;
        const data = {
          video_chat_id: roomId,
          user_id: this.dummyWehagoId,
          user_name: this.info.name,
          video_seq: this.connectionId
        };

        const token = await this._getToken(
          '/communication/rtc/videoChatMember'
        );
        const signature = this._createSignature(
          `/communication/rtc/videoChatMember${token}`
        );

        const headers = this._makeHeaders(url, token, signature);
        headers.signature = signature;
        await this._callApi(url, data, 'POST', headers);
      }
    } catch (error) {
      console.log('insertUser ERROR : ', error);
    }
  };

  /**
   * Delete User
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
          // xhr.setRequestHeader('Wehago-S', signature);
          // xhr.setRequestHeader('Cookie', signature);
        });
      }
      if (isExist && userList.resultData.length <= 1) {
        this._deleteRoom();
      }
    } catch (error) {
      console.log('deleteUser ERROR : ', error);
    }
  };

  /**
   * 사용자가 다 나간상태라면 방을 지운다.
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
      // xhr.setRequestHeader('Wehago-S', signature);
      // xhr.setRequestHeader('Cookie', signature);
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
  _callApi = async (url, data = null, method, beforeSend) => {
    const body = data != null ? JSON.stringify(data) : data;
    console.log('Body : ', body);

    try {
      const response = await fetch(url, {
        method,
        headers: beforeSend,
        body
      });
      return response;
    } catch (e) {
      throw e;
    }
    // return new Promise((resolve, reject) => {
    //   $.ajax({
    //     url: url,
    //     data: data,
    //     type: method,
    //     xhrFields: {
    //       withCredentials: false
    //     },
    //     beforeSend: beforeSend,
    //     error: jqXHR => {
    //       // alert('tq?');
    //       reject(jqXHR);
    //     },
    //     success: result => {
    //       // alert(JSON.stringify(result));
    //       resolve(result);
    //     }
    //   });
    // });
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
    const url = `${baseGuestApiUrl}videoChatMember?video_chat_id=${roomId}`;
    const token = await this._getToken(
      `/communication/rtc/videoChatMember?video_chat_id=${roomId}`
    );
    const signature = this._createSignature(
      `/communication/rtc/videoChatMember?video_chat_id=${roomId}${token}`
    );
    // const data = { video_chat_id: roomId };

    const result = await this._callApi(url, null, 'GET', xhr => {
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
      // xhr.setRequestHeader('Wehago-S', signature);
      // xhr.setRequestHeader('Cookie', signature);
    });
    return result;
  };

  /**
   * 10자의의 랜덤 스트링을 생성한다.
   */
  _createRandomString = () => {
    return Math.random()
      .toString(36)
      .replace('0.', '')
      .substring(0, 10);
  };

  /**
   * MAKE HEADERS
   */
  _makeHeaders = (url, token, HASH_KEY) => {
    // const { token, HASH_KEY } = this.info;
    // token, HASH_KEY 모두 undefined
    // ConferenceManager.js/join() 에서 해당 값을 넘겨주지 않고 있음
    return securityRequest(
      'vcvZsk7471fMweERvr3c6zmI2emKcn',
      'eGnIbyMY57HxxcZKE4zYYw9lzZeDEX',
      url,
      '195562397410753821916402270099163728463'
    );
  };

  /**
   * MAKE HEADERS
   */
  _makeHeaders = url => {
    return securityRequest(
      this.info.a_token,
      this.info.r_token,
      url,
      this.info.hash_key
    );
  };
}

export default APIManager;
