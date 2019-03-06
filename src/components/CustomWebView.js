/**
 * CustomWebView
 */

import React from 'react';
import { Text, View, WebView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const CustomWebView = props => {
	const { icon, contentTitle, buttonTitle, url, headerStyle, titleStyle, contentStyle, onClickButton } = props;
	return (
		<View style={{ flex: 1 }}>
			<View
				style={{
					width: '100%',
					height: 90,
					paddingTop: 30,
					paddingLeft: 20,
					paddingRight: 20,
					backgroundColor: '#1C90FB',
					justifyContent: 'flex-end',
					alignItems: 'center',
					flexDirection: 'row',
					boxShadow: '0 1 0 1 rgba(0,0,0, .5)',
					...headerStyle
				}}
			>
				<Icon name={icon} size={17} color="#fff" style={{ marginRight: 5, opacity: 0.85 }} />
				<Text
					style={{
						color: '#fff',
						flex: 2,
						fontSize: 17,
						textAlign: 'left',
						fontWeight: 'bold',
						...titleStyle
					}}
				>
					{contentTitle}
				</Text>
				<TouchableOpacity style={{ flex: 1 }} onPress={onClickButton}>
					<Text style={{ color: '#fff', fontSize: 17, textAlign: 'right' }}>{buttonTitle}</Text>
				</TouchableOpacity>
			</View>
			<WebView source={{ uri: url }} style={{ ...contentStyle }} />
		</View>
	);
};

CustomWebView.defaultProps = {
	icon: 'globe',
	contentTitle: '웹페이지',
	buttonTitle: '확인',
	url: 'https://www.wehago.com/#/',
	headerStyle: {},
	titleStyle: {},
	contentStyle: {},
	onClickButton: () => {
		alert('on Click');
	}
};

export default CustomWebView;
