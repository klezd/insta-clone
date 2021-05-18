import firebase from 'firebase/app';
import { firebaseAuth, firebaseDb } from '../../firebase';
import { prepareUserObjToUploadFirebase } from '../../utils';

import {
	LOGIN,
	LOGIN_WITH_GOOGLE,
	LOGIN_WITH_FACEBOOK,
	LOGOUT,
	ADD_USER_INFO,
	GET_USER_INFO,
	GET_USER
} from '../types';

export const loginAction = (email, password) => async (dispatch) => {
	dispatch({
		type: `${LOGIN}_PENDING`
	});

	await firebaseAuth
		.createUserWithEmailAndPassword(email, password)
		.then((userCredential) => {
			// Signed in
			const user = userCredential.user;
			dispatch({
				type: `${LOGIN}_SUCCESS`,
				payload: { user }
			});

			return user;
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			console.error(errorCode, errorMessage);
			dispatch({
				type: `${LOGIN}_ERROR`,
				payload: error
			});
			return { email, errorCode, errorMsg: errorMessage };
		});
};

export const loginWithGoogleAction = () => async (dispatch) => {
	const provider = new firebase.auth.GoogleAuthProvider();
	dispatch(loginWithExternalService(LOGIN_WITH_GOOGLE, provider));
};

export const loginWithFacebookAction = () => async (dispatch) => {
	const provider = new firebase.auth.FacebookAuthProvider();
	dispatch(loginWithExternalService(LOGIN_WITH_FACEBOOK, provider));
};

export const loginWithExternalService = (type, provider) => {
	return async (dispatch) => {
		dispatch({
			type: `${type}_PENDING`
		});

		return await firebase
			.auth()
			.setPersistence(firebase.auth.Auth.Persistence.SESSION)
			.then(() => {
				return firebaseAuth
					.signInWithPopup(provider)
					.then((result) => {
						console.log(result);
						// // This gives you a Facebook Access Token. You can use it to access the Facebook API.
						const credential = result.credential;
						const token = credential.accessToken;
						// The signed-in user info.
						const user = result.user;
						dispatch({
							type: `${type}_SUCCESS`,
							payload: {
								user,
								token
							}
						});
						const userInfo = result.additionalUserInfo;
						if (userInfo.isNewUser) {
							dispatch(
								addUserInfo(user.photoURL, {
									name: user.displayName,
									email: user.email,
									status: null
								})
							);
						} else {
							dispatch(getUserInfo(user.uid));
						}

						localStorage.clear();
						localStorage.setItem('token', token);
						localStorage.setItem('user', JSON.stringify(user));
						return { token, user };
					})
					.catch((error) => {
						// Handle Errors here.
						const errorCode = error.code;
						const errorMessage = error.message;
						// The email of the user's account used.
						const email = error.email;
						// The AuthCredential type that was used.
						const credential = error.credential;
						dispatch({
							type: `${type}_ERROR`,
							payload: { email, errorCode, errorMsg: errorMessage }
						});
						return { email, errorCode, errorMsg: errorMessage, credential };
					});
			})
			.catch((error) => {
				// Handle Errors here.
				var errorCode = error.code;
				var errorMessage = error.message;
				dispatch({
					type: `${LOGIN_WITH_GOOGLE}_ERROR`,
					payload: { errorCode, errorMsg: errorMessage }
				});
				return { errorCode, errorMsg: errorMessage };
			});
	};
};
export const logout = () => (dispatch) => {
	dispatch({
		type: `${LOGOUT}_PENDING`
	});

	firebaseAuth
		.signOut()
		.then(() => {
			dispatch({
				type: `${LOGOUT}_SUCCESS`
			});
			dispatch(unauthorizeUser());
		})
		.catch((error) => {
			dispatch({
				type: `${LOGOUT}_ERROR`,
				payload: { errorCode: error.code, errorMsg: error.message }
			});
		});
};

export const unauthorizeUser = () => (dispatch) => {
	window.location.href = '/';
	localStorage.clear();
	dispatch({ type: 'UNAUTHORIZE' });
};

export const getUser = () => (dispatch) => {
	const user = firebaseAuth.currentUser;
	localStorage.setItem('user', user);
	dispatch({
		type: GET_USER,
		payload: { user }
	});
	dispatch(getUserInfo());
};

/**
 *
 * @param {Object} info = {name, email, url, status}
 * @returns
 */
const infoDefault = { name: null, email: null, status: null };
export function addUserInfo(url = null, info = infoDefault) {
	info['url'] = url;
	const data = prepareUserObjToUploadFirebase(info);
	return async (dispatch) => {
		dispatch({
			type: `${ADD_USER_INFO}_PENDING`
		});
		const userId = firebaseAuth.currentUser.uid;
		firebaseDb.ref('/users/' + userId).update(data, (error) => {
			if (error) {
				dispatch({
					type: `${ADD_USER_INFO}_ERROR`,
					payload: { errorCode: error.code, errorMsg: error.message }
				});
			} else {
				dispatch({
					type: `${ADD_USER_INFO}_SUCCESS`,
					payload: data
				});
			}
			dispatch(getUserInfo());
		});
	};
}

export const getUserInfo = (id) => (dispatch) => {
	dispatch({
		type: `${GET_USER_INFO}_PENDING`,
		payload: { id }
	});

	let userId = id;

	const user = firebaseAuth.currentUser;

	if (!userId && user) {
		userId = user.uid;
	}

	if (!userId) return;

	firebaseDb
		.ref('/users/' + userId)
		.get()
		.then((snapshot) => {
			if (snapshot.exists()) {
				const data = snapshot.val();
				dispatch({
					type: `${GET_USER_INFO}_SUCCESS`,
					payload: { data, userId }
				});
			} else {
				dispatch({
					type: `${GET_USER_INFO}_ERROR`,
					payload: {
						errorCode: 404,
						errorMsg: 'User info not found or is not updated yet.'
					}
				});
			}
		})
		.catch((error) => {
			dispatch({
				type: `${GET_USER_INFO}_ERROR`,
				payload: { errorCode: error.code, errorMsg: error.message }
			});
		});
};
