import React from 'react';
import PropTypes from 'prop-types';

import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TextField from '@material-ui/core/TextField';

import {
	deletePostById,
	getPostById,
	likePost
} from '../../store/action/postAction';

import { getTimeAgo } from '../../utils';

import styles from './styles.module.css';

PostPage.propTypes = {
	openAuth: PropTypes.func
};

export default function PostPage(props) {
	const params = useParams();
	const postId = params.id;

	const [comment, setComment] = React.useState('');
	const [focusCommentBtn, setFocus] = React.useState(false);

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

	const triggerLike = () => {
		if (!user) {
			props.openAuth();
			localStorage.setItem('errorMsg', 'You must login first!');
		} else {
			const userId = user.uid;
			const isLike =
				currentPost['likes'] &&
				currentPost['likes'][userId] &&
				currentPost['likes'][userId] === true
					? false
					: true;
			dispatch(likePost(id, author, isLike));
		}
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
						<div>
							<div className={styles.actionBtn} onClick={() => triggerLike()}>
								<FontAwesomeIcon icon={['fas', 'heart']} />
							</div>
							<div>{currentPost.like}</div>
						</div>
						<div>
							<div className={styles.actionBtn}>
								<FontAwesomeIcon icon={['far', 'comment-alt']} />
							</div>
							<div>
								{currentPost.comment && Object.keys(currentPost.comment)}
							</div>
						</div>
					</div>
					{isUser && (
						<div className={styles.actionBtn} onClick={() => onDeletePost()}>
							<FontAwesomeIcon icon={['fas', 'trash']} />
						</div>
					)}
				</div>
				<div className={styles.commentsPanel}>
					<div className={styles.commentList}></div>
					<div className={styles.commentInput}>
						<div className={styles.input}>
							<TextField
								multiline
								rowsMax={3}
								value={comment}
								onChange={(e) => setComment(e.target.value)}
								fullWidth
								placeholder="Your thoughts..."
							/>
						</div>
						<div
							className={styles.submitCmtBtn}
							onMouseEnter={() => setFocus(true)}
							onMouseLeave={() => setFocus(false)}
						>
							<FontAwesomeIcon
								icon={
									focusCommentBtn
										? ['fas', 'paper-plane']
										: ['far', 'paper-plane']
								}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
