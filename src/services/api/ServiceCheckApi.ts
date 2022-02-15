import { wehagoBaseURL, serialize, securityRequest, isDev } from '@utils/index';
import Axios from './Axios';
import { getT } from '@utils/translateManager';
import { isSuccess, Res } from '@services/types';
import { apiAuthInfo, companyInfo } from './types';
import { authInfo } from '@redux/user';
/**
 * 회사 설정 및 미납 여부 확인
 * @param {*} last_access_company 회사 정보
 */
const checkStatusType = (last_company: any) => {
 const { company_state, employee_status, step } = last_company;
  const t = getT();
  if (typeof step === 'number') {
    if (step === 6) {
      // 초기설정 완료
      if (typeof company_state === 'number') {
        if (company_state === 0) {
          if (typeof employee_status === 'number') {
            switch (employee_status) {
              case 0:
              case 1:
                return {
                  code: 400,
                  message: t('alert_text_init_company')
                };
              case 3:
                return {
                  code: 400,
                  message: t('alert_text_usage_restriction')
                  // message: '사용중지'
                };
              case 4:
                return {
                  code: 400,
                  message: t('alert_text_usage_restriction')
                  // message: '퇴사'
                };
              case 5:
                return {
                  code: 400,
                  message: t('alert_text_usage_restriction')
                  // message: '탈퇴'
                };
              default:
                return {
                  code: 200
                };
            }
          } else {
            return {
              code: 200
            };
          }
        } else {
          // 미납된 케이스
          return {
            code: 400,
            message: t('alert_text_usage_restriction')
            // message: '미납'
          };
        }
      } else {
        return {
          code: 200
        };
      }
    } else if (step === 7) {
      // 미결재 상태
      // 대기일 경우 만료 여부 확인해야함
      return {
        code: 400,
        message: t('alert_text_unpaid')
      };
    } else {
      // 초기설정 미완료
      return {
        code: 400,
        message: t('alert_text_init_company')
      };
    }
  } else {
    return {
      code: 200
    };
  }
};

/**
 * T Edge 구매 여부 확인
 * @param {*} auth
 * @param {*} company
 */
const checkPurchaseTEdge = async (auth: apiAuthInfo, company: companyInfo) => {
  // try {
  const { AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY } = auth;
  const params = serialize({
    cno: company.company_no,
    service_code: 'al'
  });

  const urlType = '/common/company/service/purchase/check?' + params;
  const url = `${wehagoBaseURL}${urlType}`;

  const headers = securityRequest(AUTH_A_TOKEN, AUTH_R_TOKEN, url, HASH_KEY);

  const response = await Axios<{ is_service_purchase: string }>(url, {
    method: 'GET',
    headers
  });

  if (isSuccess(response)) {
    if (response.resultData.is_service_purchase === 'T') return true;
    else return false;
  } else {
    throw response;
  }

  //   if (responseJson.resultData.is_service_purchase === 'T') return true;
  //   else return false;
  // } catch (err) {
  //   console.log('err', err);
  //   return false;
  // }
};

const checkMembership = async (auth: authInfo) => {
  const { AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY, cno } = auth;
  const url = `${wehagoBaseURL}common/market/membership?cno=${cno}`;
  const headers = securityRequest(AUTH_A_TOKEN, AUTH_R_TOKEN, url, HASH_KEY);
  const data = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  };
  const response = await Axios(url, data);

  if (isSuccess(response)) {
    return response;
  } else {
    throw response;
  }
};

/**
 * 회사 상태 체크
 * @param {any} auth
 * @param {any} company
 */
const companyStatusCheck = async (auth: apiAuthInfo, company: companyInfo) => {  
  const isTEdge = auth.last_company.membership_code === 'WE';
  const t = getT();

  if (isTEdge) {
    // TEdge 미납 여부 확인
    const isPurchase = await checkPurchaseTEdge(auth, company);
    // console.log(isPurchase);
    
    if (isPurchase) {
      return {
        code: 200
      };
    } else {
      return {
        code: 400,
        message: t('alert_text_usage_restriction')
      };
    }
  }

  // 회사 상태 확인
  return checkStatusType(auth.last_company);
};
/**
 * 서비스 구매/배포여부
 * 싱글팩만 체크함
 * @param {any} auth
 * @param {any} company
 * @param {string} type P: 구매, D: 배포
 */
const serviceCheck = async (auth: apiAuthInfo) => {
  const { AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY, cno } = auth;
  const params = serialize({
    cno
  });
  const urlType = isDev
    ? '/videodev/service/is-deploy'
    : '/video/service/is-deploy'; // 배포여부
  const url = `${wehagoBaseURL}${urlType}?${params}`;

  const headers = securityRequest(AUTH_A_TOKEN, AUTH_R_TOKEN, url, HASH_KEY);

  const response = await Axios(url, {
    method: 'GET',
    headers
  });

  if (isSuccess(response)) {
    if (response.resultCode === 200) {
      const hasService = response.resultData === 'T';
      return hasService;
    } else {
      return false;
    }
  } else {
    throw response;
  }
};

const anotherServiceCheck = async (
  auth: apiAuthInfo,
  company: companyInfo,
  type: string
) => {
  const { AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY } = auth;
  const params = serialize({
    service_code: type,
    cno: company.company_no
    // ccode: company.company_code
  });
  const urlType = '/video/service/is-service-deploy'; // 배포여부
  const url = `${wehagoBaseURL}${urlType}?${params}`;

  const headers = securityRequest(AUTH_A_TOKEN, AUTH_R_TOKEN, url, HASH_KEY);

  const response = await Axios<{ isServiceDeploy: string }>(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  });

  if (isSuccess(response)) {
    if (response.resultCode === 200) {
      const hasService = response.resultData['isServiceDeploy'] === 'T';
      return hasService;
    } else {
      return false;
    }
  } else {
    throw response;
  }
};

export default {
  serviceCheck,
  companyStatusCheck,
  checkStatusType,
  checkMembership,
  anotherServiceCheck
};
