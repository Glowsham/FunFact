import { useSelector, useDispatch } from 'react-redux';
import { learnToggle, createNewItem, menuClose } from '../stores/pageSlice';

import { useSpring, animated, config } from '@react-spring/web';
import AddIcon from '@material-ui/icons/Add';
import '../styles/Action.css';

function Action() {
	const page = useSelector((state) => state.page);
	const dispatch = useDispatch();
	const { x, y, z, r } = useSpring({
		from: { x: 0, y: 0, z: 0, r: 0 },
		x:
			page.status === 3 ||
			(page.type === 'notionDetails' &&
				page.items &&
				page.items.length !== 0)
				? 1
				: 0,
		y: page.type === 'notionDetails' && page.status !== 3 ? 1 : 0,
		z: page.status <= 2 ? 1 : 0,
		r: page.selected ? -45 : page.status === 4 ? 135 : 0,
		immediate: () => page.status <= 1,
		config: { ...config.gentle }
	});

	return (
		<animated.div
			className={
				'actionButton shadow' +
				((page.learner && page.learner.length !== 0) ||
				page.status === 3
					? ' master'
					: '')
			}
			style={{
				bottom: x.to({
					output: [-40, 40]
				}),
				opacity: x.to({
					output: [0, 1],
					extend: 'clamp'
				}),
				display: x.to((x) =>
					x < 0.1 ? 'none' : 'flex'
				),
				background: y.to({
					output: [
						'linear-gradient(135deg, #21252a 0%, #21252a 100%)',
						'linear-gradient(135deg, rgba(255,200,71,1) 0%, rgba(255,160,16,1) 100%)'
					],
					extend: 'clamp'
				})
			}}
			onClick={clickHandler(page, dispatch)}
		>
			{page.type === 'notionDetails' ? (
				<animated.div
					className="learnButton"
					style={{
						opacity: z.to({
							output: [0, 1],
							extend: 'clamp'
						}),
						display: z.to((z) =>
							z < 0.1
								? 'none'
								: 'flex'
						),
						rotateZ: r
					}}
				>
					<img
						width="24"
						height="24"
						src="/starGray.png"
						alt="Learn"
						style={{
							filter:
								'drop-shadow(0 .125rem .25rem rgba(0,0,0,.075))'
						}}
					/>
				</animated.div>
			) : null}
			<animated.div style={{ rotateZ: r }}>
				<AddIcon />
			</animated.div>
		</animated.div>
	);
}

function clickHandler(page, dispatch) {
	return () => {
		if (page.type === 'notionDetails' && page.status !== 3) {
			dispatch(learnToggle());
		} else if (page.status === 3 && !page.selected) {
			dispatch(createNewItem());
		} else {
			dispatch(menuClose());
		}
	};
}

export default Action;
