import {
	firebaseAuth,
	firebaseDb,
	firebaseStorage as storage
} from '../firebase';

import {
	UPLOAD_POST,
	GET_USER_POSTS,
	UPLOAD_IMAGE,
	GET_ALL_IMAGES,
	DELETE_IMAGE,
	GET_POST,
	GET_ALL_POSTS
} from './types';

export const uploadToFirebase = (image, post) => (dispatch) => {
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
					dispatch(postToDb(downloadURL, post));
				});
				dispatch(getImagesFromFirebase);
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

export const postToDb = (imageURL, post) => (dispatch) => {
	const user = firebaseAuth.currentUser;
	if (!user) return;

	dispatch({
		type: `${UPLOAD_POST}_PENDING`
	});

	if (user) {
		const newPostKey = firebaseDb.ref().child('posts').push().key;

		const data = {
			userId: user.uid,
			author: user.displayName,
			profileImg: user.photoURL,
			post,
			image: imageURL,
			id: newPostKey,
			date: Date.now()
		};
		var updates = {};
		updates['/posts/' + newPostKey] = data;
		updates['/user-posts/' + user.uid + '/' + newPostKey] = data;

		return firebaseDb.ref().update(updates, (error) => {
			if (error) {
				dispatch({
					type: `${UPLOAD_POST}_ERROR`,
					payload: { errorMsg: error.message, errorCode: error.code }
				});
			} else {
				dispatch({
					type: `${UPLOAD_POST}_SUCCESS`,
					payload: { data }
				});
			}
		});
	} else {
		dispatch({
			type: `${UPLOAD_POST}_ERROR`,
			payload: { errorMsg: 'Permission denied' }
		});
	}
};

export const getPostById = (id) => (dispatch) => {
	dispatch({
		type: `${GET_POST}_PENDING`
	});

	firebaseDb
		.ref('/posts/' + id)
		.get()
		.then((snapshot) => {
			if (snapshot.exists()) {
				const data = snapshot.val();
				dispatch({
					type: `${GET_POST}_SUCCESS`,
					payload: { data }
				});
			} else {
				dispatch({
					type: `${GET_POST}_SUCCESS`
				});
			}
		})
		.catch((error) => {
			dispatch({
				type: `${GET_POST}_ERROR`,
				payload: { errorCode: error.code, errorMsg: error.message }
			});
		});
};

export const getUserPosts = () => (dispatch) => {
	const user = firebaseAuth.currentUser;
	if (!user) return;

	dispatch({
		type: `${GET_USER_POSTS}_PENDING`
	});

	const ref = firebaseDb.ref('/user-posts/' + user.uid).orderByChild('date');
	ref
		.once('value', (snapshot) => {
			dispatch({
				type: `${GET_USER_POSTS}_SUCCESS`,
				payload: { data: snapshot.val() }
			});
		})
		.catch((error) => {
			dispatch({
				type: `${GET_USER_POSTS}_ERROR`,
				payload: { errorCode: error.code, errorMsg: error.message }
			});
		});
};

export const getAllPosts = () => (dispatch) => {
	dispatch({
		type: `${GET_ALL_POSTS}_PENDING`
	});
	const ref = firebaseDb.ref('/posts').orderByChild('date');
	ref
		.once('value', (snapshot) => {
			dispatch({
				type: `${GET_ALL_POSTS}_SUCCESS`,
				payload: { data: snapshot.val() }
			});
		})
		.catch((error) => {
			dispatch({
				type: `${GET_ALL_POSTS}_ERROR`,
				payload: { errorCode: error.code, errorMsg: error.message }
			});
		});
};
