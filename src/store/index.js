import { createStore, applyMiddleware, compose } from 'redux';
import ReduxThunk from 'redux-thunk';
import promise from 'redux-promise-middleware';

import reducer from './reducer';

const isDevEnv = window.location.href.includes('localhost');

export const middlewares = [promise, ReduxThunk];

let enhancer;

if (isDevEnv) {
	const composeEnhancer =
		window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
	enhancer = composeEnhancer(applyMiddleware(...middlewares));
} else {
	enhancer = applyMiddleware(...middlewares);
}

export default createStore(reducer, enhancer);
