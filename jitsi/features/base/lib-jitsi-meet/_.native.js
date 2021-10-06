import "./native";
import '../../mobile/polyfills'
// The library lib-jitsi-meet (externally) depends on the libraries jQuery
(global => {
  // jQuery
  if (typeof global.$ === "undefined") {
    const jQuery = require("jquery");

    jQuery(global);
    global.$ = jQuery;
  }
})(global || window || this); // eslint-disable-line no-invalid-this

// import JitsiMeetJS from 'lib-jitsi-meet/lib-jitsi-meet.min';
import JitsiMeetJS from './libs/lib-jitsi-meet.min.js';
export { JitsiMeetJS as default };
