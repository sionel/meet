/**
 * CreateScreenPresenter
 * 화상대화 진입화면 프레젠터
 */

import React, {Fragment} from "react";
import { 
  View, 
  Button,
  Text, 
  StyleSheet, 
} from "react-native";


/**
 * CreateScreenPresenter
 */
const CreateScreenPresenter = (props) => {

  
  // #region
  /**
   * Return
   */
  return (
    <View style={{...styles.container}}>
      <Text>CREATE PAGE</Text>
      <Button 
        title="나가기"
        onPress={() => props.onRedirect('Home')}
      />
      
    </View>
  )
  // #endregion
};

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

  
});

export default CreateScreenPresenter;
