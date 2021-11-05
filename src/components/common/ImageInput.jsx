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
			// Modify image name to make it unique
			const indexOfLastDot = file.name.lastIndexOf('.');
			const imageNameWithoutSuffix = file.name.substring(0, indexOfLastDot);
			const imageSuffix = file.name.substring(indexOfLastDot + 1);
			const newImageName =
				imageNameWithoutSuffix + '_' + Date.now() + '.' + imageSuffix;
			file[name] = newImageName;
			console.log(file);

			reader.onload = () => {
				if (reader.readyState === 2) {
					setImage(file);
					if (setChange) setChange(true);
				}
			};
			reader.readAsDataURL(file);
			setImageURL(URL.createObjectURL(file));
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
