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
		cc: require('./lotties/animation-w400-h300.json')
	};

	/**
	 * 
	 */
	componentDidMount() {
		this.animation.play();
		AppState.addEventListener('change', this._handleAppStateChange);
	}

	/**
	 * 
	 */
	componentWillUnmount() {
		AppState.removeEventListener('change', this._handleAppStateChange);
	}

	/**
	 * Render
	 */
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

	/**
	 * 
	 */
	_handleAppStateChange = nextAppState => {
		if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
			console.log('App has come to the foreground!');
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
