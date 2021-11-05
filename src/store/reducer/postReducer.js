import {
	UPLOAD_POST,
	GET_USER_POSTS,
	GET_POST,
	GET_ALL_POSTS,
	DELETE_POST,
	RELOAD,
	LIKE_POST
} from '../types';

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
		case RELOAD:
			return initialState;

		case `${UPLOAD_POST}_PENDING`:
		case `${GET_USER_POSTS}_PENDING`:
		case `${GET_POST}_PENDING`:
		case `${GET_ALL_POSTS}_PENDING`:
		case `${DELETE_POST}_PENDING`:
			return {
				...state,
				dataLoading: true
			};
		case `${GET_USER_POSTS}_ERROR`:
		case `${GET_ALL_POSTS}_ERROR`:
		case `${UPLOAD_POST}_ERROR`:
		case `${GET_POST}_ERROR`:
		case `${DELETE_POST}_ERROR`:
			return {
				...state,
				dataLoading: false,
				errorCode: payload.errorCode,
				errorMsg: payload.errorMsg
			};

		case `${DELETE_POST}_SUCCESS`:
			return {
				...state,
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

		case `${UPLOAD_POST}_SUCCESS`:
			return {
				...state,
				dataLoading: false,
				currentPost: payload.data
			};

		case `${LIKE_POST}_SUCCESS`: {
			const currentPostId = state.currentPost.id;
			const currentPost = state.currentPost;
			if (payload.postId === currentPostId) {
				const likeCount = currentPost['likeCount']
					? currentPost['likeCount']
					: 0;
				if (payload.isLike) {
					currentPost['likeCount'] = likeCount + 1;
				} else {
					if (likeCount > 0) {
						currentPost['likeCount'] = likeCount - 1;
					} else {
						currentPost['likeCount'] = 0;
					}
				}
			}

			const allPosts = state.allPosts;
			if (allPosts) {
				const post = allPosts[payload.postId];
				if (post) {
					const likeCount = post['likeCount'] ? post['likeCount'] : 0;
					if (payload.isLike) {
						allPosts[payload.postId]['likeCount'] = likeCount + 1;
					} else {
						if (likeCount > 0) {
							allPosts[payload.postId]['likeCount'] = likeCount - 1;
						} else {
							currentPost['likeCount'] = 0;
						}
					}
				}
			}
			return {
				...state,
				currentPost
			};
		}
		case `${LIKE_POST}_ERROR`:
			return {
				...state,
				errorCode: payload.errorCode,
				errorMsg: payload.errorMsg
			};

		default:
			return {
				...state
			};
	}
}

export default postReducer;
