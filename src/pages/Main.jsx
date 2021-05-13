import React from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import Authentication from '../components/Authentication';
import UploadPhoto from '../components/UploadPhoto';

import Feed from './Feed';
import User from './User';
import Post from './Post';
import Error from './Error';

import '../App.css';
import styles from './styles.module.css';

import { getUser, logout } from '../store/userAction';

export default function Main() {
	const [displayPopup, setDisplayPopup] = React.useState('');
	const [openDrawer, setDisplayDrawer] = React.useState('');

	const history = useHistory();
	const dispatch = useDispatch();

	React.useEffect(() => {
		dispatch(getUser());
	}, []);

	const user = useSelector((s) => s.user);
	const userId = user ? user.uid : '';
	const alluserInfo = useSelector((s) => s.userInfo);
	const userInfo = alluserInfo ? alluserInfo[userId] : {};

	const onLogout = () => {
		dispatch(logout());
		closeDrawer();
	};

	const openAuth = () => {
		setDisplayPopup('auth');
	};

	const closeModal = () => {
		setDisplayPopup('');
	};

	const openUploadPhoto = () => {
		setDisplayPopup('uploadphoto');
	};

	const openUserDrawer = () => {
		setDisplayDrawer('user');
	};

	const openUserPage = () => {
		closeDrawer();
		history.push('/my-profile');
	};

	const closeDrawer = () => {
		setDisplayDrawer('');
	};

	return (
		<React.Fragment>
			<header className="App-header">
				<div className="App-navigation">
					<div className={styles.iconBtn} onClick={() => history.push('/')}>
						<FontAwesomeIcon icon="home" />
					</div>
				</div>
				<div className="App-logo">InstaIMG</div>
				<div className="App-action">
					{!user && <Button onClick={() => openAuth()}>Login</Button>}
					{user && (
						<div className={styles.iconBtn} onClick={() => openUserDrawer()}>
							{userInfo ? (
								<img src={userInfo.profileImage} />
							) : (
								<FontAwesomeIcon icon="user"></FontAwesomeIcon>
							)}
						</div>
					)}
				</div>
			</header>
			<div className="App-container">
				<Switch>
					<Route path="/" exact component={Feed} />
					<Route path="/user/:id" component={User} />
					<Route path="/my-profile">
						<User openUploadPhoto={openUploadPhoto} />
					</Route>
					<Route path="/post/:id" component={Post} />
					<Route component={Error} />
				</Switch>
			</div>
			<footer className="App-footer">
				<div className={styles.bigIconBtn} onClick={() => openUploadPhoto()}>
					<FontAwesomeIcon icon="plus"></FontAwesomeIcon>
				</div>
			</footer>

			<Authentication display={displayPopup === 'auth'} onClose={closeModal} />
			<UploadPhoto
				display={displayPopup === 'uploadphoto'}
				onClose={closeModal}
			/>

			<Drawer open={openDrawer === 'user'} anchor="right">
				<List>
					<ListItem button onClick={() => openUserPage()}>
						<ListItemIcon>
							<FontAwesomeIcon icon="user" />
						</ListItemIcon>
						<ListItemText>My Page</ListItemText>
					</ListItem>
					<ListItem button onClick={() => onLogout()}>
						<ListItemIcon>
							<FontAwesomeIcon icon="sign-out-alt" />
						</ListItemIcon>
						<ListItemText>Logout</ListItemText>
					</ListItem>
				</List>
			</Drawer>
		</React.Fragment>
	);
}
