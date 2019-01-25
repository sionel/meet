/**
 * ParticipantItemPresenter
 * 참가자 컴포넌트 프레젠터
 */

import React, { Fragment } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const ParticipantItemPresenter = props => {
	const { selected, image, id, camera, mic, name } = props;
	// 선택 스타일
	const selectedStyle = () => (selected === id ? styles.selected : null);

	return (
		<View style={{ ...styles.wrapper }}>
			<TouchableOpacity style={{ ...styles.participantImage }} onPress={() => props.onSelectPerson(id)}>
				<Fragment>
					{camera ? (
						<Image style={{ ...styles.participantImage, ...selectedStyle() }} source={{ uri: img }} />
					) : (
						<Image
							style={{ width: 45, height: 45, marginLeft: 30, marginTop: 30, ...selectedStyle() }}
							source={buttonCameraOff}
						/>
					)}
					{!mic && (
						<Image
							style={{ width: 30, height: 30, position: 'absolute', bottom: 8, right: 8 }}
							source={buttonMicOff}
						/>
					)}
				</Fragment>
			</TouchableOpacity>
			<Text style={{ ...styles.participantName }}>{name}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		width: 105,
		height: 135,
		textAlign: 'center',
		marginLeft: 10
	},

	participantImage: {
		width: 105,
		height: 105,
		backgroundColor: '#7A7A7A'
	},

	participantName: {
		textAlign: 'center',
		color: '#fff',
		marginTop: 3
	},

	selected: {
		borderWidth: 5,
		borderColor: 'rgba(28,144,251, .75)'
	}
});

export default ParticipantItemPresenter;
