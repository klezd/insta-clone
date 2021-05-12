import React from 'react';

import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { getPostById } from '../store/dataAction';

import { getTimeAgo } from '../utils';

import styles from './styles.module.css';

export default function PostPage() {
	const params = useParams();
	const postId = params.id;

	const dispatch = useDispatch();

	React.useEffect(() => {
		dispatch(getPostById(postId));
	}, []);

	const currentPost = useSelector((s) => s.currentPost);
	const { author, profileImg, image, post, date } = currentPost;
	console.log({ author, profileImg, image, post, date });
	return (
		<div className={styles.PageRoot}>
			<div className={styles.navPage}>
				<div className={styles.navLeft}>
					<img src={profileImg} />
					<div>{author}</div>
				</div>
				<div className={styles.navRight}>
					<div>{date && getTimeAgo(date)}</div>
				</div>
			</div>
			<div className={styles.postContent}>
				<div>{post}</div>
				<img src={image} />
			</div>
		</div>
	);
}
