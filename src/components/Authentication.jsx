import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './styles.module.css';
import Modal from './common/Modal';

import { loginWithGoogleAction } from '../store/userAction';

Authentication.propTypes = {
	display: PropTypes.bool,
	onClose: PropTypes.func
};

export default function Authentication(props) {
	const dispatch = useDispatch();

	const onClose = () => {
		props.onClose();
	};

	const loginWithGoogle = async () => {
		dispatch(loginWithGoogleAction());
		onClose();
	};

	return (
		<Modal display={props.display} onClose={onClose}>
			<div className={styles.authModal}>
				<div className={styles.modalNav}>
					<div></div>
					<div className={styles.title}>LOGIN</div>
					<div></div>
				</div>
				<div className={styles.modalBody}>
					<div
						className={[styles.GGbutton, styles.button].join(' ')}
						onClick={() => loginWithGoogle()}
					>
						<FontAwesomeIcon icon={['fab', 'google']} />
						<span>Login With Google</span>
					</div>
				</div>
			</div>
		</Modal>
	);
}
