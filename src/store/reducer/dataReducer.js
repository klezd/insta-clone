import { GET_ALL_IMAGES, DELETE_IMAGE, UPLOAD_IMAGE } from '../types';

const initialState = {
	imgLoading: false,
	imagesList: [],
	imagesOfUser: [],
	currentImg: '',
	error: null,
	errorCode: null,
	errorMsg: null
};

function dataReducer(state = initialState, action) {
	const { type, payload } = action;

	switch (type) {
		case `${GET_ALL_IMAGES}_PENDING`:
		case `${DELETE_IMAGE}_PENDING`:
		case `${UPLOAD_IMAGE}_PENDING`:
			return {
				...state,
				imgLoading: true
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

		default:
			return {
				...state
			};
	}
}

export default dataReducer;
