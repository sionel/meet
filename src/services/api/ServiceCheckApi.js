import { wehagoBaseURL, serialize, securityRequest } from '../../utils';
import fetch from './Fetch';

/**
 * 회사 설정 및 미납 여부 확인
 * @param {*} last_access_company 회사 정보
 */
const checkStatusType = ({ company_state, employee_status, step }) => {
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
                  message:
                    '회사초기설정이 진행중입니다. WEHAGO 웹에서 완료 후 서비스를 이용할 수 있습니다.'
                };
              case 3:
                return {
                  code: 400,
                  message: '사용중지'
                };
              case 4:
                return {
                  code: 400,
                  message: '퇴사'
                };
              case 5:
                return {
                  code: 400,
                  message: '탈퇴'
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
            message: '미납'
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
        message:
          '발급 받으신 가상계좌로 입금이 완료되지 않았습니다. 입금 확인 후 WEHAGO 서비스를 이용할 수 있습니다.'
      };
    } else {
      // 초기설정 미완료
      return {
        code: 400,
        message:
          '회사초기설정이 진행중입니다. WEHAGO 웹에서 완료 후 서비스를 이용할 수 있습니다.'
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
        message:
          'WEHAGO 이용이 제한되었습니다. 이용제한에 문의가 있을 경우 고객센터로 문의해주세요.'
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

    const service_code = 'webrtc'; // 화상대화팩
    const params = serialize({
      service_code,
      cno: company.company_no,
      ccode: company.company_code
    });

    const urlType =
      type === 'P'
        ? '/common/company/service/purchase/check'
        : '/common/company/deploy/whether/employee';
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
