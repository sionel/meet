import { wehagoBaseURL, serialize, securityRequest } from '../../utils';
import fetch from './Fetch';

const serviceCheck = async (auth, company) => {
  try {
    const params = serialize({
      cno: company.company_no,
      ccode: company.company_code
    });
    const url = `${wehagoBaseURL}/common/layout/service/deployed/to-company-user?${params}`;
    const { AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY } = auth;

    // 두번째 url 에서 mu 값을 string->json 처리 후 pageurl 에서 마지막 파라미터 추출
    const headers = securityRequest(AUTH_A_TOKEN, AUTH_R_TOKEN, url, HASH_KEY);

    const response = await fetch(url, {
      method: 'GET',
      headers
    });

    const responseJson = await response.json();
    if (responseJson.resultCode === 200) {
      const hasService = responseJson.resultData.find(
        service => service.service_code === 'communication'
      );
      return true;
      return hasService ? true : false;
    } else {
      return false;
    }
  } catch (err) {
    console.warn('serviceCheck : ', err);
    return false;
  }
};

export default {
  serviceCheck
};
