import { useSelector } from 'react-redux';
import { useState } from 'react';

import { useSpring, animated, config } from '@react-spring/web';
import FolderEditor from './menu/FolderEditor';
import CardEditor from './menu/CardEditor';
import Learner from './menu/Learner';
import '../styles/Menu.css';

function Menu() {
	const page = useSelector((state) => state.page);
	const { x } = useSpring({
		from: { x: 0, y: 0 },
		x: page.selected || page.status === 4 ? 1 : 0,
		config: { ...config.gentle }
	});

	const [selected, setSelected] = useState(null);
	if (page.selected && selected !== page.selected)
		setSelected(page.selected);

	return (
		<div className="menu">
			<animated.div
				className="menuBackground"
				style={{
					opacity: x.to({
						output: [0, 1],
						extend: 'clamp'
					}),
					display: x.to((x) => {
						if (
							x < 0.1 &&
							!page.selected &&
							selected !== null
						)
							setSelected(null);
						return x < 0.1
							? 'none'
							: 'initial';
					})
				}}
			/>
			<animated.div
				className={
					'menuMain' +
					(page.status === 3 ? ' editor' : '') +
					(page.type === 'notionDetails'
						? ' cardEdit'
						: ' folderEdit')
				}
				style={{
					top: x.to({
						output: [-50, 0],
						extend: 'clamp'
					}),
					opacity: x.to({
						output: [0, 1],
						extend: 'clamp'
					}),
					visibility: x.to((x) =>
						x === 0 ? 'hidden' : 'visible'
					),
					pointerEvents: x.to((x) =>
						x !== 1 ? 'none' : 'initial'
					)
				}}
			>
				{selected && page.type === 'notionDetails' ? (
					<CardEditor item={selected} />
				) : selected ? (
					<FolderEditor item={selected} />
				) : null}
				{page.type === 'notionDetails' ? (
					<Learner />
				) : null}
			</animated.div>
		</div>
	);
}

export default Menu;
