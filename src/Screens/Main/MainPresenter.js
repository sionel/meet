import React from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import RootNavigation from "../Navigation/RootNavigation";

/**
 * MainPresenter
 */
const MainPresenter = () => (
  <View style={styles.container}>
    <StatusBar hidden={false} />
    <RootNavigation />
  </View>
);

/**
 * styles
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});

export default MainPresenter;
