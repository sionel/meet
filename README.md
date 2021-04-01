## 기본 설치 리스트

1. watchman
2. npm / npx
3. Android Studio
4. Xcode

## 초기 설정

1. npm install<br/>(특이사항 : dependencies 에 "rn-component": "git+http://git.duzon.com/peacejung/rn-component.git#0.1.0" 가 있었지만 이제 없음)
2. 안드로이드 sdk 설정<br/>
   /android/local.properties 에 android sdk 경로 설정
3. 안드로이드 기기 설정<br/>
   빌드할 기기에 대한 설정이 필요함<br/>
   package.json > scripts<br/>
       "set-android": "~/Library/Android/sdk/platform-tools/adb -s R59M905GC8X reverse tcp:8081 tcp:8081"<br/>
   <u>**R59M905GC8X = 기기모델명**</u> 이므로 기기변경시 변경 후 실행이 필요함.<br/>
   모델명 확인방법 : ~/Library/Android/sdk/platform-tools/adb devices<br/>
   *<u>**주의 : Android Studio 설치 경로에 따라 adb 의 경로가 다를 수 있음**</u>*
4. 안드로이드 디버깅 script<br/>
   "android": "sudo npx react-native run-android" 


~/Library/Android/sdk/platform-tools/adb devices

## 안드로이드 배포용 빌드 설정

/android/gradle.properties

여기서 앱 버전 및 키스토어 설정을 해줘야함

/android/app

여기에 키스토어 파일을 두면 됨

1. apk 파일 추출 (인하우스 배포용)<br/>
   npm run build-inhouse<br/>
       "build-inhouse": "cd ./android && sudo rm -rf build ./app/build ./sdk/build && sudo ./gradlew assembleRelease && cd .."
2. aab 파일 추출 (마켓 배포용)<br/>
   npm run build-aab<br/>
       "build-aab": "cd ./android && sudo rm -rf build ./app/build ./sdk/build && sudo ./gradlew bundleRelease && cd .."

## 라이브러리 추가 방법

안드로이드X 대응을 위해 자바 코드 변환이 필요함

npm 을 통해 RN라이브러리를 받았다면 최초 1회에 한해서 jetifier 를 사용한 코드 변환이 필요 (라이브러리 받을 때 마다)

npx jetify

## 버전 정보

react-native : 0.61.5

react : 16.8.3

jitsi : ?

react-native 만 버전을 업그레이드 하면 jitsi 에서 오류가 날 가능성이 매우 크므로 주의

## 에러 대응

1. '__attribute__' 에러 :

node_modules/react-native/React/Base/RCTModuleMethod.mm 에서 91번째줄 수정

https://github.com/facebook/react-native/issues/25138 참고


```
static BOOL RCTParseUnused(const char **input)
{
   return RCTReadString(input, "__unused") ||
   RCTReadString(input, "__attribute__((__unused__))") || //solve by add   this line
   RCTReadString(input, "__attribute__((unused))");
}
```


2. 키체인 문제 :

https://zeddios.tistory.com/327

3. xcode 빌드 문제

오류 : Building for iOS Simulator, but the linked and embedded framework 'WebRTC.framework' was built for iOS + iOS Simulator.

https://stackoverflow.com/questions/63267897/building-for-ios-simulator-but-the-linked-framework-framework-was-built

https://stackoverflow.com/questions/63267897/building-for-ios-simulator-but-the-linked-framework-framework-was-built
https://stackoverflow.com/questions/65303304/xcode-12-3-building-for-ios-simulator-but-the-linked-and-embedded-framework-wa

4. package-lock 문제

현재 버전관리의 문제로 package.json 에서 ^ 이걸로 관리되던 패키지들이 좀 꼬여있어서 트랙에서 문제가 생김
^ 이걸 다 없애고 해도 문제가 생기기에 ^ 를 적당히 없애가는 방향으로 가야할듯

5. 에러코드

com.android.builder.testing.api.DeviceException: com.android.ddmlib.InstallException: INSTALL_FAILED_UPDATE_INCOMPATIBLE: Package com.wehago.meet signatures do not match previously 
installed version; ignoring!

기존에 깔린 앱 삭제 ㄱ

6. 안드로이드 버전에 따른 트랙 이슈

okhttp3 라는 것이 문제가 되는데
비 SDK 인터페이스 제한사항으로 안드로이드에서 막았다고 한다

