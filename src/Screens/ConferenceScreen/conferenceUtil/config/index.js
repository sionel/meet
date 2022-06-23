import dev from './dev';
import wehago from './wehago';
import { isDev } from '../../index';
// 제품 타입에 따라서 적합한 컨피그를 읽어온다.
const config = isDev ? dev : wehago;
export default config;
