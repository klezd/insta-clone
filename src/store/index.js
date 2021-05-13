import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import ReduxThunk from 'redux-thunk';
import promise from 'redux-promise-middleware';

import dataReducer from './reducer/dataReducer';
import userReducer from './reducer/userReducer';
import postReducer from './reducer/postReducer';

const isDevEnv = window.location.href.includes('localhost');

export const middlewares = [promise, ReduxThunk];

let enhancer;

const rootReducer = combineReducers({
	data: dataReducer,
	user: userReducer,
	post: postReducer
});

if (isDevEnv) {
	const composeEnhancer =
		window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
	enhancer = composeEnhancer(applyMiddleware(...middlewares));
} else {
	enhancer = applyMiddleware(...middlewares);
}

export default createStore(rootReducer, enhancer);
