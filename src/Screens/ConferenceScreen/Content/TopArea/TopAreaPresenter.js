import React, { Fragment } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import SettingButton from './SettingButton';
import { ConferenceModes } from '../../../../utils/ConstantsBackup';

/**
 * TopAreaPresenter
 */
const TopAreaPresenter = props => {
	if (props.conferenceMode === ConferenceModes.NORMAL) {
		return (
			<TouchableOpacity
				activeOpacity={1}
				style={props.orientation === 'vertical' ? styles.containerVertical : styles.containerHorizontal}
			>
				{/* 경과시간 */}
				<View
					style={props.orientation === 'vertical' ? styles.settingBoxVertical : styles.settingBoxHorizontal}
				>
					{props.isMuteVideo ? null : (
						<Fragment>
							<SettingButton
								name="pen"
								width={25}
								height={25}
								areaWdith={25}
								areaHeight={28}
								onPress={() => props.onChangeState('drawingMode', !props.drawingMode)}
							/>
							<SettingButton name="switch" onPress={props.toggleCameraFacingMode} />
							<SettingButton
								name="reverse"
								onPress={props.onReverseVideo}
								width={25}
								height={25}
								areaWdith={28}
								areaHeight={28}
							/>
						</Fragment>
					)}
				</View>
				{/* isVideoReverse */}
			</TouchableOpacity>
		);
	} else {
		return <View style={styles.container} />;
	}
};

/**
 * styles
 */
const styles = StyleSheet.create({
	containerVertical: {
		flex: 1,
		flexDirection: 'row',
		marginVertical: 40,
		marginHorizontal: 10,
		alignItems: 'flex-start'
	},
	containerHorizontal: {
		flex: 1,
		flexDirection: 'column',
		marginVertical: 10,
		marginHorizontal: 20
	},
	timeBoxVertical: {
		flex: 2,
		justifyContent: 'flex-end',
		alignItems: 'flex-start'
	},
	timeBoxHorizontal: {
		flex: 2,
		justifyContent: 'flex-start',
		alignItems: 'flex-start'
	},
	settingBoxVertical: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'flex-end'
	},
	settingBoxHorizontal: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-end',
		alignItems: 'flex-start',
		marginVertical: 10
	}
});

export default TopAreaPresenter;
