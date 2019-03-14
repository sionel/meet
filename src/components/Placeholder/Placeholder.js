/**
 * 
 */

import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';

const waitingImage = require(`./waiting.gif`);

const Placeholder = props => {
	return (
		<View
			style={{
				flex: 1.5,
				width: '100%',
				// backgroundColor: 'red',
				justifyContent: 'center',
				alignItems: 'center',
				...props.layoutStyle
			}}
		>
			<Image
				style={{
					width: '90%',
					height: '80%',
					maxWidth: 300,
					maxHeight: 255
				}}
				source={waitingImage}
			/>
			<Text
				style={{
					fontSize: 20,
					fontWeight: '500',
					color: '#1C90FB',
					marginTop: -35,
					...props.mainTextStyle
				}}
			>
				{props.mainText}
			</Text>
			<Text
				style={{
					fontSize: 17,
					fontWeight: '500',
					color: '#b1b1b1',
					...props.subTextStyle
				}}
			>
				{props.subText}
			</Text>
		</View>
	);
};

Placeholder.defaultProps = {
	mainText: '데이터가 없습니다 :(',
	subText: 'No Contents',
	layoutStyle: {},
	mainTextStyle: {},
	subTextStyle: {}
};

export default Placeholder;
