/**
 * Palette Presenter
 */

import React, { Fragment } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const PalettePresenter = props => {
	const { selectedTab, stroke, color, eraser, palette, tabs } = props;

	return (
		<Fragment>
			<View style={{ ...styles.tabWrapper, height: palette ? 150 : 58 }}>
				{palette && (
					<Fragment>
						<View style={styles.mainSettingWrapper}>
							{tabs.map((tab, tabIndex) => (
								<TouchableOpacity
									key={tab.id}
									onPress={() => props.onChangeState('selectedTab', tabIndex)}
								>
									<View
										style={{
											...styles.mainSettingItem,
											opacity: selectedTab === tabIndex ? 0.35 : 1
										}}
									/>
								</TouchableOpacity>
							))}
						</View>
						<View style={styles.detailSettingWrapper}>
							{tabs[selectedTab].values.map((value, valueIndex) => (
								<TouchableOpacity
									key={String(value)}
									onPress={() => props.onChangeState(tabs[selectedTab].id, valueIndex)}
								>
									<View
										style={{
											...styles.detailSettingItem,
											opacity: props[tabs[selectedTab].id] === valueIndex ? 0.35 : 1
										}}
									>
										<Text style={{fontFamily: 'NanumSquareB'}}>{value}</Text>
									</View>
								</TouchableOpacity>
							))}
						</View>
					</Fragment>
				)}
			</View>
			<TouchableOpacity
				key={'color'}
				onPress={() => props.onChangeState('palette', !palette)}
				style={{ flex: 0, flexDirection: 'row', alignContent: 'center', justifyContent: 'center' }}
			>
				<Icon name={`angle-${palette ? `up` : `down`}`} size={40} color={'#333'} style={styles.tabToggleIcon} />
			</TouchableOpacity>

			{/*  */}
			<View style={{ flex: 1, flexDirection: 'row', zIndex: 5 }}>
				<SketchCanvas
					style={{
						flex: 1
					}}
					strokeWidth={tabs[0].values[stroke]}
					strokeColor={tabs[1].values[color]}
					// onStrokeEnd={rs => props.onStrokeEnd(rs)}
				/>
			</View>
			<TouchableOpacity
				key={'color'}
				onPress={() => props.onChangeState('palette', !palette)}
				style={{ flex: 0, flexDirection: 'row', alignContent: 'center', justifyContent: 'center' }}
			>
				<Icon name={`angle-${palette ? `up` : `down`}`} size={40} color={'#333'} style={styles.tabToggleIcon} />
			</TouchableOpacity>
		</Fragment>
	);
};

const styles = StyleSheet.create({
	tabWrapper: {
		backgroundColor: '#333',
		width: '100%',
		zIndex: 7
	},

	mainSettingWrapper: {
		flex: 85,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'flex-end'
	},

	mainSettingItem: {
		width: 39,
		height: 39,
		borderWidth: 3,
		borderColor: '#fff',
		borderRadius: 25,
		marginTop: 7.5,
		marginBottom: 7.5,
		marginLeft: 7.5,
		marginRight: 7.5
	},

	detailSettingWrapper: {
		flex: 65,
		backgroundColor: '#333',
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center'
	},

	detailSettingItem: {
		width: 30,
		height: 30,
		backgroundColor: '#f1f1f1',
		borderWidth: 3,
		borderColor: '#fff',
		borderRadius: 25,
		marginBottom: 7.5,
		marginLeft: 7.5,
		marginRight: 7.5,

		justifyContent: 'center',
		alignItems: 'center'
	},

	tabToggleIcon: {
		// position: 'absolute',
		bottom: 0,
		// bottom: -27,
		alignContent: 'center',
		justifyContent: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 1
		},
		shadowOpacity: 0.22,
		shadowRadius: 2.22,
		elevation: 3
	}
});

export default PalettePresenter;
