import dev from './dev';
import wehago from './wehago';
import wehagov from './wehagov';
import { isDev } from '../../index';
import { WEHAGO_ENV } from '../../../../config';

// 제품 타입에 따라서 적합한 컨피그를 읽어온다.

const config = isDev ? dev : WEHAGO_ENV === 'WEHAGOV' ? wehagov : wehago;

export default config;
