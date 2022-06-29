import { PlatformOSType } from 'react-native';
import axios from './customAxios';
import axiostest from 'axios';

export default {
  checkVersion: async (os: PlatformOSType, major: number) => {
    const Axios = axios.getInstance();
    const url = `/video/mobile/version?os=${os}&major=${major}`;
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    };
    // const data = {};
    const response = await Axios.get(url, { headers })
      .then(res => {
        res.data.resultData;
      })
      .catch(rej => {
        debugger;
        console.log(rej);
      });

    return response;
  }
};
