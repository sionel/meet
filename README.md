## 기본 설치 리스트

1. watchman
2. npm / npx
3. Android Studio
4. Xcode

## 초기 설정

1. npm install<br/>(특이사항 : dependencies 에 "rn-component": "git+http://git.duzon.com/peacejung/rn-component.git#0.1.0" 가 있음)
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

react-native : 0.59.8

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