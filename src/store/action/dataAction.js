import { firebaseStorage as storage } from '../../firebase';

import { UPLOAD_IMAGE, GET_ALL_IMAGES, DELETE_IMAGE } from '../types';

export function uploadToFirebase({ data, withCallback }) {
	const { image, post } = data;
	return (dispatch) => {
		if (image) {
			dispatch({
				type: `${UPLOAD_IMAGE}_PENDING`
			});

			const storageRef = storage.ref();
			const imageRef = storageRef.child(image.name);
			imageRef
				.put(image)
				.then(() => {
					imageRef.getDownloadURL().then((downloadURL) => {
						dispatch({
							type: `${UPLOAD_IMAGE}_SUCCESS`,
							payload: { currentImg: downloadURL }
						});
						dispatch(withCallback(downloadURL, post));
					});
				})
				.catch((error) => {
					dispatch({
						type: `${UPLOAD_IMAGE}_ERROR`,
						payload: { errorCode: error.code, errorMsg: error.message }
					});
				});
		} else {
			alert('Please upload an image first.');
		}
	};
}

export const getImagesFromFirebase = () => (dispatch) => {
	//1.
	let storageRef = storage.ref();
	//2.
	storageRef
		.listAll()
		.then(function (res) {
			//3.
			res.items.forEach((imageRef) => {
				dispatch({
					type: `${GET_ALL_IMAGES}_SUCCESS`,
					payload: { imageRef }
				});
			});
		})
		.catch(function (error) {
			dispatch({
				type: `${GET_ALL_IMAGES}_ERROR`,
				payload: { errorCode: error.code, errorMsg: error.message }
			});
		});
};

export const deleteFromFirebase = (url) => (dispatch) => {
	dispatch({
		type: `${DELETE_IMAGE}_PENDING`
	});

	let pictureRef = storage.refFromURL(url);
	pictureRef
		.delete()
		.then(() => {
			dispatch({
				type: `${DELETE_IMAGE}_SUCCESS`,
				payload: { url }
			});

			alert('Picture is deleted successfully!');
		})
		.catch((error) => {
			dispatch({
				type: `${DELETE_IMAGE}_ERROR`,
				payload: { errorCode: error.code, errorMsg: error.message }
			});
		});
};
