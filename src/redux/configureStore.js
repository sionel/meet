/**
 * configureStore.js
 * configureStore {store, persistor} 생성
 */

import { applyMiddleware, createStore } from "redux";
import { persistStore, persistCombineReducers } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";
import local from "./modules/local";
import mainUser from "./modules/mainUser";

const env = process.env.NODE_ENV;

/**
 * middleware list
 */
const middlewares = [thunk];

if (env === "development") {
  const { logger } = require("redux-logger");
  middlewares.push(logger);
}

/**
 * persistConfig
 */
const persistConfig = {
  key: "root",
  storage,
  blacklist: ["local", "mainUser"]
};

/**
 *  여러 모듈들을 결합하여 리듀서를 생성한다.
 */
const reducer = persistCombineReducers(persistConfig, { local, mainUser });

/**
 * configureStore 정의
 */
const configureStore = () => {
  let store = createStore(reducer, applyMiddleware(...middlewares));
  let persistor = persistStore(store);
  return { store, persistor };
};

export default configureStore;
