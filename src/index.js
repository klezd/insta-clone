import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './store';

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
);

// FIREBASE
var firebaseConfig = {
	apiKey: 'API_KEY',
	authDomain: 'PROJECT_ID.firebaseapp.com',
	databaseURL: 'https://PROJECT_ID.firebaseio.com',
	projectId: 'insta-clone-eda38',
	storageBucket: 'PROJECT_ID.appspot.com',
	messagingSenderId: 'SENDER_ID',
	appId: 'APP_ID',
	measurementId: 'G-MEASUREMENT_ID'
};

firebase.initializeApp(firebaseConfig);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
