import React from 'react';

import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { getPostById } from '../store/action/postAction';

import { getTimeAgo } from '../utils';

import styles from './styles.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function PostPage() {
	const params = useParams();
	const postId = params.id;

	const history = useHistory();

	const dispatch = useDispatch();

	React.useEffect(() => {
		dispatch(getPostById(postId));
	}, []);

	const currentPost = useSelector((s) => s.post.currentPost);
	const dataLoading = useSelector((s) => s.post.dataLoading);
	const user = useSelector((s) => s.user.user);

	if (!currentPost || dataLoading) {
		return <div className={styles.PageRoot}>Loading...</div>;
	}

	const openUserPage = (uid) => {
		if (user && user.uid === uid) {
			history.push('/my-profile');
		} else history.push('/user/' + uid);
	};

	const { userId, author, profileImg, image, post, date } = currentPost;

	const openFullImage = () => {
		window.open(image, '_blank');
	};

	return (
		<div className={styles.PageRoot}>
			<div className={styles.navPage}>
				<div className={styles.navLeft} onClick={() => openUserPage(userId)}>
					<img src={profileImg} />
					<div>{author}</div>
				</div>
				<div className={styles.navRight}>
					<div>{date && getTimeAgo(date)}</div>
				</div>
			</div>
			<div className={styles.postContent} onClick={() => openFullImage()}>
				<div>{post}</div>
				<img src={image} />
				<div className={styles.actionPanel}>
					<div>
						<FontAwesomeIcon icon={['fas', 'heart']}></FontAwesomeIcon>
					</div>
					<div>
						<FontAwesomeIcon icon={['far', 'comment-alt']}></FontAwesomeIcon>
					</div>
				</div>
			</div>
		</div>
	);
}
