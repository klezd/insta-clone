/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import TextField from '@material-ui/core/TextField';

import styles from './styles.module.css';
import Modal from './common/Modal';
import ImageInput from './common/ImageInput';

import { uploadToFirebase, postToDb } from '../store/dataAction';

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
		setImageURL('');
		setImage(null);
		props.onClose();
	};

	const handleChange = (event) => {
		setStatus(event.target.value);
	};

	const post = async () => {
		if (image !== null && imageURL.length > 0)
			await dispatch(
				uploadToFirebase({
					data: { image, post: status },
					withCallback: postToDb
				})
			);

		return;
	};

	const uploadbtnStyles = [styles.button, styles.uploadButton].join(' ');
	const disableduploadbtnStyles = [
		styles.button,
		styles.uploadButton,
		styles.disabled
	].join(' ');

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
					<div className={styles.closeBtn} onClick={() => onClose()}>
						<FontAwesomeIcon icon="times"></FontAwesomeIcon>
					</div>
				</div>
				<div className={styles.modalBody}>
					<ImageInput setImage={setImage} setImageURL={setImageURL} />
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
							className={
								image !== null && imageURL.length > 0
									? uploadbtnStyles
									: disableduploadbtnStyles
							}
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
