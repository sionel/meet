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