/*
IMPROVEMENTS TO DO:
- pause when new slide added to learner
- cardItem, actionButton, menuBackground slow animation
*/

import React from 'react';
import { Provider } from 'react-redux';
import store from './stores/store';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
	<Provider store={store}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</Provider>,
	document.getElementById('root')
);
