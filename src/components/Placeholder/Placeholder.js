/**
 * 
 */

import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import CustomLottie from '../CustomLottie';

// const waitingImage = require(`./waiting.gif`);
const waitingImage = require(`./imgEmptyMeet.png`);

const Placeholder = props => {
	return (
		<View
			style={{
				// flex: 1,
				position: 'absolute',
				width: '100%',
				height: '100%',
				paddingTop: '30%',
				backgroundColor: '#eaeaea',
				justifyContent: 'flex-start',
				alignItems: 'center',
				zIndex: 1,
				...props.layoutStyle
			}}
		>
			<Image
				style={{
					width: 180,
					height: 180,
					marginBottom: 23
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
