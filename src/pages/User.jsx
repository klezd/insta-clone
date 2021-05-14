import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';

import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams, useLocation, Link } from 'react-router-dom';

import UpdateUserProfile from '../components/UpdateUserProfile';

import { getPostById, getUserPosts } from '../store/action/postAction';
import { getUserInfo } from '../store/action/userAction';

import { getTimeAgo } from '../utils';

import styles from './styles.module.css';

UserPage.propTypes = {
	openUploadPhoto: PropTypes.func
};

function UserPage(props) {
	const dispatch = useDispatch();
	const history = useHistory();
	const params = useParams();
	const location = useLocation();

	let userId = null;

	const user = useSelector((s) => s.user.user);

	let isUser = location.pathname === '/my-profile' || user ? true : false;

	if (!isUser) {
		userId = params.id;
	} else if (user) {
		userId = user.uid;
	}

	// This value is to check if this is the page of current user profile

	const [displayPopup, setDisplayPopup] = React.useState('');

	const openProfilePopup = () => {
		setDisplayPopup('profile');
	};

	const closeModal = () => {
		setDisplayPopup('');
	};

	React.useEffect(() => {
		dispatch(getUserInfo(userId));
		dispatch(getUserPosts(userId));
	}, []);

	const userPosts = useSelector((s) => s.post.allUserPosts);
	const userInfo = useSelector((s) => s.user.userInfo);
	const dataLoading = useSelector((s) => s.post.dataLoading);
	const pageUserInfo = userInfo ? userInfo[userId] : null;
	const errorFromUserPage = useSelector((s) => s.user.errorCode);

	if (!pageUserInfo && errorFromUserPage === 404) {
		return (
			<div className={[styles.PageRoot, styles.userPage].join(' ')}>
				This user has not initialize their account yet! <br />
				Come back to <Link to="/">Home</Link>
			</div>
		);
	} else if (!pageUserInfo || dataLoading) {
		return (
			<div className={[styles.PageRoot, styles.userPage].join(' ')}>
				Loading...
			</div>
		);
	}

	const { name, status, profileImage } = pageUserInfo;

	const modifiedStatus = status
		? status.length > 50
			? status.slice(0, 50) + '...'
			: status
		: '';

	const postsAsArray = Object.values(userPosts);
	const modifiedPostsList =
		postsAsArray.length > 1 ? postsAsArray.reverse() : postsAsArray;

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
						{isUser && (
							<div
								className={styles.statusBtn}
								onClick={() => openProfilePopup()}
							>
								Update my profile
							</div>
						)}
					</div>
				</div>
				{modifiedPostsList.length === 0 ? (
					<div className={styles.pageNoContent}>
						{isUser ? (
							<>
								You have not posted anything yet!
								<br />
								Start posting from{' '}
								<span onClick={() => props.openUploadPhoto()}>here</span> !
							</>
						) : (
							<>This user have not posted anything yet!</>
						)}
					</div>
				) : (
					<div className={styles.pageContainer}>
						{modifiedPostsList.map((p, key) => {
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
			{isUser && (
				<UpdateUserProfile
					display={displayPopup === 'profile'}
					onClose={closeModal}
					userInfo={pageUserInfo}
				/>
			)}
		</React.Fragment>
	);
}

export default UserPage;
