import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { RTCView } from 'react-native-webrtc';
import ButtonCameraOff from '../../../../../assets/buttons/btn_vc_camera_off.png';
import ProfileImage from '../../../../../assets/smapleImages/nnn.jpg';
import { CustomLottie } from '../../../../components';

/**
 * MainVideoPresenter
 */
const MainVideoPresenter = props => {
	const { isMuteVideo, stream, videoType, callType, mainUser } = props;
	if (!isMuteVideo && stream && callType != 2) {
		return (
			<RTCView
				style={styles.videoContainer}
				mirror={false}
				objectFit={videoType && videoType === 'desktop' ? 'fit' : 'cover'}
				streamURL={stream.toURL()}
			>
				{props.children}
			</RTCView>
		);
	} else {
		return (
			<View style={styles.muteContainer}>
				{callType == 2 ? (
					<View style={{ ...styles.imageContainer, backgroundColor: '#303030' }}>
						<View>
							<CustomLottie source="voiceBroadcast" width={320} height={320}>
								<View style={{ position: 'absolute', top: -175, justifyContent: 'center' }}>
									{/* <Text style={{ fontSize: 25, color: '#c0c0c0', textAlign: 'center' }}>
										Neure님께 대화
									</Text>
									<Text style={{ fontSize: 25, color: '#c0c0c0', textAlign: 'center' }}>요청중입니다</Text> */}
									<Text style={{ fontSize: 20, color: '#c0c0c0', textAlign: 'center' }}>통화중</Text>
									{/* <Text style={{ fontSize: 25, color: '#c0c0c0', textAlign: 'center' }}>05:42</Text> */}
								</View>
								<Image style={styles.profileImage} source={ProfileImage} />
								<View style={{ position: 'absolute', top: 180, alignItems: 'center' }}>
									<Text style={{ fontSize: 23, fontWeight: 'bold', color: '#fff' }}>
										Manuel Neure
									</Text>
									<Text style={{ fontSize: 15, color: '#fff' }}>
										{mainUser.userInfo && mainUser.userInfo.companyFullpath
											? mainUser.userInfo.companyFullpath
											: ''}
									</Text>
								</View>
							</CustomLottie>
						</View>
					</View>
				) : (
					<View style={styles.imageContainer}>
						<Image source={ButtonCameraOff} />
					</View>
				)}
				{props.children}
			</View>
		);
	}
};

/**
 * styles
 */
const styles = StyleSheet.create({
	videoContainer: {
		flex: 1,
		backgroundColor: 'gray'
	},
	muteContainer: {
		flex: 1,
		backgroundColor: '#7D7D7D'
		// backgroundColor: 'gray'
	},
	imageContainer: {
		position: 'absolute',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: '100%'
	},
	profileImage: {
		marginTop: -7,
		marginLeft: 7.5,
		padding: 0,
		width: 172,
		height: 172,
		borderRadius: 85,
		borderWidth: 10,
		borderColor: '#1C90FB'
	}
});

export default MainVideoPresenter;
