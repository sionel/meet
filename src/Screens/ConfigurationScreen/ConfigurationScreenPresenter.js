/**
 * ConfigurationScreenPresenter
 */

import React from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity, Modal, Alert } from 'react-native';
import { CustomWebView, SectionListHeader } from '../../components';

const ConfigurationScreenPresenter = props => {
	const { webView } = props;
	const userConfig = [
		// {
		//   title: "onDestroyToken",
		//   action: () => props.onDestroyToken()
		// },
		{
			title: '이용약관',
			action: () => props.onChangeValue('webView', true)
		},
		{
			title: '개인정보 처리방침',
			action: () => props.onChangeValue('webView', true)
		},
		{
			title: '버전정보',
			action: () => Alert.alert(
				'버전정보',
				'1.0.2',
				[{ text: 'OK'}],
				{ cancelable: true }
			)
		},
		// {
		// 	title: '앱인트로 보기',
		// 	action: () => props.onToggleVisibleAppIntro()
		// },
		// {
		// 	title: '로그 보기',
		// 	action: () => alert(JSON.stringify(props.log).replace(/,/gi, /,\n/))
		// },
		{
			title: '로그아웃',
			action: () => props.onLogout()
		}
	];

	return (
		<View style={styles.container}>
			<View
				style={{
					flex: 1,
					width: '100%'
				}}
			>
				<SectionList
					sections={[{ title: '시스템', data: userConfig }]}
					renderSectionHeader={({ section }) => <SectionListHeader title={section.title} />}
					renderItem={({ item }, index) => (
						<TouchableOpacity key={index} onPress={item.action}>
							<Text style={styles.item}>{item.title}</Text>
						</TouchableOpacity>
					)}
					keyExtractor={(item, index) => index}
				/>
			</View>

			<Modal animationType="slide" transparent={true} visible={webView} blurRadius={1} onRequestClose={() => props.onChangeValue('webView', false)}>
				<CustomWebView
					view={webView}
					contentTitle="약관 및 정책"
					buttonTitle="확인"
					url="https://www.wehago.com/#/common/policy"
					onClickButton={() => props.onChangeValue('webView', false)}
				/>
			</Modal>
		</View>
	);
};

/**
 * styles
 */
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'transparent',
		justifyContent: 'center',
		alignItems: 'center'
	},

	listContainer: {
		width: '100%',
		padding: '3%'
	},

	item: {
		padding: 10,
		fontSize: 15,
		height: 44
	}
});

export default ConfigurationScreenPresenter;
