/**
 * configureStore.js
 * configureStore {store, persistor} 생성
 */

import { applyMiddleware, createStore } from "redux";
import { persistStore, persistCombineReducers } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";
import test from "./modules/test";

/**
 * middleware list
 */
const middlewares = [thunk];

/**
 * persistConfig
 */
const persistConfig = {
  key: "root",
  storage
};

/**
 *  여러 모듈들을 결합하여 리듀서를 생성한다.
 */
const reducer = persistCombineReducers(persistConfig, { test });

/**
 * configureStore 정의
 */
const configureStore = () => {
  let store = createStore(reducer, applyMiddleware(...middlewares));
  let persistor = persistStore(store);
  return { store, persistor };
};

export default configureStore;
