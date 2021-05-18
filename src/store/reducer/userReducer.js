import {
	LOGIN_WITH_GOOGLE,
	LOGIN_WITH_FACEBOOK,
	LOGOUT,
	GET_USER,
	GET_USER_INFO,
	ADD_USER_INFO
} from '../types';

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
		case `${LOGIN_WITH_FACEBOOK}_PENDING`:
			return {
				...state,
				authLoading: true
			};
		case `${LOGIN_WITH_GOOGLE}_SUCCESS`:
		case `${LOGIN_WITH_FACEBOOK}_SUCCESS`:
			return {
				...state,
				user: payload.user,
				authLoading: false
			};
		case `${LOGIN_WITH_GOOGLE}_ERROR`:
		case `${LOGIN_WITH_FACEBOOK}_ERROR`:
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

		case `${GET_USER_INFO}_PENDING`:
		case `${ADD_USER_INFO}_PENDING`:
			return {
				...state,
				dataLoading: false
			};
		case `${GET_USER_INFO}_ERROR`:
		case `${ADD_USER_INFO}_ERROR`:
			return {
				...state,
				dataLoading: false,
				errorCode: payload.errorCode,
				errorMsg: payload.errorMsg
			};

		case `${GET_USER_INFO}_SUCCESS`:
		case `${ADD_USER_INFO}_SUCCESS`:
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
