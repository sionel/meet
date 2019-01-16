import React from 'react';
import {View , Text, Button} from 'react-native';

class Home extends React.Component {
    render(){
        return (  
            <View style={{backgroundColor:'#f1f1f1', flex:1, justifyContent:'center', alignItems:'center'}}>
                <Text>Home</Text>
                <Button 
                    title="Go Conference"
                    onPress={()=>this.handleRedirect('Conference')}
                />
            </View>
        );
    }

    /**
     * handleRedirect
     * 페이지 이동
     */
    handleRedirect = url => {
        const { navigation } = this.props;
        // console.log(navigation);
        // alert(navigation);
        
        navigation.navigate(url)
    }
}
 
export default Home;
