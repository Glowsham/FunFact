import { useSelector, useDispatch } from 'react-redux';
import { addLearnerCard } from '../../stores/pageSlice';

import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import { useSpring, animated } from '@react-spring/web';
import MultiCard from '../MultiCard';
import Markdown from '../Markdown';
import 'swiper/swiper.min.css';
import '../../styles/Learner.css';

function Learner({ item, overlayScale, ...props }) {
	const page = useSelector((state) => state.page);
	const dispatch = useDispatch();
	const [style, api] = useSpring(() => ({
		x: 0
	}));
	const questionMatch = /^# (.+)/;

	return (
		<animated.div
			style={{
				...style,
				display: page.status === 3 ? 'none' : 'block'
			}}
		>
			<Swiper
				virtualTranslate={true}
				threshold={5}
				onSetTranslate={(swiper, translate) => {
					api.start(() => ({
						x: translate,
						immediate:
							swiper.touches.diff ===
								swiper.translate +
									swiper.width *
										swiper.activeIndex ||
							swiper.progress > 1 ||
							swiper.progress < 0
					}));
				}}
				onActiveIndexChange={(swiper) => {
					if (
						2 + swiper.activeIndex >=
						page.learner.length
					) {
						dispatch(addLearnerCard(1));
					}
				}}
				onResize={(swiper) => {
					style.x.set(swiper.translate);
				}}
			>
				{page.learner
					? page.learner.map((item, index) => (
							<SwiperSlide
								key={index}
							>
								<MultiCard
									content={{
										question: (
											<>
												<h2 className="fw-bold">
													{item.content.short.match(
														questionMatch
													)
														? item.content.short.match(
																questionMatch
														  )[1]
														: '(...)'}
												</h2>
												<h1 className="fw-bold display-4">
													{item.content.full.match(
														questionMatch
													)
														? item.content.full.match(
																questionMatch
														  )[1]
														: '(...)'}
												</h1>
											</>
										),
										short: (
											<Markdown
												content={
													item
														.content
														.short
												}
											/>
										),
										full: (
											<Markdown
												content={
													item
														.content
														.full
												}
											/>
										)
									}}
									order={[
										1,
										3,
										2
									]}
								/>
							</SwiperSlide>
					  ))
					: null}
			</Swiper>
		</animated.div>
	);
}

export default Learner;
