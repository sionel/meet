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

  resolution: 720,
  constraints: {
    video: {
      aspectRatio: 1.7777777777777777,
      height: { ideal: 720, max: 720, min: 240 }
    }
  },
  disableSimulcast: true
};

export default config;
