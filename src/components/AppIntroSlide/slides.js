import React from 'react';

const slides = props => {
  return [
      {
        key: '0',
        view: (
          <View
            style={{
              flex: 1,
              width: props.width,
              backgroundColor: 'rgb(0, 105, 224)',
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Image
              source={props.introImages[0]}
              style={{ width: 144, height: 144 }}
              resizeMode="contain"
            />
            <Text style={{ marginTop: 107.5, color: '#FFF', fontSize: 17, fontFamily: Platform.OS === 'ios' ? 'NanumSquareEB' : 'normal', }}>언제 어디서나 WEHAGO Meet</Text>
            <Text style={{ marginTop: 24.5, color: 'rgb(193, 219, 246)', fontSize: 12, fontFamily: Platform.OS === 'ios' ? 'NanumSquareB' : 'normal' }}>시간과 장소의 제약 없는 효율적인 화상회의</Text>
          </View>
        )
      },
      {
        key: '1',
        view: (
          <View
            style={{
              flex: 1,
              width: props.width,
              backgroundColor: 'rgb(244, 250, 254)',
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={props.styles.textTitle}>WAHAGO 연동</Text>
            <Text style={props.styles.textContent}>{"새로운 회의를 만들거나 진행중인\nWE톡 화상회의에 바로 참여"}</Text>
            <Image
              source={props.introImages[1]}
              style={{ width: props.width, height: props.width * ratio }}
              resizeMode="center"
            />
          </View>
        )
      },
      {
        key: '2',
        view: (
          <View
          style={{
            flex: 1,
            width: props.width,
              backgroundColor: 'rgb(244, 250, 254)',
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={props.styles.textTitle}>화상 및 음성전화</Text>
            <Text style={props.styles.textContent}>{"연결된 조직도 직원부터\n거래처까지 화상/음성전화 지원"}</Text>
            <Image
              source={props.introImages[2]}
              style={{ width: props.width, height: props.width * ratio }}
              resizeMode="center"
            />
          </View>
        )
      },
      {
        key: '3',
        view: (
          <View
            style={{
              flex: 1,
              width: props.width,
              backgroundColor: 'rgb(244, 250, 254)',
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={props.styles.textTitle}>실시간 공유기능</Text>
            <Text style={props.styles.textContent}>{"PC화면이나 문서를 실시간으로 공유\n화상회의 중 대화기능 제공"}</Text>
            <Image
              source={props.introImages[3]}
              style={{ width: props.width, height: props.width * ratio }}
              resizeMode="center"
            />
          </View>
        )
      },
      {
        key: '4',
        view: (
          <View
            style={{
              flex: 1,
              width: props.width,
              backgroundColor: 'rgb(244, 250, 254)',
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={props.styles.textTitle}>고화질의 화상회의</Text>
            <Text style={props.styles.textContent}>{"네트워크 속도에 따라\n자동으로 조절되는 화질"}</Text>
            <Image
              source={props.introImages[4]}
              style={{ width: props.width, height: props.width * props.ratio }}
              resizeMode="center"
            />
          </View>
        )
      }
    ];
};

export default slides;