/**
 * ParticipantPresenter
 * 참가자 컴포넌트 프레젠터
 */

import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView
} from 'react-native';

// import ParticipantItem from './ParticipantItem/ParticipantItemContainer';

const ParticipantPresenter = (props) => {
    return (  
        <View style={styles.area}>
            <ScrollView horizontal={true}>
                {props.participant.map(person => (
                    <Text>{JSON.stringify(person)}</Text>
                    // <ParticipantItem 
                    //     id={person.id}
                    //     name={person.name}
                    //     image={person.img}
                    //     name={person.name}
                    //     camera={person.conferenceStatus.camera}
                    //     mic={person.conferenceStatus.mic}
                    //     name={person.conferenceStatus.name}
                    // />
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    area: {
        width: '100%',
        padding:'0 3%'
    }
})
 
export default ParticipantPresenter;
