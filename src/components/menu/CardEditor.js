import { useDispatch } from 'react-redux';
import { editItem, moveItem, deleteItem } from '../../stores/pageSlice';
import { useState, useRef, useEffect } from 'react';

import { useSpring, animated } from '@react-spring/web';
import MultiCard from '../MultiCard';
import FlipFrontIcon from '@material-ui/icons/FlipToFrontOutlined';
import FlipBackIcon from '@material-ui/icons/FlipToBackOutlined';
import SwapIcon from '@material-ui/icons/SwapHorizOutlined';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import '../../styles/CardEditor.css';

function CardEditor({ item }) {
	const dispatch = useDispatch();

	const [current, setCurrent] = useState(false);
	const swipeButton = useRef(null);
	const style = useSpring({
		x: current ? 1 : 0,
		width: swipeButton.current
			? swipeButton.current.querySelector(
					current ? '.short' : '.full'
			  ).clientWidth + 'px'
			: '0px'
	});
	useEffect(() => {
		if (style.width.get() === '0px') {
			style.width.set(
				swipeButton.current.querySelector(
					current ? '.short' : '.full'
				).clientWidth + 'px'
			);
		}
	}, [style.width, current]);

	const shortRef = useRef(null);
	const fullRef = useRef(null);
	const editHandler = () => {
		dispatch(
			editItem({
				short: shortRef.current.textContent.trim(),
				full: fullRef.current.textContent.trim()
			})
		);
	};

	return (
		<>
			<MultiCard
				content={{
					short: (
						<p
							contentEditable="plaintext-only"
							onInput={editHandler}
							suppressContentEditableWarning={
								true
							}
							ref={shortRef}
						>
							{item.content.short}
						</p>
					),
					full: (
						<p
							contentEditable="plaintext-only"
							onInput={editHandler}
							suppressContentEditableWarning={
								true
							}
							ref={fullRef}
						>
							{item.content.full}
						</p>
					)
				}}
				order={[3, 2]}
				currentMaster={current ? 2 : 3}
				clickHandler={() => {}}
				colorMaster={item.color}
			/>
			<div className="cardButtons mt-2 d-flex flex-row">
				<div
					className="editButton p-2"
					onClick={() => {
						setCurrent(!current);
					}}
				>
					<animated.div
						style={{
							width: style.width
						}}
						ref={swipeButton}
					>
						<animated.div
							className="full"
							style={{
								opacity: style.x.to(
									{
										output: [
											1,
											0
										],
										extend:
											'clamp'
									}
								)
							}}
						>
							<FlipFrontIcon />
							<small className="ms-3 me-1">
								Full side
							</small>
						</animated.div>
						<animated.div
							className="short"
							style={{
								opacity: style.x.to(
									{
										output: [
											0,
											1
										],
										extend:
											'clamp'
									}
								)
							}}
						>
							<FlipBackIcon />
							<small className="ms-3 me-1">
								Short side
							</small>
						</animated.div>
					</animated.div>
				</div>
				<div className="ms-auto d-flex flex-row">
					<div
						className="editButton p-2"
						onClick={() =>
							dispatch(moveItem())
						}
					>
						<SwapIcon />
					</div>
					<div
						className="editButton p-2"
						onClick={() =>
							dispatch(deleteItem())
						}
					>
						<DeleteIcon />
					</div>
				</div>
			</div>
		</>
	);
}

export default CardEditor;
