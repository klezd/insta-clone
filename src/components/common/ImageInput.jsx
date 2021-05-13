import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.module.css';

ImageInput.propTypes = {
	setImage: PropTypes.func.isRequired,
	setImageURL: PropTypes.func.isRequired,
	setChange: PropTypes.func
};

export default function ImageInput(props) {
	const { setImage, setImageURL, setChange } = props;
	const onImageChange = (e) => {
		const reader = new FileReader();
		let file = e.target.files[0]; // get the supplied file
		// if there is a file, set image to that file
		if (file) {
			reader.onload = () => {
				if (reader.readyState === 2) {
					setImage(file);
					if (setChange) setChange(true);
				}
			};
			reader.readAsDataURL(e.target.files[0]);
			setImageURL(URL.createObjectURL(e.target.files[0]));
			// if there is no file, set image back to null
		} else {
			setImage(null);
		}
	};

	return (
		<div className={styles.photoInput}>
			<input
				type="file"
				accept="image/x-png,image/jpeg"
				onChange={(e) => {
					onImageChange(e);
				}}
			/>
		</div>
	);
}
