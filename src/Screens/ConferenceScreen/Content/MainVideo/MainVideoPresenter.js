import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { RTCView } from 'react-native-webrtc';
import ButtonCameraOff from '../../../../../assets/buttons/btn_vc_camera_off.png';
// import ProfileImage from '../../../../../assets/smapleImages/nnn.jpg';
import ProfileImage from '../../../../../assets/smapleImages/nnn2.png';
import { CustomLottie } from '../../../../components';

/**
 * MainVideoPresenter
 */
const MainVideoPresenter = props => {
	const { isMuteVideo, stream, videoType, mainUser, callType } = props;
	const displayTime = (
		<View
			style={{
				marginTop: 50,
				marginLeft: 25,
				position: 'absolute'
			}}
		>
			<Text
				style={{
					fontSize: 20,
					color: '#fff',
					textAlign: 'center',
					zIndex: 999
				}}
			>
				{second2String(props.time)}
			</Text>
		</View>
	);

	const muteView = (
		<View
			style={{
				position: 'absolute',
				flex: 1,
				width: '100%',
				height: '100%',
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: 'rgba(255,255,255, .67)',
				zIndex: 9
			}}
		>
			<Text
				style={{
					backgroundColor: 'black',
					width: '100%',
					padding: 10,
					color: '#fff',
					textAlign: 'center',
					fontWeight: '700',
					fontSize: 14
				}}
			>
				네트워크가 불안정해요 :(
			</Text>
		</View>
	);

	const userInfo = mainUser.userInfo;
	if (!isMuteVideo && stream && callType != 2) {
		return (
			<RTCView
				style={styles.videoContainer}
				mirror={false}
				objectFit={videoType && videoType === 'desktop' ? 'fit' : 'cover'}
				streamURL={stream.toURL()}
			>
				{displayTime}
				{mainUser.status === 'interrupted' && muteView}
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
								<View
									style={{
										position: 'absolute',
										top: -175,
										justifyContent: 'center'
									}}
								>
									{/* <Text style={{ fontSize: 25, color: '#c0c0c0', textAlign: 'center' }}>
										Neure님께 대화
									</Text>
									<Text style={{ fontSize: 25, color: '#c0c0c0', textAlign: 'center' }}>요청중입니다</Text> */}
									<Text
										style={{
											fontSize: 20,
											color: '#c0c0c0',
											textAlign: 'center'
										}}
									>
										통화중
									</Text>
									<Text
										style={{
											fontSize: 25,
											color: '#c0c0c0',
											textAlign: 'center'
										}}
									>
										{second2String(props.time)}
									</Text>
								</View>
								<Image style={styles.profileImage} source={ProfileImage} />
								<View
									style={{
										position: 'absolute',
										top: 180,
										alignItems: 'center'
									}}
								>
									<Text style={{ fontSize: 25, fontWeight: 'bold', color: '#fff' }}>
										{mainUser.name}
									</Text>
									<Text style={{ fontSize: 13, color: '#fff', paddingTop: 10 }}>
										{userInfo && userInfo.companyFullpath ? userInfo.companyFullpath : ''}
									</Text>
								</View>
							</CustomLottie>
						</View>
					</View>
				) : (
					<View style={styles.imageContainer}>
						{mainUser.status === 'interrupted' && muteView}
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

function second2String(second) {
	var hours = Math.floor(second / 3600);
	var minutes = Math.floor((second - hours * 3600) / 60);
	var seconds = second - hours * 3600 - minutes * 60;

	if (hours < 10) {
		hours = '0' + hours;
	}
	if (minutes < 10) {
		minutes = '0' + minutes;
	}
	if (seconds < 10) {
		seconds = '0' + seconds;
	}
	return hours + ':' + minutes + ':' + seconds;
}

export default MainVideoPresenter;
