var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var traceRouter = require('./routes/trace');

const promBundle = require("express-prom-bundle");

// Add the options to the prometheus middleware most option are for http_request_duration_seconds histogram metric
const metricsMiddleware = promBundle({
    includeMethod: true, 
    includePath: true, 
    includeStatusCode: true, 
    includeUp: true,
    customLabels: {project_name: 'metrics-telemetry-tester', project_type: 'node.js'},
    promClient: {
        collectDefaultMetrics: {
        }
      }
});

// OpenTelemetry Tracing
const { init } = require('./tracer')
const api = require('@opentelemetry/api')
init('demo-node-service', 'development') // calling tracer with service name and environment to view in jaegerui

var app = express();

// Commenting out live reloading
/* 
var server = require('http').Server( app )
var liveReload = require('express-live-reloading')( server )
liveReload.static(
  'routes', // virtual directory for you URL
  'public' // phisycal directory in you computer
) ;

app.use(liveReload);
*/

// add the prometheus middleware to all routes
app.use(metricsMiddleware)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/trace', traceRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
