/**
 * user
 * user 스토어
 */

import { AnyAction } from 'redux';
import { UserApi, ServiceCheckApi } from '@services/index';
import { actionCreators as wetalkActionCreators } from './wetalk';

const AGREEMENT = 'user.AGREEMENT';
const LOGIN = 'user.LOGIN';
const LOGOUT = 'user.LOGOUT';
const TOKEN = 'user.TOKEN';
const AUTH = 'user.AUTH';
// const TOKEN_LOGIN = 'user.TOKEN_LOGIN';
const CHANGE_COMPANY = 'user.CHANGE_COMPANY';
const TOGGLE_VISIBLE_APPINTRO = 'user.TOGGLE_VISIBLE_APPINTRO';

const EVENT_LOG = 'user.EVENT_LOG';
const NETWORK_DISCONNECT = 'user.NETWORK_DISCONNECT';

const SESSION_CHECK = 'user.SESSION_CHECK';
const SET_PERMISSION = 'user.SET_PERMISSION'; // 화상회의 생성 권한
const TOGGLE_UPDATE_NOTI = 'user.TOGGLE_UPDATE_NOTI';

// 나하고 관련 정책이나 버튼 식별을 위해 타입 체크 ( 위하고 or 나하고 )
const SET_LOGIN_TYPE = 'user.SET_LOGIN_TYPE';
//#region Action Creators

//#region initialState

export interface state {
  loginType: string;
  isLogin: boolean;
  auth: any;
  permission: boolean;
  appIntro: boolean;
  from: string;
  log: any;
  session: boolean;
  updateNoti: boolean;
  autoLogin: boolean;
}

const initialState = {
  loginType: 'none',
  isLogin: false,
  auth: {},
  permission: false,
  appIntro: false,
  from: '',
  log: {},
  session: true,
  updateNoti: true,
  autoLogin: false
};

//#endregion initialState

//#region Reducer

function reducer(state: state = initialState, action: AnyAction) {
  switch (action.type) {
    case AGREEMENT:
      return { ...state, permission: !state.permission };
    // case AUTH:
    //   return { ...state, auth: action.auth};
    case LOGIN:
      return {
        ...state,
        auth: action.auth,
        isLogin: true,
        from: action.from,
        session: true,
        autoLogin: action.autoLogin
      };
    // return applyTest(state, action);
    case LOGOUT:
      return {
        ...state,
        auth: {},
        isLogin: false,
        permission: false,
        autoLogin: false,
        from: ''
      };
    case NETWORK_DISCONNECT:
      return { ...state, isLogin: false };
    case TOKEN:
      let auth = state.auth;
      auth.AUTH_A_TOKEN = action.newToken;
      return {
        ...state,
        auth
      };
    // case TOKEN_LOGIN:
    // 	return applyTokenLogin(state, action);
    case TOGGLE_VISIBLE_APPINTRO:
      return applyToggleVisibleAppIntro(state, action);
    case CHANGE_COMPANY:
      return applyChangeCompany(state, action);
    case EVENT_LOG:
      return applyEventLog(state, action);
    case SESSION_CHECK:
      return { ...state, session: action.session };
    case SET_PERMISSION:
      return { ...state, permission: action.permission };
    case TOGGLE_UPDATE_NOTI:
      return { ...state, updateNoti: !state.updateNoti };
    case SET_LOGIN_TYPE:
      return { ...state, loginType: action.loginType };
    default:
      return state;
  }
}

//#endregion Reducer

/**
 * Event Log
 */
function eventLog(event: any) {
  return (dispatch: any) => {
    dispatch({
      type: EVENT_LOG,
      event
    });
  };
}

function applyEventLog(state: state, action: AnyAction) {
  const newLog = {
    date: Date.now(),
    message: action.event
  };
  return {
    ...state,
    log: {
      ...state.log,
      [newLog.date]: newLog.message
    }
  };
}

/**
 * agreement
 */
function agreement() {
  return { type: AGREEMENT };
}

/**
 * login
 */
function login(auth: any, from: string, autoLogin: boolean) {
  return {
    type: LOGIN,
    auth,
    from,
    autoLogin
  };
}

/**
 * auth
 */

// function setAuth(auth) {
//   return {
//     type: AUTH,
//     auth,
//   }
// }

function toggleUpdateNoti() {
  return {
    type: TOGGLE_UPDATE_NOTI
  };
}

/**
 * logout
 */
function sessionCheck(session = true) {
  return {
    type: SESSION_CHECK,
    session
  };
}

/**
 * logout
 */
function logout() {
  return (dispatch: any) => {
    dispatch({
      type: LOGOUT
    });
    dispatch({
      type: 'recentInvited.RESET_RECENTS'
    });
    dispatch({
      type: 'deployed.RESET'
    });
  };
}

