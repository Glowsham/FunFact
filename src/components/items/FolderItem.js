import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useSortable } from '@dnd-kit/sortable';
import { pageAppend, menuOpen } from '../../stores/pageSlice';

import { useSpring, animated } from '@react-spring/web';

function FolderItem({ item, overlayScale, ...props }) {
	const page = useSelector((state) => state.page);
	const dispatch = useDispatch();
	const history = useHistory();

	const {
		transform,
		active,
		setNodeRef,
		attributes,
		listeners
	} = useSortable({
		id: item.id
	});
	const style = useSpring({
		y: transform ? transform.y : 0,
		scale:
			overlayScale || (active && active.id === item.id)
				? 1.1
				: 1,
		visibility:
			active && active.id === item.id ? 'hidden' : 'visible',
		immediate: (n) => !active && n === 'y'
	});
	const organizeProps = {
		style: style,
		ref: setNodeRef,
		...attributes,
		...listeners
	};

	return (
		<animated.div
			className="card shadow-sm"
			onClick={() =>
				dispatch(
					page.status !== 3
						? pageAppend(item, history)
						: menuOpen(item)
				)
			}
			{...(page.status === 3 && !page.selected
				? organizeProps
				: null)}
			{...props}
		>
			<div className="card-body d-flex flex-row">
				<Text
					big={page.type === 'home'}
					className="position-absolute"
					content={[...item.title][0]}
				/>
				<Text
					big={page.type === 'home'}
					className="ms-3 ms-md-4 ps-5 fw-bold"
					content={[...item.title]
						.slice(2)
						.join('')}
				/>
			</div>
		</animated.div>
	);
}

function Text({ big, content, ...props }) {
	return big ? (
		<h1 {...props}>{content}</h1>
	) : (
		<h2 {...props}>{content}</h2>
	);
}

export default FolderItem;
