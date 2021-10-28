import * as nconf from 'nconf';
import * as path from 'path';

export default () => {
  return nconf
    .argv()
    .file(path.resolve('cfg', nconf.get('config') + '.json'))
    .get() as Record<string, unknown>;
}