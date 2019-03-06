// import React from 'react';
// import { Icon } from 'react-native-vector-icons/FontAwesome';
// import { StyleSheet, View, Text } from 'react-native';
// import AppIntroSlider from 'react-native-app-intro-slider';

// const styles = StyleSheet.create({
// 	buttonCircle: {
// 		width: 40,
// 		height: 40,
// 		backgroundColor: 'rgba(0, 0, 0, .2)',
// 		borderRadius: 20,
// 		justifyContent: 'center',
// 		alignItems: 'center'
// 	},
// 	image: {
// 		width: 320,
// 		height: 320
// 	}
// });

// const rootPath = `../../assets`;
// const logo_login = require(`${rootPath}/logo_login.png`);
// const slides = [
// 	{
// 		key: 'somethun',
// 		title: 'Title 1',
// 		text: 'Description.\nSay something cool',
// 		image: logo_login,
// 		backgroundColor: '#59b2ab'
// 	},
// 	{
// 		key: 'somethun-dos',
// 		title: 'Title 2',
// 		text: 'Other cool stuff',
// 		image: logo_login,
// 		backgroundColor: '#febe29'
// 	},
// 	{
// 		key: 'somethun1',
// 		title: 'Rocket guy',
// 		text: "I'm already out of descriptions\n\nLorem ipsum bla bla bla",
// 		image: logo_login,
// 		backgroundColor: '#22bcb5'
// 	}
// ];

// class AppIntroSlide extends React.Component {
// 	_renderNextButton = () => {
// 		return (
// 			<View style={styles.buttonCircle}>
// 				<Icon
// 					name="md-arrow-round-forward"
// 					color="rgba(255, 255, 255, .9)"
// 					size={24}
// 					style={{ backgroundColor: 'transparent' }}
// 				/>
// 			</View>
// 		);
// 	};
// 	_renderDoneButton = () => {
// 		return (
// 			<View style={styles.buttonCircle}>
// 				<Icon
// 					name="md-checkmark"
// 					color="rgba(255, 255, 255, .9)"
// 					size={24}
// 					style={{ backgroundColor: 'transparent' }}
// 				/>
// 			</View>
// 		);
// 	};
// 	render() {
// 		return (
// 			<AppIntroSlider
// 				slides={slides}
// 				renderDoneButton={this._renderDoneButton}
// 				renderNextButton={this._renderNextButton}
// 			/>
// 			// <View>
// 			// 	<Text>asdkjasdl</Text>
// 			// </View>
// 		);
// 	}
// }

// export default AppIntroSlide;

import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
const rootPath = `../../assets`;
const logo_login = require(`${rootPath}/logo_login.png`);
const slides = [
	{
		key: 1,
		title: 'Title 1',
		text: 'Description.\nSay something cool',
		image: require(`${rootPath}/logo_login.png`),
		backgroundColor: '#1C90FB'
	},
	{
		key: 2,
		title: 'Title 2',
		text: 'Other cool stuff',
		image: require(`${rootPath}/icon.png`),
		backgroundColor: '#febe29'
	},
	{
		key: 3,
		title: 'Rocket guy',
		text: "I'm already out of descriptions",
		image: require(`${rootPath}/smapleImages/nnn.jpg`),
		backgroundColor: '#22bcb5'
	}
];

export default class AppIntroSlide extends React.Component {
	state = {
		showRealApp: false
	};
	_renderItem = (item, index) => {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center',
					padding: 50,
					// width: '100%',
					backgroundColor: item.backgroundColor
				}}
			>
				<Text style={{ color: '#fff', textAlign: 'center', width: '100%' }}>{item.title}</Text>
				{/* 
				이미지 원본크기로 지정해야 가로크기가 맞음..
				*/}
				<Image source={item.image} style={{ width: 275 }} />
				<View style={{ backgroundColor: '#f1f1f1', width: '100%' }}>
					<Text>asdasdlka</Text>
				</View>
				<Text style={{ color: '#fff', textAlign: 'center' }}>{JSON.stringify(item.text)}</Text>
			</View>
		);
	};
	_onDone = () => {
		// User finished the introduction. Show real app through
		// navigation or simply by controlling state
		this.setState({ showRealApp: true });
	};
	render() {
		if (this.state.showRealApp) {
			alert('Done !');
		}
		// if (this.state.showRealApp) {
		// 	return <App />;
		// } else {
		return (
			<View
				style={{
					flex: 1,
					width: '100%'
				}}
			>
				<AppIntroSlider renderItem={this._renderItem} slides={slides} onDone={this._onDone} />
			</View>
		);
		// }
	}
}
