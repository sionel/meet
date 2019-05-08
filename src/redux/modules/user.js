/**
 * user
 * user 스토어
 */

import { UserApi } from '../../services';

const AGREEMENT = 'AGREEMENT';
const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';
const TOKEN = 'TOKEN';
// const TOKEN_LOGIN = 'TOKEN_LOGIN';
const CHANGE_COMPANY = 'CHANGE_COMPANY';
const TOGGLE_VISIBLE_APPINTRO = 'TOGGLE_VISIBLE_APPINTRO';

const EVENT_LOG = 'EVENT_LOG';
const NETWORK_DISCONNECT = 'NETWORK_DISCONNECT';
//#region Action Creators

/**
 * Event Log
 */
function eventLog(event) {
  return dispatch => {
    dispatch({
      type: EVENT_LOG,
      event
    });
  };
}

function applyEventLog(state, action) {
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
function login(auth) {
  return {
    type: LOGIN,
    auth
  };
}

function loginRequest(data) {
  return async () => {
    return await UserApi.login(data);
  };
}

function loginCheckRequest(AUTH_A_TOKEN, AUTH_R_TOKEN, cno, HASH_KEY) {
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
        // check api data
        user_no: checkResult.resultData.user_no,
        portal_id: checkResult.resultData.portal_id, // 아이디
        user_name: checkResult.resultData.user_name,
        user_email: checkResult.resultData.user_email,
        profile_url: checkResult.resultData.profile_url,
        user_contact: checkResult.resultData.user_contact,
        employee_list: checkResult.resultData.employee_list, // 회사정보
        last_access_company_no: checkResult.resultData.last_access_company_no,
        last_company: checkResult.resultData.employee_list.filter(
          e => e.company_no == checkResult.resultData.last_access_company_no
        )[0]
      };
      return dispatch(login(userData));
    } else {
      const result = checkResult.errors ? checkResult : { errors: checkResult };
      dispatch(eventLog(result));
      return result;
    }
  };
}

/**
 * logout
 */
function logout() {
  return {
    type: LOGOUT
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
function token(auth) {
  return {
    type: TOKEN,
    newToken: 100
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
function changeCompany(cno) {
  return {
    type: CHANGE_COMPANY,
    payload: { cno }
  };
}

/**
 * tokenLogin : ACTION
 */
// function tokenLogin(token, cno) {
// 	alert('준비중입니다.');
// 	// return;
// 	const result = UserApi.check(token, cno);
// 	console.log('tokenLogin : ', typeof result);

// 	function retur(dispatch) {
// 		dispatch({
// 			type: TOKEN_LOGIN,
// 			payload: {
// 				token
// 			}
// 		});
// 	};
// };

/**
 * applyTokenLogin
 */
// function applyTokenLogin(state, action) {
// 	return state;
// };

//#endregion

//#region initialState

const initialState = {
  isLogin: false,
  auth: {},
  permission: false,
  appIntro: false,
  log: {}
};

//#endregion initialState

//#region Reducer

function reducer(state = initialState, action) {
  switch (action.type) {
    case AGREEMENT:
      return { ...state, permission: !state.permission };
    case LOGIN:
      return { ...state, auth: action.auth, isLogin: true };
    // return applyTest(state, action);
    case LOGOUT:
      return { ...state, auth: {}, isLogin: false };
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
      let newAuth = state.auth;
      // console.log('NEW CNO : ', action.payload.cno);
      return {
        ...state,
        auth: { ...newAuth, last_access_company_no: action.payload.cno }
      };
    // return state;
    case EVENT_LOG:
      return applyEventLog(state, action);
    default:
      return state;
  }
}

//#endregion Reducer

//#region Reducer Functions

/**
 * applyTest
 */
// function applyTest(state, action) {
// 	const { test } = action;
// 	return {
// 		...state,
// 		test
// 	};
// };

/**
 *
 */
function applyChangeCompany(state, action) {
  const { cno } = action.payload;
  const newAuth = { ...state.auth, last_access_company_no: cno };
  // console.log('newAuth : ', newAuth.last_access_company_no);
  return {
    ...state,
    auth: newAuth
  };
}

//#endregion Reducer Functions

//#region TOGGLE_VISIBLE_APPINTRO
function toggleVisibleAppIntro() {
  return dispatch => {
    dispatch({
      type: TOGGLE_VISIBLE_APPINTRO
    });
  };
}

function applyToggleVisibleAppIntro(state, action) {
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
  loginRequest,
  loginCheckRequest,
  logout,
  disconnect,
  token,
  // tokenLogin,
  agreement,
  changeCompany,
  toggleVisibleAppIntro
};

export { actionCreators };
export default reducer;

//#endregion Export
