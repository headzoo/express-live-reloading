/**
 * @author S.Gaborieau <sam.gabor@hotmail.com>
 *
 * @package [npm] express-live-reloading
 * @version 0.8.855 `pre-stable version`
 *
 * @git <https://github.com/Orivoir/express-live-reloading>
 * @npm <https://www.npmjs.com/package/express-live-reloading>
 */
require('./lib/env-vars') ;

const entryPoint = require('./lib/entry-point')( process.reloadEmitter ) ;

/**
 * @exports Function *entry point* **hydrate config** attach **TCP/IP** server and return `middleware` for **express**
 */
module.exports = entryPoint;
