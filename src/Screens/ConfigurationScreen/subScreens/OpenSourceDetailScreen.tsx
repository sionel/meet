import React from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

export default function OpenSourceDetailScreen(props:any) {
  const url = props.navigation.state.params.url;

  return (
    <WebView
      source={{ uri: url }}
      startInLoadingState={true}
      renderLoading={() => <ActivityIndicator />}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
