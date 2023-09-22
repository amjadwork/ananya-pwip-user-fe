import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Use local storage as the storage engine

import rootReducer from "./reducers"; // Import your root reducer
import rootSaga from "./sagas"; // Import your root saga

const sagaMiddleware = createSagaMiddleware();

// Define persist config
const persistConfig = {
  key: "root", // Key in local storage
  storage, // Storage engine
  whitelist: [
    "auth",
    "products",
    "locations",
    "costing",
    "bags",
    "myCosting",
  ], // List of reducers to persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const composeEnhancers =
  typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;

const enhancer = composeEnhancers(applyMiddleware(sagaMiddleware));

const store = createStore(persistedReducer, enhancer);
export const persistor = persistStore(store); // Create a persistor

sagaMiddleware.run(rootSaga);

export default store;
