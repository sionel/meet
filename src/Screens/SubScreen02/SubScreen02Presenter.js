import React from "react";
import { View, Text, StyleSheet } from "react-native";

/**
 * SubScreen02Presenter
 */
const SubScreen02Presenter = () => (
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

export default SubScreen02Presenter;
