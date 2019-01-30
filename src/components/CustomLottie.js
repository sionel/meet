/**
 * CustomLottie
 * Lottie 애니메이션 컴포넌트
 */

import React, { Component } from 'react';
import LottieView from 'lottie-react-native';
import { View, StyleSheet } from 'react-native';

class CustomLottie extends Component {
	componentDidMount() {
		this.animation.play();
	}

	render() {
		const { source, width, height, customStyle } = this.props;

		return (
			<View style={styles.container}>
				<LottieView
					style={{
						width,
						height,
						...customStyle
					}}
					source={require('./lotties/broadcast.json')}
					ref={animation => {
						this.animation = animation;
					}}
				/>
			</View>
		);
	}
}

/**
 * styles
 */
const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
		// backgroundColor: '#E3F2FD'
	}
});

/**
 * Default props
 */
CustomLottie.defaultProps = {
	source: 'broadcast',
	width: 45,
	height: 45,
	customStyle: {}
};

export default CustomLottie;
