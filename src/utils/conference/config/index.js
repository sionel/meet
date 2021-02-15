import dev from './dev';
import wehago from './wehago';
import wehagov from './wehagov';
import { isDev } from '../../index';
// 제품 타입에 따라서 적합한 컨피그를 읽어온다.
const config = isDev
  ? dev
  : process.env.REACT_APP_TYPE === 'wehagov'
  ? wehagov
  : wehago;

export default config;
