import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import {
	organizeStart,
	organizeItem,
	createNewItem
} from '../stores/pageSlice';

import {
	DndContext,
	DragOverlay,
	closestCenter,
	KeyboardSensor,
	TouchSensor,
	MouseSensor,
	useSensor,
	useSensors
} from '@dnd-kit/core';
import {
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import FolderItem from './items/FolderItem';
import CardItem from './items/CardItem';
import '../styles/Items.css';

function Items() {
	const page = useSelector((state) => state.page);
	const dispatch = useDispatch();
	var [activeId, setActiveId] = useState(null);

	const bindLong = useLongPress(() => dispatch(organizeStart()));

	const sensors = useSensors(
		useSensor(MouseSensor, {
			activationConstraint: {
				delay: 250,
				tolerance: 5
			}
		}),
		useSensor(TouchSensor, {
			activationConstraint: {
				delay: 250,
				tolerance: 5
			}
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates
		})
	);
	const dragStartHandler = ({ active }) => {
		setActiveId(active.id);
	};
	const dragEndHandler = (page, dispatch) => {
		return ({ active, over }) => {
			if (active.id !== over.id) {
				dispatch(
					organizeItem(
						active.id,
						page.items.findIndex(
							(el) =>
								el.id ===
								over.id
						)
					)
				);
			}
			setActiveId(null);
		};
	};

	return page.status !== 3 ? (
		<div className={'itemsContainer p-4 ' + page.type}>
			<ItemsContainer
				page={page}
				dispatch={dispatch}
				{...bindLong}
			/>
		</div>
	) : (
		<div className={'itemsContainer p-4 ' + page.type}>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragStart={dragStartHandler}
				onDragEnd={dragEndHandler(page, dispatch)}
				modifiers={[restrictToVerticalAxis]}
			>
				<SortableContext
					items={page.items.map((el) => el.id)}
					strategy={verticalListSortingStrategy}
				>
					<ItemsContainer
						page={page}
						dispatch={dispatch}
					/>
				</SortableContext>
				<DragOverlay dropAnimation={{ duration: 0 }}>
					<Item
						type={page.type}
						item={
							activeId
								? page.items.find(
										(
											el
										) =>
											el.id ===
											activeId
								  )
								: page.items[0]
						}
						overlayScale={activeId}
						{...(page.type ===
						'notionDetails'
							? { isOverlay: true }
							: null)}
					/>
				</DragOverlay>
			</DndContext>
		</div>
	);
}

function ItemsContainer({ page, dispatch, ...props }) {
	return page.items && page.items.length !== 0 ? (
		page.items.map((item) => (
			<Item
				type={page.type}
				item={item}
				key={item.id}
				{...props}
			/>
		))
	) : page.status >= 2 ? (
		<div className="text-center mt-5">
			<img className="col-2 mb-4" src="/star.png" alt="" />
			<p className="h4">There's nothing there!</p>
			<div className="col-7 mx-auto">
				It looks like no items have been created here at
				the moment. Let's fix that!
			</div>
			<div
				className="mt-3 btn btn-dark"
				onClick={() => dispatch(createNewItem())}
			>
				Create!
			</div>
		</div>
	) : null;
}

function Item({ type, ...props }) {
	if (type === 'home' || type === 'subjDetails') {
		return <FolderItem {...props} />;
	} else if (type === 'notionDetails') {
		return <CardItem {...props} />;
	}
}

function useLongPress(callback) {
	var [timer, setTimer] = useState(null);
	const downHandler = () => {
		setTimer(setTimeout(callback, 700));
	};
	const upHandler = () => {
		clearTimeout(timer);
		setTimer(null);
	};

	return {
		onMouseDown: downHandler,
		onTouchStart: downHandler,
		onMouseUp: upHandler,
		onTouchEnd: upHandler
	};
}

export default Items;
