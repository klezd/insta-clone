import {
	GET_ALL_IMAGES,
	DELETE_IMAGE,
	UPLOAD_IMAGE,
	UPLOAD_POST,
	LOGIN_WITH_GOOGLE,
	LOGOUT,
	GET_USER,
	GET_USER_INFO,
	GET_USER_POSTS,
	GET_POST,
	GET_ALL_POSTS
} from './types';

const initialState = {
	authLoading: false,
	user: null,
	userInfo: null,
	dataLoading: false,
	imgLoading: false,
	imagesList: [],
	imagesOfUser: [],
	currentImg: '',
	currentPost: null,
	allUserPosts: {},
	allPosts: {},
	error: null,
	errorCode: null,
	errorMsg: null
};

function reducer(state = initialState, action) {
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

		case `${GET_ALL_IMAGES}_PENDING`:
		case `${DELETE_IMAGE}_PENDING`:
		case `${UPLOAD_IMAGE}_PENDING`:
			return {
				...state,
				imgLoading: true
			};
		case `${UPLOAD_POST}_PENDING`:
		case `${GET_USER_INFO}_PENDING`:
		case `${GET_USER_POSTS}_PENDING`:
		case `${GET_POST}_PENDING`:
		case `${GET_ALL_POSTS}_PENDING`:
			return {
				...state,
				dataLoading: true
			};
		case `${UPLOAD_IMAGE}_ERROR`:
		case `${GET_ALL_IMAGES}_ERROR`:
		case `${DELETE_IMAGE}_ERROR`:
			return {
				...state,
				imgLoading: false,
				errorCode: payload.errorCode,
				errorMsg: payload.errorMsg
			};

		case `${GET_USER_INFO}_ERROR`:
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

		case `${GET_USER_INFO}_SUCCESS`:
			return {
				...state,
				userInfo: {
					...state.userInfo,
					[payload.userId]: payload.data
				},
				dataLoading: false
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

		case `${GET_ALL_IMAGES}_SUCCESS`: {
			const ref = payload.imageRef;
			const newImageList = ref
				.getDownloadURL()
				.then((url) => [...state.imagesList, url]);
			return {
				...state,
				imgLoading: false,
				imagesList: newImageList
			};
		}

		case `${DELETE_IMAGE}_SUCCESS`: {
			const imageListAfterDeleted = state.imagesList.filter(
				(image) => image !== payload.url
			);
			return {
				...state,
				imgLoading: false,
				imagesList: imageListAfterDeleted
			};
		}

		case `${UPLOAD_IMAGE}_SUCCESS`:
			return {
				...state,
				imgLoading: false,
				currentImg: payload.currentImg
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

export default reducer;
