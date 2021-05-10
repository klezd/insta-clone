import React from 'react';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fab, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';

import './App.css';

import Feed from './pages/Feed';
import User from './pages/User';
import Image from './pages/Image';
import Error from './pages/Error';
import { Button } from '@material-ui/core';
import Authentication from './components/Authentication';

library.add(fab, fas, faGoogle);

function App() {
	const [displayPopup, setDisplayPopup] = React.useState('');

	const openAuth = () => {
		setDisplayPopup('auth');
	};

	const closeAuth = () => {
		setDisplayPopup('');
	};

	return (
		<div className="App">
			<header className="App-header">
				<div className="App-navigation"></div>
				<div className="App-logo">InstaIMG</div>
				<div className="App-action">
					<Button onClick={() => openAuth()}>Login</Button>
				</div>
			</header>
			<Router>
				<div className="App-container">
					<Switch>
						<Route path="/" exact component={Feed} />
						<Route path="/user" component={User} />
						<Route path="/image/:id" component={Image} />
						<Route component={Error} />
					</Switch>
				</div>
			</Router>
			<footer className="App-footer"></footer>

			<Authentication display={displayPopup === 'auth'} onClose={closeAuth} />
		</div>
	);
}

export default App;
