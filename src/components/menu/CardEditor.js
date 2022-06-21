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
	const style = useSpring({
		x: current ? 1 : 0
	});

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
						<animated.div
							className="full editButton p-2"
							onClick={() => setCurrent(!current)}
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
								),
								position: !current ? 'relative' : 'absolute'
							}}
						>
							<FlipFrontIcon />
							<small className="ms-3 me-1">
								Front side
							</small>
						</animated.div>
						<animated.div
							className="short editButton p-2"
							onClick={() => setCurrent(!current)}
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
								),
								position: current ? 'relative' : 'absolute'
							}}
						>
							<FlipBackIcon />
							<small className="ms-3 me-1">
								Back side
							</small>
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
		</>
	);
}

export default CardEditor;
