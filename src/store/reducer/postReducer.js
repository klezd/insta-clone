import { UPLOAD_POST, GET_USER_POSTS, GET_POST, GET_ALL_POSTS } from '../types';

const initialState = {
	dataLoading: false,
	currentPost: null,
	allUserPosts: {},
	allPosts: {},
	error: null,
	errorCode: null,
	errorMsg: null
};

function postReducer(state = initialState, action) {
	const { type, payload } = action;

	switch (type) {
		case `${UPLOAD_POST}_PENDING`:
		case `${GET_USER_POSTS}_PENDING`:
		case `${GET_POST}_PENDING`:
		case `${GET_ALL_POSTS}_PENDING`:
			return {
				...state,
				dataLoading: true
			};

		case `${GET_USER_POSTS}_ERROR`:
		case `${GET_ALL_POSTS}_ERROR`:
		case `${UPLOAD_POST}_ERROR`:
		case `${GET_POST}_ERROR`:
			return {
				...state,
				dataLoading: false,
				errorCode: payload.errorCode,
				errorMsg: payload.errorMsg
			};

		case `${GET_ALL_POSTS}_SUCCESS`:
			return {
				...state,
				allPosts: payload.data,
				dataLoading: false
			};

		case `${GET_POST}_SUCCESS`:
			return {
				...state,
				currentPost: payload.data,
				dataLoading: false
			};
		case `${GET_USER_POSTS}_SUCCESS`:
			return {
				...state,
				allUserPosts: payload.data,
				dataLoading: false
			};

		case `${UPLOAD_POST}_SUCCESS`:
			return {
				...state,
				dataLoading: false,
				currentPost: payload.data
			};

		default:
			return {
				...state
			};
	}
}

export default postReducer;
