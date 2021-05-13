/* eslint-disable react/display-name */
import React from 'react';
import { useDispatch } from 'react-redux';

import { firebaseAuth } from '../../firebase';
import { unauthorizeUser } from '../../store/action/userAction';

const withAuthorize = (WrappedComponent) => (props) => {
	const dispatch = useDispatch();
	const user = firebaseAuth.currentUser;

	if (!user) {
		dispatch(unauthorizeUser());
	}

	return <WrappedComponent {...props} />;
};

export default withAuthorize;
