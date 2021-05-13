/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import styles from './styles.module.css';
import Modal from './common/Modal';
import ImageInput from './common/ImageInput';

import { addUserInfo, getUserInfo } from '../store/userAction';
import { uploadToFirebase } from '../store/dataAction';
import withAuthorize from './HOC/withAuthorize';

UpdateUserProfile.propTypes = {
	display: PropTypes.bool,
	onClose: PropTypes.func,
	userInfo: PropTypes.any
};

function UpdateUserProfile(props) {
	const dispatch = useDispatch();
	const dataLoading = useSelector((s) => s.dataLoading);

	const { profileImage, name, status } = props.userInfo;
	const [image, setImage] = React.useState(null);
	const [imageURL, setImageURL] = React.useState(profileImage);
	const [canSave, setCanSave] = React.useState(false);

	React.useEffect(() => {
		dispatch(getUserInfo());
	}, []);

	const [newname, setName] = React.useState(name);
	const [newstatus, setStatus] = React.useState(status);

	const onClose = () => {
		// reset to original state
		setImageURL(profileImage);
		setName(name);
		setStatus(status);
		setImage(null);
		// close popup
		props.onClose();
	};

	const onChangeName = (e) => {
		setName(e.target.value);
		setCanSave(true);
	};

	const onChangeStatus = (e) => {
		setStatus(e.target.value);
		setCanSave(true);
	};

	const update = () => {
		if (image) {
			dispatch(
				uploadToFirebase({
					data: {
						image,
						post: { name: newname, status: newstatus, email: '' }
					},
					withCallback: addUserInfo
				})
			);
		} else {
			dispatch(
				addUserInfo('', { name: newname, email: null, status: newstatus })
			);
		}
		onClose();
	};

	return (
		<Modal
			display={props.display}
			onClose={onClose}
			breakpoints="sm"
			maxWidth="sm"
		>
			<div className={styles.authModal}>
				<div className={styles.modalNav}>
					<div></div>
					<div className={styles.title}>Update My Profile</div>
					<div className={styles.closeBtn} onClick={() => onClose()}>
						<FontAwesomeIcon icon="times"></FontAwesomeIcon>
					</div>
				</div>
				<div className={styles.modalBody}>
					{imageURL && (
						<div className={styles.avatarHolder}>
							<img className={styles.img} src={imageURL} />
						</div>
					)}
					<ImageInput
						setImage={setImage}
						setImageURL={setImageURL}
						setChange={setCanSave}
					/>
					<TextField
						placeholder="User name"
						label="User name"
						value={newname}
						onChange={onChangeName}
						fullWidth
					/>
					<TextField
						placeholder="Status"
						label="Status"
						multiline
						rowsMax={4}
						rows={2}
						value={newstatus}
						onChange={onChangeStatus}
						fullWidth
					/>
					{dataLoading ? (
						<>Loading</>
					) : (
						<Button disabled={!canSave} onClick={() => update()}>
							Update
						</Button>
					)}
				</div>
			</div>
		</Modal>
	);
}

export default withAuthorize(UpdateUserProfile);
