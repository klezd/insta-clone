/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import TextField from '@material-ui/core/TextField';

import styles from './styles.module.css';
import Modal from './common/Modal';

import { uploadToFirebase } from '../store/dataAction';

UploadPhoto.propTypes = {
	display: PropTypes.bool,
	onClose: PropTypes.func
};

export default function UploadPhoto(props) {
	const [image, setImage] = React.useState(null);
	const [imageURL, setImageURL] = React.useState('');
	const [status, setStatus] = React.useState('');

	const dispatch = useDispatch();
	const loading = useSelector((s) => s.dataLoading);
	const currentPost = useSelector((s) => s.currentPost);

	const history = useHistory();

	React.useEffect(() => {
		if (currentPost) {
			if (currentPost.id) {
				const id = currentPost.id;
				onClose();
				history.push('/post/' + id);
			}
		}
	}, [currentPost]);

	const onClose = () => {
		props.onClose();
	};

	const handleChange = (event) => {
		setStatus(event.target.value);
	};

	const onImageChange = (e) => {
		const reader = new FileReader();
		let file = e.target.files[0]; // get the supplied file
		// if there is a file, set image to that file
		if (file) {
			reader.onload = () => {
				if (reader.readyState === 2) {
					setImage(file);
				}
			};
			reader.readAsDataURL(e.target.files[0]);
			setImageURL(URL.createObjectURL(e.target.files[0]));
			// if there is no file, set image back to null
		} else {
			setImage(null);
		}
	};

	const post = async () => {
		await dispatch(uploadToFirebase(image, status));
	};

	return (
		<Modal
			display={props.display}
			onClose={onClose}
			breakpoints="sm"
			maxWidth="md"
		>
			<div className={styles.uploadModal}>
				<div className={styles.modalNav}>
					<div></div>
					<div className={styles.title}>Add Photo</div>
					<div onClick={() => onClose()}>
						<FontAwesomeIcon icon="times"></FontAwesomeIcon>
					</div>
				</div>
				<div className={styles.modalBody}>
					<div className={styles.photoInput}>
						<input
							type="file"
							accept="image/x-png,image/jpeg"
							onChange={(e) => {
								onImageChange(e);
							}}
						/>
					</div>
					{image && imageURL && (
						<div className={styles.photoHolder}>
							<img src={imageURL} />
						</div>
					)}
					<div className={styles.statusInput}>
						<TextField
							multiline
							rowsMax={4}
							value={status}
							onChange={handleChange}
							fullWidth
							placeholder="Status..."
						/>
					</div>
					{!loading && (
						<div
							className={[styles.button, styles.uploadButton].join(' ')}
							onClick={() => post()}
						>
							<FontAwesomeIcon icon="file-upload" />
							<span>Post</span>
						</div>
					)}
					{loading && <div> Posting... </div>}
				</div>
			</div>
		</Modal>
	);
}
