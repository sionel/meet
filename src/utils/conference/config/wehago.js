/**
 * wehago 기본 config
 */
const config = {
  hosts: {
    domain: "video.wehago.com",
    muc: "conference.video.wehago.com"
  },

  bosh: "//video.wehago.com/http-bind",
  openBridgeChannel: "datachannel",
  channelLastN: -1,
  resolution: "720",
  constraints: {
    video: {
      aspectRatio: 1.3,
      height: { ideal: 720, min: 720 },
      width: { min: 1280, max: 1280 }
    }
  },
  minHDHeight: 720,
  p2p: {
    enabled: false
  },
  stereo: true,
  e2eping: { pingInterval: 10000, analyticsInterval: 60000 }
};
export default config;
