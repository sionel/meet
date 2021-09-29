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
import conference from './modules/conference';
import webUser from './modules/webUser';
import master from './modules/master';
import alert from './modules/alert';
import toast from './modules/toast';
import deployed from './modules/deployed';
import screenShare from './modules/ScreenShare';
import indicator from './modules/indicator';
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
  // user;
  // local;
  // mainUser;
  // participants;
  // wetalk;
  // wedrive;
  // documentShare;
  // conference;
  // webUser;
  // master;
  // toast;
  // loginInfo;
  // alert:alertState;
}


/**
 * persistConfig
 */
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user'],
  blacklist: [
    'local',
    'mainUser',
    'participants',
    'wetalk',
    'wedrive',
    'documentShare',
    'conference',
    'webUser',
    'master',
    'alert',
    'toast',
    'deployed',
    'ScreenShare',
    'indicator'
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
  indicator
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
