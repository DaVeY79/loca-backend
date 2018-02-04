import { writeFileSync } from 'fs';
import { join } from 'path';

import schema from '../../src/schema';

writeFileSync(join(__dirname, '..', '..', 'schema', 'schema.graphql'), schema.join('\n'));
