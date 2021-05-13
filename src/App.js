import React from 'react';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Main from './pages/Main';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import {
	fas,
	faHome,
	faUser,
	faPlus,
	faFileUpload,
	faTimes,
	faSignOutAlt,
	faHeart,
	faCommentAlt
} from '@fortawesome/free-solid-svg-icons';

import './App.css';

library.add(
	fab,
	fas,
	far,
	faGoogle,
	faHome,
	faUser,
	faPlus,
	faFileUpload,
	faTimes,
	faSignOutAlt,
	faHeart,
	faCommentAlt
);

function App() {
	return (
		<div className="App">
			<Router>
				<Switch>
					<Route path="/" component={Main}></Route>
				</Switch>
			</Router>
		</div>
	);
}

export default App;
