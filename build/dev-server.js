//require('babel-polyfill')
var config2 = require('./config/index')
if (!process.env.NODE_ENV) process.env.NODE_ENV = config2.dev.env
var path = require('path')
var webpack = require('webpack')
var webpackdev = require('./koawebpack/index')
var program = require('commander');
const koa = require('koa');
program.option('-e, --entry <n> ', '模块名')
  .parse(process.argv);
var webpackConfig = require('./webpack.dev.conf')(program)


var compiler = webpack(webpackConfig)

var app =new koa()
//webpack 开发中间件 （中间件）
app.use(webpackdev({
  compiler: compiler,
  config: webpackConfig,
  dev: {
    // display no info to console (only warnings and errors)
    noInfo: false,

    // display nothing to the console
    quiet: false,

    // switch into lazy mode
    // that means no watching, but recompilation on every request
    lazy: false,

    // watch options (only lazy: false)
    watchOptions: {
      aggregateTimeout: 300,
      poll: true
    },

    // public path to bind the middleware to
    // use the same as in webpack
    publicPath: webpackConfig.output.publicPath,

    // options for formating the statistics
    stats: {
      colors: true
    }
  },
  hot: {
    log: console.log,
    // path: '/__webpack_hmr',
    // heartbeat: 10 * 1000
  }
}))

var router = require('koa-router')();

router.get('/api', async function (ctx,next) {
    ctx.body={'echo':'ok'}
  
     await next();
    
});
app.use(router.routes())
  .use(router.allowedMethods());


// import restc
const restc = require('restc');
// use restc middleware
app.use(restc.koa2());

let server = require('http').createServer(app.callback());

server.listen(3000);