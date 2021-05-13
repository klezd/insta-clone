import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Modal from './common/Modal';

import { loginWithGoogleAction } from '../store/action/userAction';
import styles from './styles.module.css';

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
		<Modal
			display={props.display}
			onClose={onClose}
			breakpoints="xs"
			maxWidth="xs"
		>
			<div className={styles.authModal}>
				<div className={styles.modalNav}>
					<div></div>
					<div className={styles.title}>LOGIN</div>
					<div className={styles.closeBtn} onClick={() => onClose()}>
						<FontAwesomeIcon icon="times"></FontAwesomeIcon>
					</div>
				</div>
				<div className={styles.modalBody}>
					<div className={styles.error}>{localStorage.getItem('errorMsg')}</div>
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
