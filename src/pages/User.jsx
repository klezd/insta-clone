import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import withAuthorize from '../components/HOC/withAuthorize';
import { getUserPosts } from '../store/dataAction';
import { getTimeAgo } from '../utils';
import styles from './styles.module.css';

function UserPage() {
	const dispatch = useDispatch();
	const history = useHistory();

	React.useEffect(() => {
		dispatch(getUserPosts());
	}, []);

	const user = useSelector((s) => s.user);
	const userPosts = useSelector((s) => s.allUserPosts);

	const { displayName, status, photoURL } = user;

	const modifiedStatus = status
		? status.length > 50
			? status.slice(0, 50) + '...'
			: status
		: '';

	const openPost = (id) => {
		history.push(`/post/${id}`);
	};
	return (
		<div className={[styles.PageRoot, styles.userPage].join(' ')}>
			<div className={[styles.pageHeader, styles.userPage].join(' ')}>
				<div className={styles.userAvt}>
					<img src={photoURL} />
				</div>
				<div className={styles.userTitle}>
					<div>
						<div className={styles.userName}>{displayName}</div>
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
					<div className={styles.statusBtn}>Update my profile</div>
				</div>
			</div>
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
		</div>
	);
}

export default withAuthorize(UserPage);
