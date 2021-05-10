import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

import Dialog from '@material-ui/core/Dialog';
import styles from './styles.module.css';

Authentication.propTypes = {
	display: PropTypes.bool,
	onClose: PropTypes.func
};

export default function Authentication(props) {
	const rootStyles = props.display
		? styles.authRoot
		: [styles.authRoot, styles.hidden].join(' ');
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

	const onClose = () => {
		props.onClose();
	};

	const loginWithGoogle = () => {
		// TODO Login with google
		onClose();
	};

	return (
		<div className={rootStyles}>
			<Dialog
				onClose={onClose}
				open={props.display}
				aria-labelledby="auth-Dialog"
				fullScreen={fullScreen}
				scroll="paper"
			>
				<div className={styles.authModal}>
					<div className={styles.modalNav}>LOGIN</div>
					<div className={styles.modalBody}>
						<div className={styles.button} onClick={() => loginWithGoogle()}>
							<FontAwesomeIcon icon={['fab', 'google']} />
							<span>Login With Google</span>
						</div>
					</div>
				</div>
			</Dialog>
		</div>
	);
}
