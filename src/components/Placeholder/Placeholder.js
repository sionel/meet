/**
 * 
 */

import React, { Component } from 'react';
import { View, Text, Image, Platform } from 'react-native';
import CustomLottie from '../CustomLottie';

// const waitingImage = require(`./waiting.gif`);
const waitingImage = require(`./imgEmptyMeet.png`);

const Placeholder = props => {
	return (
		<View
			style={{
				flex: 1,
				// position: 'absolute',
				width: '100%',
				// height: '100%',
				// paddingTop: '30%',
				backgroundColor: '#eaeaea',
				justifyContent: 'center',
				alignItems: 'center',
				zIndex: 1,
				...props.layoutStyle
			}}
		>
			<Image
				style={{
					// width: '40%',
					height: 180,
					maxHeight: '40%',
					marginBottom: 23,
					resizeMode: 'contain'
				}}
				source={waitingImage}
			/>
			{/* <CustomLottie source="vr" width={105} height={345} /> */}
			{props.mainText !== '' && (
				<Text
					style={{
						fontSize: 20,
						fontWeight: '500',
						color: '#1C90FB',
						marginTop: -5,
						fontFamily: Platform.OS === 'ios' ? 'Arial' : 'normal',
						...props.mainTextStyle
					}}
				>
					{props.mainText}
				</Text>
			)}

			<Text
				style={{
					fontSize: 18,
					fontWeight: '500',
					color: 'rgb(80,80,80)',
					textAlign: 'center',
					fontFamily: Platform.OS === 'ios' ? 'Arial' : 'normal',
					...props.subTextStyle
				}}
			>
				{props.subText}
			</Text>
			{props.other}
		</View>
	);
};

Placeholder.defaultProps = {
	mainText: '',
	subText: 'No Contents',
	layoutStyle: {},
	mainTextStyle: {},
	subTextStyle: {}
};

export default Placeholder;
