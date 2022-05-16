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
import local, { state as LocalState } from '@redux/local';
import mainUser, { state as MainUserState } from '@redux/mainUser';
import mainUser_copy, { InitialState as MainUserState_copy } from '@redux/mainUser_copy';
import participants, { state as ParticipantsState } from '@redux/participants';
import participants_copy, {
  InitialState as ParticipantsState_copy
} from '@redux/participants_copy';
import user, { state as UserState } from '@redux/user';
import wetalk, { state as WetalkState } from '@redux/wetalk';
import wedrive, { state as WedriveState } from '@redux/wedrive';
import documentShare, {
  state as DocumentShareState
} from '@redux/documentShare';
import conference, { state as ConferenceState } from '@redux/conference';
import webUser, { state as WebUserState } from '@redux/webUser';
import master, { state as MasterState } from '@redux/master';
import alert from '@redux/alert';
import toast, { state as ToastState } from '@redux/toast';
// import root from '@redux/root';
import deployed, { state as DeployedState } from '@redux/deployed';
import screenShare, { state as ScreenShageState } from '@redux/ScreenShare';
import indicator, { state as IndicatorState } from '@redux/indicator';
import orientation, { state as OrientationState } from '@redux/orientation';
import root, { state as RootStates } from '@redux/root';
import recents, { state as RecentsState } from '@redux/recentsInvited';
import test, { State as testState } from '@redux/test';
// import root from './modules/root';
import app, { State as appState } from '@redux/app';
import selectCompany, {
  state as SelectCompanyState
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
  local: LocalState;
  user: UserState;
  mainUser: MainUserState;
  mainUser_copy: MainUserState_copy;
  participants: ParticipantsState;
  participants_copy: ParticipantsState_copy;
  wetalk: WetalkState;
  wedrive: WedriveState;
  documentShare: DocumentShareState;
  conference: ConferenceState;
  webUser: WebUserState;
  master: MasterState;
  toast: ToastState;
  loginInfo: any;
  alert: any;
  screenShare: ScreenShageState;
  record: any;
  indicator: IndicatorState;
  deployed: DeployedState;
  orientation: OrientationState;
  root: RootState;
  recents: RecentsState;
  selectCompany: SelectCompanyState;
  app: appState;
}

/**
 * persistConfig
 */
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user', 'recents'],
  blacklist: [
    'local',
    'mainUser',
    'mainUser_copy',
    'participants',
    'participants_copy',
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
    'conference',
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
  mainUser_copy,
  participants,
  participants_copy,
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
