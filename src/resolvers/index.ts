import * as lodash from 'lodash';
import authentication from './authentication';
import health from './health';

export default lodash.merge(health, authentication);