function disconnect() {
  return {
    type: NETWORK_DISCONNECT
  };
}

/**
 * tokenTest
 */
function token(auth: any) {
  return {
    type: TOKEN,
    newToken: 100
  };
}

/**
 * 권한 설정
 */
function setPermission(permission: any) {
  return {
    type: SET_PERMISSION,
    permission
  };
}

/**
 * intro skip
 */
// function intro() {
// 	return { type: INTRO };
// };

/**
 * CHANGE_COMPANY
 */
function changeCompany(company: any) {
  return {
    type: CHANGE_COMPANY,
    company
  };
}

function changeCompanyRequest(auth: any, company: any) {
  return async (dispatch: any) => {
    const checkResult = await UserApi.changeCompany(auth, company);
    if (checkResult.resultData !== 1) {
      // alert('회사변경 중 문제 발생');
      return checkResult;
    }
    // dispatch(wetalkActionCreators.setInitialList());
    return dispatch(changeCompany(company));
  };
}

function applyChangeCompany(state: state, action: AnyAction) {
  const { company } = action;
  return {
    ...state,
    auth: {
      ...state.auth,
      cno: company.company_no,
      last_company: company,
      last_access_company_no: company.company_no
    }
  };
}

function setLoginType(loginType: string) {
  return {
    type: SET_LOGIN_TYPE,
    loginType
  };
}

//#endregion Reducer Functions

//#region TOGGLE_VISIBLE_APPINTRO
function toggleVisibleAppIntro() {
  return (dispatch: any) => {
    dispatch({
      type: TOGGLE_VISIBLE_APPINTRO
    });
  };
}

function applyToggleVisibleAppIntro(state: state, action: AnyAction) {
  const { appIntro } = state;
  return {
    ...state,
    appIntro: !appIntro
  };
}

//#endregion TOGGLE_VISIBLE_APPINTRO

//#region Export

const actionCreators = {
  login,
  // loginRequest,
  // loginCheckRequest,
  logout,
  disconnect,
  token,
  // tokenLogin,
  agreement,
  changeCompany,
  changeCompanyRequest,
  toggleVisibleAppIntro,
  sessionCheck,
  setPermission,
  toggleUpdateNoti,
  eventLog,
  setLoginType
  // setAuth
};

export { actionCreators };
export default reducer;

//#endregion Export

// 리덕스에서 api쓰는 방식 주석처리
// function loginRequest(data, access_pass) {
//   return async () => {
//     return await UserApi.login(data, access_pass);
//   };
// }

// function loginCheckRequest(AUTH_A_TOKEN, AUTH_R_TOKEN, cno, HASH_KEY, from) {
//   return async dispatch => {
//     const checkResult = await UserApi.check(
//       AUTH_A_TOKEN,
//       AUTH_R_TOKEN,
//       cno,
//       HASH_KEY
//     );
//     // alert(JSON.stringify(checkResult));
//     if (checkResult.resultCode === 200) {
//       const userData = {
//         // login api data
//         AUTH_A_TOKEN,
//         AUTH_R_TOKEN,
//         HASH_KEY,
//         cno,
//         // check api data
//         user_no: checkResult.resultData.user_no,
//         portal_id: checkResult.resultData.portal_id, // 아이디
//         user_name: checkResult.resultData.user_name,
//         user_default_email: checkResult.resultData.user_default_email,
//         user_email: checkResult.resultData.user_email,
//         profile_url: checkResult.resultData.profile_url,
//         user_contact: checkResult.resultData.user_contact,
//         employee_list: checkResult.resultData.employee_list, // 회사정보
//         last_access_company_no: checkResult.resultData.last_access_company_no
//           ? checkResult.resultData.last_access_company_no
//           : cno,
//         last_company: checkResult.resultData.last_access_company_no
//           ? checkResult.resultData.employee_list.filter(
//               e => e.company_no == checkResult.resultData.last_access_company_no
//             )[0]
//           : checkResult.resultData.employee_list[0], // last_access_company_no가 비어있는 상태로 올 수 있어서 null이 뜬다면 리스트중 첫번째 인덱스로 처리
//         member_type: checkResult.resultData.member_type, // 0: 일반회원, 1: 개인회원
//         nickname: checkResult.nickname,
//         membership_code: checkResult.resultData.employee_list[0].membership_code
//       };

//       dispatch(login(userData, from));
//       return checkResult;
//     } else {
//       const result = checkResult.errors ? checkResult : { errors: checkResult };
//       dispatch(eventLog(result));
//       return result;
//     }
//   };
// }
