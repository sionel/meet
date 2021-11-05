// import { wehagoBaseURL, serialize, createHeader } from '../../services/utils';
import { wehagoBaseURL, serialize, createHeader } from '../../utils';
// import fetch from '../../services/api/ApiManager';

const getOrganizationTreeRequest = async auth => {
  const { AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY, cno } = auth;
  try {
    const params = serialize({
      portalIdYn: 'Y',
      containConnect: 'T', // (T로 전달 혹은 전달하지 않으면 연결된 조직도 리스트 포함 리스트로 반환 0번이 본 조직도)
      employeeStatus: 2, // (2로 전달시 사용중인 직원만 카운트)
      cno: cno,
      companyNo: cno
    });
    const url = `${wehagoBaseURL}/common/company/organizationmanagement/tree?${params}`;
    const header = createHeader({ AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY, url });
    const data = {
      method: 'GET',
      headers: { ...header, service: 'common' }
    };
    const response = await fetch(url, data);
    const responseJson = await response.json();
    return responseJson;
  } catch (err) {
    console.log('err', err);
    return { error: err };
  }
};

const getOrganizationTreeEmployeeRequest = async (
  auth,
  organizationNo: number
) => {
  const { AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY, cno } = auth;
  try {
    const params = serialize({
      portalIdYn: 'Y',
      organizationNo,
      employeeStatus: 2,
      cno: cno,
      companyNo: cno
    });
    const url = `${wehagoBaseURL}/common/company/organizationmanagement/tree/employee?${params}`;
    const header = createHeader({ AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY, url });
    const data = {
      method: 'GET',
      headers: Object.assign({}, header, {
        // 'client-id': 'communication2',
        service: 'common'
      })
    };
    const response = await fetch(url, data);
    const responseJson = await response.json();
    return responseJson;
  } catch (err) {
    console.log('err', err);
    return { error: err };
  }
};

const getOrganizationTreeAllEmployeeRequest = async auth => {
  const { AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY, cno } = auth;
  try {
    const params = serialize({
      portalIdYn: 'Y',
      containConnect: 'F', //T로 설정시 회사 수임처의 사원들도 같이 검색된다. F로 설정시 자신의 회사 내에서만 검색

      employeeStatus: 2,
      cno: cno,
      companyNo: cno
    });
    const url = `${wehagoBaseURL}/common/company/organizationmanagement/tree/employee?${params}`;
    const header = createHeader({ AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY, url });
    const data = {
      method: 'GET',
      headers: Object.assign({}, header, {
        // 'client-id': 'communication2',
        // service: 'common'
      })
    };
    const response = await fetch(url, data);
    const responseJson = await response.json();

    return responseJson;
  } catch (err) {
    console.log('err', err);
    return { error: err };
  }
};

export default {
  getOrganizationTreeRequest,
  getOrganizationTreeEmployeeRequest,
  getOrganizationTreeAllEmployeeRequest
};