제한사항 공지 : https://developer.android.com/distribute/best-practices/develop/restrictions-non-sdk-interfaces

리스트 : https://developer.android.com/about/versions/11/non-sdk-11#r-list-changes

문제가 되는 sdk라고 뜨는 것의 오류


      : Accessing hidden method Lcom/android/org/conscrypt/ConscryptEngineSocket;->setUseSessionTickets(Z)V (greylist-max-q,core-platform-api, reflection, denied)
      : Accessing hidden method Lcom/android/org/conscrypt/OpenSSLSocketImpl;->setUseSessionTickets(Z)V (greylist-max-q,core-platform-api, reflection, denied)
      : Accessing hidden method Lcom/android/org/conscrypt/AbstractConscryptSocket;->setUseSessionTickets(Z)V (greylist-max-q, reflection, denied)
      : Accessing hidden method Lcom/android/org/conscrypt/ConscryptEngineSocket;->setHostname(Ljava/lang/String;)V (greylist-max-q,core-platform-api, reflection, denied)
      : Accessing hidden method Lcom/android/org/conscrypt/OpenSSLSocketImpl;->setHostname(Ljava/lang/String;)V (greylist-max-q,core-platform-api, reflection, denied)
      : Accessing hidden method Lcom/android/org/conscrypt/AbstractConscryptSocket;->setHostname(Ljava/lang/String;)V (greylist-max-q, reflection, denied)
      : Accessing hidden method Lcom/android/org/conscrypt/OpenSSLSocketImpl;->setAlpnProtocols([B)V (greylist-max-q,core-platform-api, reflection, denied)
      : Accessing hidden method Lcom/android/org/conscrypt/AbstractConscryptSocket;->setAlpnProtocols([B)V (greylist-max-q, reflection, denied)
      : Accessing hidden method Lcom/android/org/conscrypt/OpenSSLSocketImpl;->getAlpnSelectedProtocol()[B (greylist-max-q,core-platform-api, reflection, denied)
      : Accessing hidden method Lcom/android/org/conscrypt/AbstractConscryptSocket;->getAlpnSelectedProtocol()[B (greylist-max-q, reflection, denied)
      : Accessing hidden method Lcom/android/org/conscrypt/ConscryptEngineSocket;->setUseSessionTickets(Z)V (greylist-max-q,core-platform-api, reflection, denied)
      : Accessing hidden method Lcom/android/org/conscrypt/OpenSSLSocketImpl;->setUseSessionTickets(Z)V (greylist-max-q,core-platform-api, reflection, denied)
      : Accessing hidden method Lcom/android/org/conscrypt/AbstractConscryptSocket;->setUseSessionTickets(Z)V (greylist-max-q, reflection, denied)
      : Accessing hidden method Lcom/android/org/conscrypt/ConscryptEngineSocket;->setHostname(Ljava/lang/String;)V (greylist-max-q,core-platform-api, reflection, denied)
      : Accessing hidden method Lcom/android/org/conscrypt/OpenSSLSocketImpl;->setHostname(Ljava/lang/String;)V (greylist-max-q,core-platform-api, reflection, denied)
      : Accessing hidden method Lcom/android/org/conscrypt/AbstractConscryptSocket;->setHostname(Ljava/lang/String;)V (greylist-max-q, reflection, denied)
      : Accessing hidden method Lcom/android/org/conscrypt/OpenSSLSocketImpl;->setAlpnProtocols([B)V (greylist-max-q,core-platform-api, reflection, denied)
      : Accessing hidden method Lcom/android/org/conscrypt/AbstractConscryptSocket;->setAlpnProtocols([B)V (greylist-max-q, reflection, denied)

okhttp3 를 쓰는 nodu_modules 특히 react-native 안에 있는 버전들이 3.12.1 인데 3.12.12에서 전부 처리되었다고 한다
수동으로 교체해주어야 함

7. webrtc bitcode 블라블라

cd node_modules/react-native-webrtc/tools/
./downloadBitcode.sh

만약 안되거든 인터넷 연결 확인을 하자
끗
## 작업목록

1. 화면공유 - sdk 업데이트시 가능
2. 하울링 - sdk 업데이트시 가능
3. 방 생성
4. 조직도 
5. 프로필
6. 참가인원 리스트
7. 딥링크 

## 스토어 주소
ios : https://itunes.apple.com/app/id1455726925?mt=8
android : https://play.google.com/store/apps/details?id=com.wehago.meet