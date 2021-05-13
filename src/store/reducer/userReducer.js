import { LOGIN_WITH_GOOGLE, LOGOUT, GET_USER, GET_USER_INFO } from '../types';

const initialState = {
	authLoading: false,
	dataLoading: false,
	user: null,
	userInfo: null,
	error: null,
	errorCode: null,
	errorMsg: null
};

function userReducer(state = initialState, action) {
	const { type, payload } = action;

	switch (type) {
		case `${LOGIN_WITH_GOOGLE}_PENDING`:
			return {
				...state,
				authLoading: true
			};
		case `${LOGIN_WITH_GOOGLE}_SUCCESS`:
			return {
				...state,
				user: payload.user,
				authLoading: false
			};
		case `${LOGIN_WITH_GOOGLE}_ERROR`:
			return {
				...state,
				user: null,
				authLoading: false,
				errorCode: payload.errorCode,
				errorMsg: payload.errorMsg
			};

		case `${LOGOUT}_PENDING`:
			return {
				...state,
				authLoading: true
			};
		case `${LOGOUT}_SUCCESS`:
			return {
				...state,
				user: null,
				authLoading: false
			};
		case `${LOGOUT}_ERROR`:
			return {
				...state,
				authLoading: false,
				errorCode: payload.errorCode,
				errorMsg: payload.errorMsg
			};

		case GET_USER:
			return {
				...state,
				user: payload.user
			};

		case `${GET_USER_INFO}_ERROR`:
			return {
				...state,
				dataLoading: false,
				errorCode: payload.errorCode,
				errorMsg: payload.errorMsg
			};

		case `${GET_USER_INFO}_SUCCESS`:
			return {
				...state,
				userInfo: {
					...state.userInfo,
					[payload.userId]: payload.data
				},
				dataLoading: false
			};

		default:
			return {
				...state
			};
	}
}

export default userReducer;
