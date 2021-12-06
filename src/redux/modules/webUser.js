import { result } from 'underscore';
import { UserApi } from '../../services';
const LOGIN = 'webUser.LOGIN';
const LOGOUT = 'webUser.LOGOUT';

function login() {
  return { type: LOGIN };
}

function logout() {
  return { type: LOGOUT };
}

const initialState = {
  auth: {},
  isWebLogin: false
};

//#endregion initialState

function loginCheckRequestWeb(AUTH_A_TOKEN, AUTH_R_TOKEN, cno, HASH_KEY) {
  return async dispatch => {
    const checkResult = await UserApi.check(
      AUTH_A_TOKEN,
      AUTH_R_TOKEN,
      cno,
      HASH_KEY
    );
    // alert(JSON.stringify(checkResult));
    if (checkResult.resultCode === 200) {
      const userData = {
        // login api data
        AUTH_A_TOKEN,
        AUTH_R_TOKEN,
        HASH_KEY,
        cno,
        // check api data
        user_no: checkResult.resultData.user_no,
        portal_id: checkResult.resultData.portal_id, // 아이디
        user_name: checkResult.resultData.user_name,
        user_default_email: checkResult.resultData.user_default_email,
        user_email: checkResult.resultData.user_email,
        profile_url: checkResult.resultData.profile_url,
        user_contact: checkResult.resultData.user_contact,
        employee_list: checkResult.resultData.employee_list, // 회사정보
        last_access_company_no: checkResult.resultData.last_access_company_no
          ? checkResult.resultData.last_access_company_no
          : cno,
        last_company: checkResult.resultData.last_access_company_no
          ? checkResult.resultData.employee_list.filter(
              e => e.company_no == checkResult.resultData.last_access_company_no
            )[0]
          : checkResult.resultData.employee_list[0], // last_access_company_no가 비어있는 상태로 올 수 있어서 null이 뜬다면 리스트중 첫번째 인덱스로 처리
        member_type: checkResult.resultData.member_type, // 0: 일반회원, 1: 개인회원
        nickname: checkResult.nickname
      };
      dispatch(login(userData));
      return checkResult;
    } else {
      const result = checkResult.errors ? checkResult : { errors: checkResult };
      dispatch(eventLog(result));
      return result;
    }
  };
}

//#region Reducer

function reducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      return {
        auth: action.auth,
        isWebLogin: true
      };
    case LOGOUT:
      return { isWebLogin: false, auth: {} };

    default:
      return state;
  }
}

//#region Action Creators

const actionCreators = {
  login,
  logout,
  loginCheckRequestWeb
};

export { actionCreators };
export default reducer;
