import _ from 'lodash';
import health from './health';
import authentication from './authentication';

export default _.merge(health, authentication);
