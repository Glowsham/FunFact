import { useSelector } from 'react-redux';
import { useState } from 'react';

import { useSpring, animated, config } from '@react-spring/web';
import '../styles/Loading.css';

function Loading() {
	const page = useSelector((state) => state.page);

	const { x } = useSpring({
		from: { x: 0 },
		x: page.status <= 1 ? 1 : 0,
		config: { ...config.gentle },
		immediate: page.status <= 1 ? true : false
	});
	var loadingType = page.status === 0 ? 'big' : 'small';

	const [invisible, setInvisible] = useState(true);
	const star = useSpring(
		invisible
			? { rotateZ: 0 }
			: {
					loop: true,
					from: { rotateZ: 0 },
					to: { rotateZ: 360 },
					config: { ...config.molasses }
			  }
	);

	return (
		<animated.div
			className={
				'loadingScreen ' +
				(page.status > 1
					? document
							.querySelector(
								'.loadingScreen'
							)
							.getAttribute('class')
							.replace(
								'loadingScreen ',
								''
							)
					: loadingType)
			}
			style={{
				opacity: x.to({
					output: [0, 1],
					extend: 'clamp'
				}),
				display: x.to((x) => {
					if (!invisible && x < 0.1) {
						setInvisible(true);
					} else if (invisible && x >= 0.1) {
						setInvisible(false);
					}
					return x < 0.1 ? 'none' : 'flex';
				})
			}}
		>
			<animated.div style={star}>
				<img src="/img/star.png" alt="" />
			</animated.div>
		</animated.div>
	);
}

export default Loading;
