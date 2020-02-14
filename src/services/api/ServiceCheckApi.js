import { wehagoBaseURL, serialize, securityRequest } from '../../utils';
import fetch from './Fetch';

const serviceCheck = async (auth, company) => {
  try {
    const isSP = auth.last_company.membership_code === 'SP';
    if (!isSP) return true;

    const service_code = 'webrtc';
    const params = serialize({
      service_code,
      cno: company.company_no,
      ccode: company.company_code
    });
    // const url = `${wehagoBaseURL}/common/layout/service/deployed/to-company-user?${params}`;
    const url = `${wehagoBaseURL}/common/company/deploy/whether/employee?${params}`;
    const { AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY } = auth;

    const headers = securityRequest(AUTH_A_TOKEN, AUTH_R_TOKEN, url, HASH_KEY);

    const response = await fetch(url, {
      method: 'GET',
      headers
    });

    const responseJson = await response.json();

    if (responseJson.resultCode === 200) {
      const hasService = responseJson.resultData.isServiceDeploy === 'T';
      return hasService;
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
