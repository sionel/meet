/**
 * DrawingPresenter
 */

import React from 'react';
import { AppRegistry, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
// import RNSketchCanvas from '@terrylinla/react-native-sketch-canvas';
import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas';

const DrawingPresenter = props => {
	const { strokes, colors } = props;
	return (
		<View style={styles.container}>
			<View
				style={{
					flex: 1.2,
					backgroundColor: '#333',
					flexDirection: 'row',
					width: '100%',
					justifyContent: 'center',
					alignItems: 'flex-end'
				}}
			>
				{strokes.map(stroke => (
					<TouchableOpacity
						key={String(stroke)}
						onPress={() => props._handleChangeState('selectedStroke', stroke)}
					>
						<View
							style={{
								width: 30,
								height: 30,
								backgroundColor: '#f1f1f1',
								borderWidth: 3,
								borderColor: '#fff',
								borderRadius: 25,
								marginBottom: 7.5,
								marginLeft: 7.5,
								marginRight: 7.5,
								opacity: selectedStroke === stroke ? 0.35 : 1,
								justifyContent: 'center',
								alignItems: 'center'
							}}
						>
							<Text>{stroke}</Text>
						</View>
					</TouchableOpacity>
				))}
			</View>
			{/*  */}
			<View style={{ flex: 9, flexDirection: 'row' }}>
				{/* <SketchCanvas
					style={{
						flex: 1
					}}
					strokeWidth={selectedStroke}
					strokeColor={selectedColor}
					onStrokeEnd={rs => props._handleStrokeEnd(rs)}
				/> */}
			</View>
			{/*  */}
			<View
				style={{
					flex: 1,
					backgroundColor: '#333',
					flexDirection: 'row',
					width: '100%',
					justifyContent: 'center',
					alignItems: 'flex-start'
				}}
			>
				{colors.map(color => (
					<TouchableOpacity key={color} onPress={() => props._handleChangeState('selectedColor', color)}>
						<View
							style={{
								width: 45,
								height: 45,
								backgroundColor: color,
								borderWidth: 3,
								borderColor: '#fff',
								borderRadius: 25,
								marginTop: 7.5,
								marginLeft: 7.5,
								marginRight: 7.5,
								opacity: selectedColor === color ? 0.35 : 1
							}}
						/>
					</TouchableOpacity>
				))}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF'
	}
});

export default DrawingPresenter;
