import { WEHAGO_ENV } from '../../../../config';

const isWehagoV = WEHAGO_ENV === 'WEHAGOV';

/**
 * wehago 기본 config
 */
const config = {
  hosts: {
    domain: `video.wehago${isWehagoV ? 'v' : ''}.com`,
    muc: `conference.video.wehago${isWehagoV ? 'v' : ''}.com`
  },
  bosh: `//video.wehago${isWehagoV ? 'v' : ''}.com/http-bind`,
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
