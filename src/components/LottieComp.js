/**
 * LottieItem
 * Lottie 애니메이션 컴포넌트
 */

import React from 'react';
import { View, Text } from 'react-native';
// import { LottieView } from 'lottie-react-native';

class LottieItem extends Component {
	/**
   * STATE
   */
	state = {};

	/**
   * componentDidMount
   */
	componentDidMount() {
		// this.animation.play();
	}

	/**
   * Render
   */
	render() {
		const { source, width, height, customStyle } = this.props;

		return (
			<View>
				<Text>asd</Text>
				{/* <LottieView
					style={{
						width,
						height,
						customStyle
					}}
					source={require(`./lotties/${source}`)}
					ref={animation => {
						this.animation = animation;
					}}
				/> */}
			</View>
		);
	}
}

/**
 * styles
 */
const styles = StyleSheet.create({});

/**
 * Default props
 */
LottieItem.defaultProps = {
	source: '',
	width: 45,
	height: 45,
	customStyle: {}
};

export default LottieItem;
