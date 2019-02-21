/**
 * wehagov 기본 config
 */
const config = {
	hosts: {
		domain: 'video.wehagov.com',
		muc: 'conference.video.wehagov.com'
	},

	bosh: '//video.wehagov.com/http-bind',
	openBridgeChannel: 'datachannel',
	channelLastN: -1,
	resolution: '720',
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
	e2eping: { pingInterval: 10000, analyticsInterval: 60000 },
	disableSimulcast: true
};
export default config;
