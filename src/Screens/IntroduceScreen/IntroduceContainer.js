/**
 * 
 */

import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';

const rootPath = `../../../assets`;
const introImages = [
	require(`${rootPath}/introImages/intro01.png`),
	require(`${rootPath}/introImages/intro02.png`),
	require(`${rootPath}/introImages/intro03.png`),
	require(`${rootPath}/introImages/intro04.png`),
	require(`${rootPath}/introImages/intro05.png`)
];

const slides = [
	{
		key: 'somethun',
		title: 'Title 1',
		text: 'Description.\nSay something cool',
		image: require(`${rootPath}/introImages/intro01.png`),
		// image: require('https://images.unsplash.com/photo-1551729140-4b0ce561dfff?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80'),
		backgroundColor: '#59b2ab'
	},
	{
		key: 'somethun-dos',
		title: 'Title 2',
		text: 'Other cool stuff',
		image: require(`${rootPath}/introImages/intro01.png`),
		// image: require('https://images.unsplash.com/photo-1551729140-4b0ce561dfff?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80'),
		backgroundColor: '#febe29'
	},
	{
		key: 'somethun1',
		title: 'Rocket guy',
		text: "I'm already out of descriptions\n\nLorem ipsum bla bla bla",
		image: require(`${rootPath}/introImages/intro01.png`),
		// image: require('https://images.unsplash.com/photo-1551729140-4b0ce561dfff?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80'),
		backgroundColor: '#22bcb5'
	}
];

class IntroduceContainer extends Component {
	state = {
		showRealApp: false
	};
	_renderItem = item => {
		return (
			<View style={styles.slide}>
				<Text style={styles.title}>{item.title}</Text>
				<Image source={item.image} />
				<Text style={style.text}>{item.text}</Text>
			</View>
		);
	};
	_onDone = () => {
		// User finished the introduction. Show real app through
		// navigation or simply by controlling state
		this.setState({ showRealApp: true });
	};
	render() {
		// <AppIntroSlider renderItem={this._renderItem} slides={slides} onDone={this._onDone} />;
		<View>
			<Text>asd</Text>
		</View>;
	}
}

export default IntroduceContainer;
