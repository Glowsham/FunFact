import { useSelector, useDispatch } from 'react-redux';
import { organizeEnd } from '../stores/pageSlice';

import { useSpring, animated, config } from '@react-spring/web';
import CancelIcon from '@material-ui/icons/Cancel';
import '../styles/Element.css';

function Element() {
	const page = useSelector((state) => state.page);
	const dispatch = useDispatch();
	const { y } = useSpring({
		from: { y: 0 },
		y: page.status === 3 ? 1 : 0,
		config: { ...config.gentle }
	});

	return (page.element && page.element.title) || page.status === 3 ? (
		<div className="navbarContainer">
			{page.element && page.element.title ? (
				<div className="navbar shadow-sm bg-white">
					<div className="container-fluid">
						<div className="navbar-brand">
							{
								[
									...page
										.element
										.title
								][0]
							}
						</div>
						<div className="mx-auto navTitle">
							{[...page.element.title]
								.slice(2)
								.join('')}
						</div>
					</div>
				</div>
			) : null}
			<animated.div
				className={
					'navOrganize navbar navbar-expand' +
					(!page.element ? ' shadow-sm' : '')
				}
				style={{
					opacity: y.to({
						output: [0, 1],
						extend: 'clamp'
					}),
					visibility: y.to((y) =>
						y < 0.1 ? 'hidden' : 'visible'
					)
				}}
			>
				<div className="container-fluid">
					<div
						className="navbar-brand"
						onClick={() =>
							dispatch(organizeEnd())
						}
					>
						<CancelIcon />
					</div>
					<div className="mx-auto navTitle">
						Edit mode
					</div>
				</div>
			</animated.div>
			<div className="navbarSpacing"></div>
		</div>
	) : null;
}

export default Element;
