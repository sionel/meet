/**
 * ConferenceScreenPresenter
 * 화상대화 진입화면 프레젠터
 */

import React, { Fragment } from 'react';
import { View, ScrollView, Text, StyleSheet, Image, ImageBackground, TouchableHighlight } from 'react-native';

import Participant from './Participant';

const buttonPath = `../../../assets/buttons`;
// 하단버튼s
const buttonMic = require(`${buttonPath}/btn_vc_mike_on.png`);
const buttonCamera = require(`${buttonPath}/btn_vc_camera_on.png`);
const buttonSpeaker = require(`${buttonPath}/btn_vc_speaker_on.png`);
const buttonEndCall = require(`${buttonPath}/btn_vc_endcall_none.png`);
const buttonMic_press = require(`${buttonPath}/btn_vc_mike_off.png`);
const buttonCamera_press = require(`${buttonPath}/btn_vc_camera_off.png`);
const buttonSpeaker_press = require(`${buttonPath}/btn_vc_speaker_off.png`);
// 상단버튼s
const buttonTalk = require(`${buttonPath}/btn_tnavi_talk_none.png`);
const buttonSetting = require(`${buttonPath}/btn_tnavi_setting_none.png`);
const buttonDocshare = require(`${buttonPath}/btn_tnavi_docshare_none.png`);
const buttonSwscreen = require(`${buttonPath}/btn_tnavi_swscreen_none.png`);
// 표시버튼s
const buttonCameraOff = require(`${buttonPath}/ico_camera_bl_off.png`);
const buttonMicOff = require(`${buttonPath}/ico_vc_mike_small_off.png`);

/**
 * ConferenceScreenPresenter
 */
