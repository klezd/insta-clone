import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { getAllPosts, getPostById } from '../store/action/postAction';
import { getTimeAgo } from '../utils';

import styles from './styles.module.css';

export default function FeedPage() {
	const dispatch = useDispatch();
	const history = useHistory();
	React.useEffect(() => {
		dispatch(getAllPosts());
	}, []);

	const allPosts = useSelector((s) => s.post.allPosts);
	const postsInOrder = Object.values(allPosts).reverse();
	const openPost = (id) => {
		dispatch(getPostById(id));
		history.push(`/post/${id}`);
	};

	return (
		<div className={styles.PageRoot}>
			<div className={styles.pageContainer}>
				{postsInOrder.map((p, key) => {
					const { id, author, profileImg, image, date } = p;
					return (
						<div key={key} onClick={() => openPost(id)}>
							<img src={image} className={styles.image} />
							<div className={styles.authorContainer}>
								<div>
									<div>{date && getTimeAgo(date)}</div>
									<div>{author}</div>
								</div>
								<img src={profileImg}></img>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
