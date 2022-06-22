import dev from './dev';
import wehago from './wehago';
import { isDev } from '../../index';
<<<<<<< Updated upstream:src/Screens/ConferenceScreen/conferenceUtil/config/index.js
// import { WEHAGO_ENV } from '../../../../../config';

// 제품 타입에 따라서 적합한 컨피그를 읽어온다.

const config = isDev ? dev :  wehago;
=======

// 제품 타입에 따라서 적합한 컨피그를 읽어온다.

const config = isDev ? dev : wehago;
>>>>>>> Stashed changes:src/utils/conference/config/index.js

export default config;
