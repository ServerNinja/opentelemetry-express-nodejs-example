const OpenTelemetry = require("@OpenTelemetry/api");
const { B3Propagator } = require('@OpenTelemetry/propagator-b3');

OpenTelemetry.propagation.setGlobalPropagator(new B3Propagator());

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  // Log request headers to console
  console.log("Request Headers: " + JSON.stringify(req.headers));

  // Tap into the activeSpan via the tracer
  var activeSpan;

  // Get info on current span
  // Ref: https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_api.SpanContext.html#traceId
  ctx = OpenTelemetry.context.active();
  activeSpan = OpenTelemetry.trace.getSpan(ctx);

  span_id = activeSpan.spanContext().spanId;
  trace_id = activeSpan.spanContext().traceId;
  trace_flags = activeSpan.spanContext().traceFlags;

  console.log(`trace route - log trace_id:”${trace_id}” span_id:”${span_id}” trace_flags:”${trace_flags}”`);

  activeSpan.addEvent('/trace called', { randomIndex: 1 });

  // Send a response
  res.send('respond with a resource');
});

module.exports = router;