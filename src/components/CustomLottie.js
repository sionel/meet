/**
 * CustomLottie
 * Lottie 애니메이션 컴포넌트
 */

import React, { Component } from 'react';
import LottieView from 'lottie-react-native';
import { View, Text, StyleSheet } from 'react-native';

class CustomLottie extends Component {
	files = {
		waiting: require('./lotties/waiting.json'),
		broadcast: require('./lotties/broadcast.json'),
		cc: require('./lotties/animation-w400-h300.json')
	};

	componentDidMount() {
		this.animation.play();
	}

	render() {
		const { source, width, height, customStyle, phrases } = this.props;
		const files = this.files;

		return (
			<View style={styles.container}>
				<LottieView
					style={{
						width,
						height,
						...customStyle
					}}
					source={files[source]}
					// source={require('./lotties/broadcast.json')}
					ref={animation => {
						this.animation = animation;
					}}
				/>
				{phrases !== '' && <Text style={{ marginTop: -72, color: '#1C90FB' }}>Loading</Text>}
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
		// backgroundColor: '#1C90FB'
	}
});

/**
 * Default props
 */
CustomLottie.defaultProps = {
	source: 'broadcast',
	width: 45,
	height: 45,
	customStyle: {},
	phrases: ''
};

export default CustomLottie;
