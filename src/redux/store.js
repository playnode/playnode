import {configureStore} from "@reduxjs/toolkit";
import {combineReducers} from "redux";
import createSagaMiddleware from "redux-saga";
import {all} from "redux-saga/effects";
import {createRouterReducer, createRouterMiddleware} from "@lagunovsky/redux-react-router";
import {createBrowserHistory} from "history";
import loggingMiddleware from "redux-logger";
import Constants from "../constants";

// Reducers
import windowReducer from "./window/reducers";

// Sagas
import * as windowSagas from "./window/sagas";

export const history = createBrowserHistory();
const sagaMiddleware = createSagaMiddleware();

const reducer = combineReducers({
    router: createRouterReducer(history),
    window: windowReducer,
});

const middleware = [];
middleware.push(createRouterMiddleware(history));

if (Constants.logActions) {
    middleware.push(loggingMiddleware);
}

middleware.push(sagaMiddleware);

export const store = configureStore({reducer, middleware});

const sagas = [];

function collectSagas(file) {
    for (const name in file) {
        if (file.hasOwnProperty(name)) {
            sagas.push(file[name]());
        }
    }
}

collectSagas(windowSagas);

function* rootSaga() {
    yield all(sagas);
}

sagaMiddleware.run(rootSaga);
