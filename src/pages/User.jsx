import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';

import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import withAuthorize from '../components/HOC/withAuthorize';
import { getPostById, getUserPosts } from '../store/dataAction';
import { getTimeAgo } from '../utils';
import styles from './styles.module.css';
import UpdateUserProfile from '../components/UpdateUserProfile';

UserPage.propTypes = {
	openUploadPhoto: PropTypes.func
};

function UserPage(props) {
	const dispatch = useDispatch();
	const history = useHistory();
	const [displayPopup, setDisplayPopup] = React.useState('');

	const openProfilePopup = () => {
		setDisplayPopup('profile');
	};

	const closeModal = () => {
		setDisplayPopup('');
	};

	React.useEffect(() => {
		dispatch(getUserPosts());
	}, []);

	const userPosts = useSelector((s) => s.allUserPosts);
	const userInfo = useSelector((s) => s.userInfo);

	console.log(userInfo);

	const { name, status, profileImage } = userInfo;

	const modifiedStatus = status
		? status.length > 50
			? status.slice(0, 50) + '...'
			: status
		: '';

	const openPost = (id) => {
		dispatch(getPostById(id));
		history.push(`/post/${id}`);
	};

	return (
		<React.Fragment>
			<div className={[styles.PageRoot, styles.userPage].join(' ')}>
				<div className={[styles.pageHeader, styles.userPage].join(' ')}>
					<div className={styles.userAvt}>
						<img src={profileImage} />
					</div>
					<div className={styles.userTitle}>
						<div>
							<div className={styles.userName}>{name}</div>
							{status && (
								<Tooltip
									title={
										status.length > 50 ? (
											<span style={{ fontSize: 13 }}>{status}</span>
										) : (
											''
										)
									}
								>
									<div className={styles.statusLine}>
										<q>{modifiedStatus}</q>
									</div>
								</Tooltip>
							)}
						</div>
						<div
							className={styles.statusBtn}
							onClick={() => openProfilePopup()}
						>
							Update my profile
						</div>
					</div>
				</div>
				{Object.keys(userPosts).length === 0 ? (
					<div className={styles.pageNoContent}>
						You have not posted anything yet!
						<br />
						Start posting from{' '}
						<span onClick={() => props.openUploadPhoto()}>here</span> !
					</div>
				) : (
					<div className={styles.pageContainer}>
						{Object.values(userPosts).map((p, key) => {
							const { id, image, date } = p;
							return (
								<div key={key} onClick={() => openPost(id)}>
									<img src={image} className={styles.image} />
									<div className={styles.authorContainer}>
										<div>
											<div>{date && getTimeAgo(date)}</div>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
			<UpdateUserProfile
				display={displayPopup === 'profile'}
				onClose={closeModal}
				userInfo={userInfo}
			/>
		</React.Fragment>
	);
}

export default withAuthorize(UserPage);
