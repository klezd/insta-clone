import { firebaseAuth, firebaseDb } from '../../firebase';

import {
	UPLOAD_POST,
	GET_USER_POSTS,
	GET_POST,
	GET_ALL_POSTS,
	DELETE_POST
} from '../types';

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

export const getUserPosts = (userId) => (dispatch) => {
	if (!userId) return;

	dispatch({
		type: `${GET_USER_POSTS}_PENDING`
	});

	const ref = firebaseDb
		.ref('/user-posts/' + userId)
		.orderByChild('date')
		.limitToLast(100);
	ref
		.once('value', (snapshot) => {
			const data = snapshot.val() !== null ? snapshot.val() : {};
			dispatch({
				type: `${GET_USER_POSTS}_SUCCESS`,
				payload: { data }
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
	const ref = firebaseDb.ref('/posts').orderByChild('date').limitToLast(100);

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

export const deletePostById = (id) => (dispatch) => {
	dispatch({
		type: `${DELETE_POST}_PENDING`
	});
	firebaseDb.ref('/posts/' + id).remove((error) => {
		if (error) {
			dispatch({
				type: `${DELETE_POST}_ERROR`,
				payload: { errorCode: error.code, errorMsg: error.message }
			});
		} else {
			dispatch({
				type: `${DELETE_POST}_SUCCESS`
			});
			window.location.href = '/my-profile';
		}
	});
};
