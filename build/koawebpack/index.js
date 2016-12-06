var Webpack =require('webpack');
var devMiddleware =require('webpack-dev-middleware');
var hotMiddleware =require('webpack-hot-middleware');
var { PassThrough } =require('stream');
var compose =require('koa-compose');
var root =require('app-root-path');
var  path =require('path');

/**
 * @method koaDevware
 * @desc   Middleware for Koa to proxy webpack-dev-middleware
 **/
function koaDevware (compiler, options) {
  const dev = devMiddleware(compiler, options);

  /**
   * @method waitMiddleware
   * @desc   Provides blocking for the Webpack processes to complete.
   **/
  function waitMiddleware () {
    return new Promise((resolve, reject) => {
      dev.waitUntilValid(() => {
        resolve(true);
      });

      compiler.plugin('failed', (error) => {
        reject(error);
      });
    });
  }

  return async (context, next) => {
    
    await waitMiddleware();
  
    const hasNext= await applyMiddleware(dev,context.req, {
      send: content => context.body = content,
      setHeader: function() {context.set.apply(context, arguments)}
    });
 
    hasNext && await next();
  };
}

function applyMiddleware(middleware, req, res) {
  const _send = res.send;
  return new Promise((resolve, reject) => {
    try {
      res.send = function() {_send.apply(res, arguments) && resolve(false)};
      middleware(req, res, resolve.bind(null, true));
    } catch (error) {
      reject(error);
    }
  });
}
/**
 * @method koaHotware
 * @desc   Middleware for Koa to proxy webpack-hot-middleware
 **/
function koaHotware (compiler, options) {
  const hot = hotMiddleware(compiler, options);

  return async (context, next) => {
    let stream = new PassThrough();
    context.body = stream;
    await hot(context.req, {
      write: stream.write.bind(stream),
      writeHead: (state, headers) => {
        context.state = state;
        context.set(headers);
      }
    }, next);
  };
}

/**
 * The entry point for the Koa middleware.
 **/
module.exports=(options) => {

  const defaults = { dev: {}, hot: {} };

  options = Object.assign(defaults, options);

  let config = options.config,
    compiler = options.compiler;

  if (!compiler) {
    if (!config) {
      config = require(path.join(root.path, 'webpack.config.js'));
    }

    compiler = Webpack(config);
  }

  if (!options.dev.publicPath) {
    let publicPath = compiler.options.output.publicPath;

    if (!publicPath) {
      throw new Error('koa-webpack: publicPath must be set on `dev` options, or in a compiler\'s `output` configuration.');
    }

    options.dev.publicPath = publicPath;
  }

  return compose([
    koaDevware(compiler, options.dev),
    koaHotware(compiler, options.hot)
  ]);
};
