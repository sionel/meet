/**
 * configureStore.js
 * configureStore {store, persistor} 생성
 */
const env = process.env.NODE_ENV;

import { applyMiddleware, createStore } from 'redux';
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import local from './modules/local';
import mainUser from './modules/mainUser';
import participants from './modules/participants';
import test from './modules/test';
import user from './modules/user';
import wetalk from './modules/wetalk';

/**
 * middleware list
 */
const middlewares = [thunk];

if (env === 'development') {
  const { logger } = require('redux-logger');
  // middlewares.push(logger);
}

/**
 * persistConfig
 */
const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['local', 'mainUser', 'participants']
};

/**
 *  여러 모듈들을 결합하여 리듀서를 생성한다.
 */
const reducer = persistCombineReducers(persistConfig, {
  local,
  mainUser,
  participants,
  test,
  user,
  wetalk
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
