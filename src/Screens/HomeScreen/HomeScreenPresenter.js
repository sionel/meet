/**
 * HomeScreenPresenter
 * 화상대화 히스토리 프레젠터
 */
import React from "react";
import { 
  View, 
  FlatList,
  StyleSheet,
} from "react-native";
// common components
import {
  ListItemComp,
} from '../../components'
// 검색바
import SearchForm from './SearchForm';
// 추가버튼
import AddButton from './AddButton';

/**
 * HomeScreenPresenter
 */
const HomeScreenPresenter = (props) => (
  <View style={styles.container}>
    {/* 검색바 */}
    <SearchForm />

    {/* 화상대화 히스토리 리스트 */}
    <FlatList 
      style={styles.listContainer}
      data={props.list}
      renderItem={ ({item}) => (
        // 히스토리 아이템
        <ListItemComp 
          img={item.img}
          title={item.title}
          personnel={item.count}
          active={item.active}
          onClick={()=>props.onRedirect('Conference')}
        />
      )}
    />

    {/* 방생성 버튼 */}
    <AddButton onClick={props.onRedirect} />
  </View>
);

/**
 * styles
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },

  listContainer: {
    width:"100%",
    padding:"4% 3%"
  }
});

export default HomeScreenPresenter;
