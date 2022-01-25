/**
 * configureStore.js
 * configureStore {store, persistor} 생성
 */
const env = process.env.NODE_ENV;

import { applyMiddleware, createStore } from 'redux';
import { persistStore, persistCombineReducers } from 'redux-persist';
// import AsyncStorage from 'react-native-async-storage'
import AsyncStorage from '@react-native-async-storage/async-storage';
// import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import local from '@redux/local';
import mainUser from '@redux/mainUser';
import participants from '@redux/participants';
import user from '@redux/user';
import wetalk from '@redux/wetalk';
import wedrive from '@redux/wedrive';
import documentShare from '@redux/documentShare';
import conference, { state as conferenceState } from '@redux/conference';
import webUser from '@redux/webUser';
import master from '@redux/master';
import alert from '@redux/alert';
import toast from '@redux/toast';
// import root from '@redux/root';
import deployed, { state as deployedState } from '@redux/deployed';
import screenShare, { state as screenShageState } from '@redux/ScreenShare';
import indicator, { state as indicatorState } from '@redux/indicator';
import orientation, { state as orientationState } from '@redux/orientation';
import root, { state as rootState } from '@redux/root';
import recents, { state as recentsState } from '@redux/recentsInvited';
import selectCompany, {
  state as selectCompanyState
} from '@redux/selectCompany';
/**
 * middleware list
 */
const middlewares = [thunk];

// if (env === 'development') {
//   const { logger } = require('redux-logger');
//   middlewares.push(logger);
// }

export interface RootState {
  local: any;
  user: any;
  mainUser: any;
  participants: any;
  wetalk: any;
  wedrive: any;
  documentShare: any;
  conference: conferenceState;
  webUser: any;
  master: any;
  toast: any;
  loginInfo: any;
  alert: any;
  screenShare: screenShageState;
  record: any;
  indicator: indicatorState;
  deployed: deployedState;
  orientation: orientationState;
  root: rootState;
  recents: recentsState;
  selectCompany: selectCompanyState;
}

/**
 * persistConfig
 */
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user', 'recents', 'conference'],
  blacklist: [
    'local',
    'mainUser',
    'participants',
    'wetalk',
    'wedrive',
    'documentShare',
    'webUser',
    'master',
    'alert',
    'toast',
    'deployed',
    'ScreenShare',
    'indicator',
    'orientation',
    'root',
    'selectCompany'
  ]
};

/**
 *  여러 모듈들을 결합하여 리듀서를 생성한다.
 */
const reducer = persistCombineReducers(persistConfig, {
  local,
  mainUser,
  participants,
  user,
  wetalk,
  wedrive,
  documentShare,
  conference,
  webUser,
  master,
  alert,
  toast,
  deployed,
  screenShare,
  indicator,
  orientation,
  root,
  recents,
  selectCompany
});

/**
 * configureStore 정의
 */
const configureStore = () => {
  let store = createStore(reducer, applyMiddleware(...middlewares));
  let persistor = persistStore(store);
  return { store, persistor };
};

export default configureStore;
