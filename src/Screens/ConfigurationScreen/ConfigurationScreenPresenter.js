import React from "react";
import { 
  View, 
  FlatList,
  ListItem,
  Text, 
  StyleSheet, 
  Button 
} from "react-native";

// components
import {
  ListItemComp 
} from '../../components';

/**
 * ConfigurationScreenPresenter
 */
const ConfigurationScreenPresenter = (props) => (
  <View style={styles.container}>
    <View>
      <Text>환경설정 화면</Text>
    </View>

    <View>
      <Button 
        title="나가기"
        onPress={() => props.onRedirect('Home')}
      />
      
    </View>
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
    padding:"3%"
  }
});

export default ConfigurationScreenPresenter;
