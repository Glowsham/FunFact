import { useState, useRef, useEffect } from 'react';

import { useSpring, animated } from '@react-spring/web';
import '../styles/MultiCard.css';

function MultiCard({
	content,
	order,
	currentMaster,
	clickHandler,
	style,
	colorMaster,
	cardRef,
	...props
}) {
	const [current, setCurrent] = useState(currentMaster || order[0]);
	const contentRef = useRef(null);
	const color = useRef(
		['#ff99c8', '#fcf6bd', '#d0f4de', '#a9def9', '#e4c1f9'][
			Math.floor(Math.random() * 5)
		]
	);

	const {
		iQuestion,
		iShort,
		iFull,
		animation,
		height,
		...elStyle
	} = useSpring({
		iQuestion: current === 1 ? 1 : 0,
		iShort: current === 2 ? 1 : 0,
		iFull: current === 3 ? 1 : 0,
		animation: current,
		height: contentRef.current
			? contentRef.current.querySelector(
					current === 2
						? '.short'
						: current === 3
						? '.full'
						: '.question'
			  ).clientHeight + 'px'
			: '0px',
		backgroundColor: colorMaster || color.current,
		...style
	});
	useEffect(() => {
		if (currentMaster) setCurrent(currentMaster);
	}, [currentMaster]);

	const flipCard = () => {
		if (clickHandler) clickHandler();
		else {
			setCurrent(
				order.length === order.indexOf(current) + 1
					? order[0]
					: order[order.indexOf(current) + 1]
			);
		}
	};
	const changeHeight = () => {
		height.start(
			contentRef.current.querySelector(
				current === 2 ? '.short' : '.full'
			).clientHeight + 'px'
		);
	};

	return (
		<animated.div
			className="multiCard card shadow-sm"
			style={elStyle}
			ref={cardRef}
			onClick={flipCard}
			onKeyUp={changeHeight}
			{...props}
		>
			<animated.div
				className="contentWrapper"
				style={{
					overflow: animation.to((x) =>
						Math.floor(x) === x
							? 'visible'
							: 'hidden'
					)
				}}
			>
				<animated.div
					className="cardContent"
					style={{
						height: animation.to((x) =>
							Math.floor(x) === x
								? 'auto'
								: height.get()
						)
					}}
					ref={contentRef}
				>
					{content.question ? (
						<ContentSide
							name="question"
							content={
								content.question
							}
							spring={iQuestion}
						/>
					) : null}
					<ContentSide
						name="short"
						content={content.short}
						spring={iShort}
					/>
					<ContentSide
						name="full"
						content={content.full}
						spring={iFull}
					/>
				</animated.div>
			</animated.div>
		</animated.div>
	);
}

function ContentSide({ name, content, spring }) {
	const [status, setStatus] = useState(null);

	return (
		<animated.div
			className={[name, status].join(' ')}
			style={{
				opacity: spring,
				animation: spring.to((x) => {
					if (x > 0.9 && status !== 'visible')
						setStatus('visible');
					else if (
						0.1 < x &&
						x < 0.9 &&
						status !== 'animating'
					)
						setStatus('animating');
					else if (x < 0.1 && status !== 'hidden')
						setStatus('hidden');
				})
			}}
			children={content}
		/>
	);
}

export default MultiCard;
