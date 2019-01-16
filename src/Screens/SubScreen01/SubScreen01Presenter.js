import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Button 
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
/**
 * SubScreen01Presenter
 */
const SubScreen01Presenter = props => (
  <View style={styles.container}>
    <View>
      <Text>Drawer 접속화면</Text>
    </View>

    <View>
      <Button 
        title="나가기"
        onPress={() => props.onRedirect('Home')}
      />
      
    </View>
    <View>
    <Icon name="ios-menu" size={30} color="#4F8EF7" />
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
    alignItems: "center"
  }
});

export default SubScreen01Presenter;
