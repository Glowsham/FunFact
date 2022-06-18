import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { pageOpen } from './stores/pageSlice';

import Loading from './components/Loading';
import Element from './components/Element';
import Items from './components/Items';
import Action from './components/Action';
import Menu from './components/Menu';
import { Toaster } from 'react-hot-toast';
import './styles/index.css';

function App() {
	const dispatch = useDispatch();
	const { pathname } = useLocation();

	var params = pathname.match(/\/([^/]*)\/?([^/]*)\/?/);
	useEffect(() => {
		dispatch(pageOpen(params));
	});

	return (
		<>
			<Loading />
			<Element />
			<Items />
			<Action />
			<Menu />
			<Toaster position="bottom-center" />
		</>
	);
}

export default App;
