import { wehagoBaseURL, serialize, securityRequest } from '../../utils';
import fetch from './Fetch';
import { getT } from '../../utils/translateManager';
/**
 * 회사 설정 및 미납 여부 확인
 * @param {*} last_access_company 회사 정보
 */
const checkStatusType = ({ company_state, employee_status, step }) => {
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
const checkPurchaseTEdge = async (auth, company) => {
  try {
    const { AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY } = auth;
    const params = serialize({
      cno: company.company_no,
      service_code: 'al'
    });

    const urlType = '/common/company/service/purchase/check?' + params;
    const url = `${wehagoBaseURL}${urlType}`;

    const headers = securityRequest(AUTH_A_TOKEN, AUTH_R_TOKEN, url, HASH_KEY);

    const response = await fetch(url, {
      method: 'GET',
      headers
    });

    const responseJson = await response.json();

    if (responseJson.resultData.is_service_purchase === 'T') return true;
    else return false;
  } catch (err) {
    console.log('err', err);
    return false;
  }
};

/**
 * 회사 상태 체크
 * @param {any} auth
 * @param {any} company
 */
const companyStatusCheck = async (auth, company) => {
  const isTEdge = auth.last_company.membership_code === 'WE';

  if (isTEdge) {
    // TEdge 미납 여부 확인
    const isPurchase = await checkPurchaseTEdge(auth, company);
    if (isPurchase) {
      // return {
      //   code: 200
      // };
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
const serviceCheck = async (auth, company, type) => {
  try {
    const isSP = auth.last_company.membership_code === 'SP';
    if (!isSP) return true;

    const { AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY } = auth;
    const service_code = 'webrtc'; // 화상회의팩
    const params = serialize({
      service_code,
      cno: company.company_no,
      ccode: company.company_code
    });
    const urlType =
      type === 'P'
        ? '/common/company/service/purchase/check' // 구매여부
        : '/common/company/deploy/whether/employee'; // 배포여부
    const url = `${wehagoBaseURL}${urlType}?${params}`;

    const headers = securityRequest(AUTH_A_TOKEN, AUTH_R_TOKEN, url, HASH_KEY);

    const response = await fetch(url, {
      method: 'GET',
      headers
    });

    const responseJson = await response.json();
    if (responseJson.resultCode === 200) {
      const reType = type === 'P' ? 'is_service_purchase' : 'isServiceDeploy'; // api 에 따라서 return 이 다름
      const hasService = responseJson.resultData[reType] === 'T';
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
  serviceCheck,
  companyStatusCheck,
  checkStatusType
};
