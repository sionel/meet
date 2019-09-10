/**
 * 화상대화 dev config
 */

const config = {
  // hosts: {
  //   domain: 'beta.meet.jit.si',
  //   muc: 'conference.beta.meet.jit.si',
  //   bridge: 'jitsi-videobridge.beta.meet.jit.si'
  // },
  // bosh: '//beta.meet.jit.si/http-bind',
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
      height: { ideal: 720, min: 240, max: 720 },
      width: { min: 640, max: 1280 }
    }
  },
  disableSuspendVideo: true,
  minHDHeight: 240,
  p2p: {
    enabled: false
  },
  stereo: true,
  e2eping: { pingInterval: 10000, analyticsInterval: 60000 },
  disableSimulcast: true
};

export default config;
