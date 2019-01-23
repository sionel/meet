/**
 * 화상대화 dev config
 */
const config = {
  hosts: {
    domain: "meet.jit.si",
    muc: "conference.meet.jit.si",
    bridge: "jitsi-videobridge.beta.meet.jit.si"
  },
  bosh: "//meet.jit.si/http-bind",
  resolution: 720,
  constraints: {
    video: {
      aspectRatio: 1.7777777777777777,
      height: { ideal: 720, max: 720, min: 240 }
    }
  }
};

export default config;