const ConferenceScreenPresenter = props => {
	// 선택된 사람
	const selectedPerson = props.participant.filter(p => p.id === props.selected)[0];
	// 선택 스타일
	const selectedStyle = id => (props.selected === id ? styles.selected : null);
	// 상단버튼그룹
	const topControl = [buttonTalk, buttonDocshare, buttonSwscreen, buttonSetting];
	// 하단버튼그룹
	const bottomControl = [
		{
			name: 'sound',
			button: props.conferenceStatus.sound ? buttonSpeaker : buttonSpeaker_press
		},
		{
			name: 'camera',
			button: props.conferenceStatus.camera ? buttonCamera : buttonCamera_press
		},
		{
			name: 'mic',
			button: props.conferenceStatus.mic ? buttonMic : buttonMic_press
		}
	];

	// #region
	/**
   * Return
   */
	return (
		<View style={{ ...styles.container }}>
			<ImageBackground
				style={{
					...styles.fullSizeLayout,
					backgroundSize: '10%',
					backgroundColor: '#7A7A7A'
				}}
				source={
					selectedPerson.conferenceStatus.camera ? { uri: selectedPerson.img, width: 100 } : buttonCameraOff
				}
			>
				{/* 상단영역 */}
				<View
					style={{
						...styles.topArea,
						...styles.commonStyle,
						justifyContent: 'flex-end',
						alignItems: 'flex-end'
					}}
				>
					{/* 경과시간 */}
					<View style={{ flex: 0.5 }}>
						<Text style={{ color: '#fff', fontSize: 16.5, padding: 5 }}>00:21:45</Text>
					</View>
					{/* 버튼그룹 */}
					{topControl.map((btn, btnKey) => (
						<View style={{ flex: 0.125 }} key={btnKey}>
							<Image style={{ width: 30, height: 30 }} source={btn} />
						</View>
					))}
				</View>

				{/* 중앙영역 */}
				<View style={{ ...styles.middleArea, ...styles.commonStyle }}>
					<TouchableHighlight style={styles.fullSizeLayout} onPress={() => props.onScreenTouch()}>
						<View />
					</TouchableHighlight>
				</View>

				{/* 하단 참여자 목록 */}
				<View style={{ ...styles.bottomArea, ...styles.commonStyle }}>
					{/* 하단 참여자 목록 */}
					{/* <Participant data={props.participant} /> */}
					<ScrollView horizontal={true}>
						{props.participant.map((person, personKey) => (
							<View
								style={{
									...styles.participant,
									marginRight: personKey === props.participant.length - 1 ? 10 : 0
								}}
								key={person.id}
							>
								<TouchableHighlight
									style={{ ...styles.participantImage }}
									onPress={() => props.onSelectPerson(person.id)}
								>
									<Fragment>
										{person.conferenceStatus.camera ? (
											<Image
												style={{ ...styles.participantImage, ...selectedStyle(person.id) }}
												source={{ uri: person.img }}
											/>
										) : (
											<Image
												style={{
													width: 45,
													height: 45,
													marginLeft: 30,
													marginTop: 30,
													...selectedStyle(person.id)
												}}
												source={buttonCameraOff}
											/>
										)}
										{!person.conferenceStatus.mic && (
											<Image
												style={{
													width: 30,
													height: 30,
													position: 'absolute',
													bottom: 8,
													right: 8
												}}
												source={buttonMicOff}
											/>
										)}
									</Fragment>
								</TouchableHighlight>
								<Text style={{ ...styles.participantName }}>{person.name}</Text>
							</View>
						))}
					</ScrollView>
				</View>

				{/* 하단 버튼그룹 */}
				{props.activeTouch && (
					<TouchableHighlight style={styles.fullSizeLayout} onPress={() => props.onScreenTouch()}>
						<View style={{ ...styles.buttonsArea }}>
							{bottomControl.map(btn => (
								<View style={{ ...styles.button }} key={btn.name}>
									<TouchableHighlight onPress={() => props.onToggleStatus(btn.name)}>
										<Image source={btn.button} style={{ ...styles.buttonImg }} />
									</TouchableHighlight>
								</View>
							))}
							<View style={{ ...styles.button }}>
								<TouchableHighlight onPress={() => props.onRedirect('Home')}>
									<Image source={buttonEndCall} style={{ ...styles.buttonImg }} />
								</TouchableHighlight>
							</View>
						</View>
					</TouchableHighlight>
				)}
			</ImageBackground>
		</View>
	);
	// #endregion
};

/**
 * styles
 */
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
		justifyContent: 'center',
		alignItems: 'center'
	},

	fullSizeLayout: {
		width: '100%',
		height: '100%'
	},

	// 공통 스타일
	commonStyle: {
		justifyContent: 'center',
		alignItems: 'center',
		color: '#fff',
		backgroundColor: 'rgba(0,0,0, .25)'
	},

	// 상단바 ( 시간, 상태, 버튼 )
	topArea: {
		flex: 0.1,
		flexDirection: 'row',
		paddingLeft: 12,
		zIndex: 99
	},
	// 중앙 ( 시간, 상태, 버튼 )
	middleArea: {
		flex: 0.7
	},
	// 하단 ( 시간, 상태, 버튼 )
	bottomArea: {
		flex: 0.2,
		flexDirection: 'row',
		padding: '0 3%'
	},
	// 참가자 항목
	participant: {
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
	selector: 0,
	selected: {
		borderWidth: 5,
		borderColor: 'rgba(28,144,251, .75)'
	},

	// 하단 컨트롤버튼 wraper
	buttonsArea: {
		width: '100%',
		height: '100%',
		position: 'absolute',
		paddingBottom: '5.5%',
		bottom: 0,
		justifyContent: 'center',
		alignItems: 'flex-end',
		backgroundColor: 'rgba(0,0,0, .45)',
		flexDirection: 'row',
		zIndex: 98
	},
	// 버튼
	button: {
		flex: 0.2,
		justifyContent: 'center',
		alignItems: 'center'
	},
	// 버튼
	buttonImg: {
		width: 55,
		height: 55
	}
});

export default ConferenceScreenPresenter;
