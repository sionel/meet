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
import local from './modules/local';
import mainUser from './modules/mainUser';
import participants from './modules/participants';
import user from './modules/user';
import wetalk from './modules/wetalk';
import wedrive from './modules/wedrive';
import documentShare from './modules/documentShare';
import conference, { state as conferenceState } from './modules/conference';
import webUser from './modules/webUser';
import master from './modules/master';
import alert from './modules/alert';
import toast from './modules/toast';
// import root from './modules/root';
import deployed, { state as deployedState } from './modules/deployed';
import app, { State as appState } from './modules/app';
import screenShare, { state as screenShageState } from './modules/ScreenShare';
import indicator, { state as indicatorState } from './modules/indicator';
import orientation, { state as orientationState } from './modules/orientation';
import root, { state as rootState } from './modules/root';
import recents, { state as recentsState } from './modules/recentsInvited';
import selectCompany, {
  state as selectCompanyState
} from './modules/selectCompany';
/**
 * middleware list
 */
const middlewares = [thunk];

if (env === 'development') {
  // const { logger } = require('redux-logger');
  // middlewares.push(logger);
}

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
  app: appState;
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
    'selectCompany',
    'app'
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
  selectCompany,
  app
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
