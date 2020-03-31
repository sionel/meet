/**
 * wehago 기본 config
 */
const config = {
  hosts: {
    domain: 'video.wehago.com',
    muc: 'conference.video.wehago.com'
  },
  bosh: '//video.wehago.com/http-bind',
  openBridgeChannel: 'datachannel',
  channelLastN: -1,
  resolution: 720,
  constraints: {
    video: {
      aspectRatio: 1.3,
      height: {
        ideal: 320,
        max: 720,
        min: 240
      },
      width: { min: 640, max: 1280 }
    }
  },
  disableSuspendVideo: true,
  disableSimulcast: false,
  minHDHeight: 240,
  p2p: {
    enabled: true
  },
  stereo: true,
  e2eping: { pingInterval: 10000, analyticsInterval: 60000 }
};

export default config;
