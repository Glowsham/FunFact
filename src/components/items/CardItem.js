import { useSelector, useDispatch } from 'react-redux';
import { cardToggle, menuOpen } from '../../stores/pageSlice';

import { useSortable } from '@dnd-kit/sortable';
import Markdown from '../Markdown';
import MultiCard from '../MultiCard';

function CardItem({ item, overlayScale, isOverlay, ...props }) {
	const page = useSelector((state) => state.page);
	const dispatch = useDispatch();

	const {
		transform,
		active,
		setNodeRef,
		attributes,
		listeners
	} = useSortable({
		id: item.id
	});
	const style = {
		scale:
			overlayScale || (active && active.id === item.id)
				? 1.1
				: 1,
		opacity: active && active.id === item.id ? 0 : 1,
		y: transform ? transform.y : 0,
		immediate: (n) =>
			n === 'opacity' ||
			(n === 'y' && !active) ||
			(n !== 'scale' && isOverlay)
	};

	return (
		<MultiCard
			content={{
				short: (
					<Markdown
						content={item.content.short}
					/>
				),
				full: <Markdown content={item.content.full} />
			}}
			order={[3, 2]}
			currentMaster={item.full ? 2 : 3}
			clickHandler={() => {
				dispatch(
					page.status !== 3
						? cardToggle(item)
						: menuOpen(item)
				);
			}}
			colorMaster={!item.full ? item.color : '#ffffff'}
			{...(page.status === 3
				? {
						style,
						cardRef: setNodeRef,
						...attributes,
						...listeners
				  }
				: null)}
			{...props}
		/>
	);
}

export default CardItem;
