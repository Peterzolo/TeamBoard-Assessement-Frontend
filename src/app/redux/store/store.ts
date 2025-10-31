import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { applyMiddleware, compose } from "redux";
import logger from "redux-logger";
import rootReducer from "../reducers/rootReducer";
import rootSaga from "../saga/rootSaga";

const sagaMiddleware = createSagaMiddleware();

// Combine sagaMiddleware and logger into a single middleware array
const middleware = [sagaMiddleware, logger];

// Create the Redux store with the root reducer, middleware, and dev tools enhancer
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(middleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
