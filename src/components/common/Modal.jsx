import React from 'react';
import PropTypes from 'prop-types';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

import Dialog from '@material-ui/core/Dialog';

Modal.propTypes = {
	display: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	ariaLabel: PropTypes.string,
	children: PropTypes.element,
	breakpoints: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
	maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg'])
};

Modal.defaultProps = {
	display: false,
	breakpoints: 'xs',
	maxWidth: 'xs'
};

export default function Modal(props) {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down(props.breakpoints));

	const onClose = () => {
		props.onClose();
	};

	return (
		<Dialog
			onClose={onClose}
			open={props.display}
			aria-labelledby={props.ariaLabel ? props.ariaLabel : 'modal'}
			fullScreen={fullScreen}
			maxWidth={props.maxWidth}
			scroll="paper"
		>
			{props.children}
		</Dialog>
	);
}
