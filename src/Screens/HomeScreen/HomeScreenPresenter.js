/**
 * HomeScreenPresenter
 * 화상대화 히스토리 프레젠터
 */
import React from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
// common components
import { ListItemComp, SearchForm } from '../../components';
// 추가버튼
import AddButton from './AddButton';

/**
 * HomeScreenPresenter
 */
const HomeScreenPresenter = props => (
	<View style={styles.container}>
		{/* 검색바 */}
		<SearchForm onChange={props.onSearch} />

		{props.list.length < 1 && (
			<View style={{ height: '10%', justifyContent: 'center', alignItems: 'center' }}>
				<Text>검색된 결과가 없습니다 :(</Text>
			</View>
		)}

		{/* 화상대화 히스토리 리스트 */}
		<FlatList
			refreshing={props.refreshing}
			onRefresh={props.onRefresh}
			style={styles.listContainer}
			data={props.list}
			renderItem={({ item }) => (
				// 히스토리 아이템
				<ListItemComp
					title={item.room_title}
					personnel={item.receiver_user_count}
					updated={item.update_timestamp}
					active={item.conference}
					onClick={() => props.onRedirect('Conference')}
				/>
			)}
		/>
		<View>
			<Button title="Go login" onPress={() => props.onRedirect('Login')} />
		</View>

		{/* 방생성 버튼 */}
		{/* <AddButton onClick={() => props.onRedirect('Create')} /> */}
	</View>
);

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

	listContainer: {
		width: '100%',
		padding: '4% 3%'
	}
});

export default HomeScreenPresenter;
