/**
 * CustomLottie
 * Lottie 애니메이션 컴포넌트
 */

import React, { Component } from 'react';
import LottieView from 'lottie-react-native';
import { View, Text, StyleSheet, AppState } from 'react-native';

class CustomLottie extends Component {
	/**
	 * State
	 */
	state = {
		appState: AppState.currentState
	};

	/**
	 * resource
	 */
	files = {
		waiting: require('./lotties/waiting.json'),
		broadcast: require('./lotties/broadcast.json'),
		voiceBroadcast: require('./lotties/voice_broadcast.json'),
		cc: require('./lotties/animation-w400-h300.json'),
		bear: require('./lotties/bear.json'),
		notFound: require('./lotties/not_found.json'),
		vr: require('./lotties/custom_vr.json')
	};

	/**
	 * componentDidMount
	 */
	componentDidMount() {
		this.animation.play();
		AppState.addEventListener('change', this._handleAppStateChange);
	}

	/**
	 * componentWillUnmount
	 */
	componentWillUnmount() {
		AppState.removeEventListener('change', this._handleAppStateChange);
	}

	/**
	 * Render
	 */
	render() {
		const { source, width, height, customStyle, phrases, children } = this.props;
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
					ref={animation => {
						this.animation = animation;
					}}
				/>
				{phrases !== '' && <Text style={{ marginTop: -72, color: '#1C90FB' }}>Loading</Text>}
				{children && (
					<View
						style={{
							position: 'absolute',
							justifyContent: 'center',
							alignItems: 'center',
							textAlign: 'center',
							padding: 0,
							margin: 0
						}}
					>
						{children}
					</View>
				)}
			</View>
		);
	}

	/**
	 * _handleAppStateChange
	 */
	_handleAppStateChange = nextAppState => {
		if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
			// 포그라운드 전환시 아래 로직 실행
			this.animation.play();
		}
		this.setState({ appState: nextAppState });
	};
}

/**
 * styles
 */
const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#FFF',
		width: '100%',
		height: '100%'
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
