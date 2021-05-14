import React from 'react';

import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { deletePostById, getPostById } from '../store/action/postAction';

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

	const { userId, author, id, profileImg, image, post, date } = currentPost;
	const isUser = user && user.uid === userId ? true : false;

	const openUserPage = (uid) => {
		if (isUser) {
			history.push('/my-profile');
		} else history.push('/user/' + uid);
	};

	const openFullImage = () => {
		window.open(image, '_blank');
	};

	const onDeletePost = () => {
		dispatch(deletePostById(id));
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
			<div className={styles.postContent}>
				<div>{post}</div>
				<img src={image} onClick={() => openFullImage()} />
				<div className={styles.actionPanel}>
					<div className={isUser ? '' : styles.stretch}>
						<div className={styles.actionBtn}>
							<FontAwesomeIcon icon={['fas', 'heart']} />
						</div>
						<div className={styles.actionBtn}>
							<FontAwesomeIcon icon={['far', 'comment-alt']} />
						</div>
					</div>
					{isUser && (
						<div className={styles.actionBtn} onClick={() => onDeletePost()}>
							<FontAwesomeIcon icon={['fas', 'trash']} />
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
