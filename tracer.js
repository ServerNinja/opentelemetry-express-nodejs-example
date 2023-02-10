'use strict'

const {
  BasicTracerProvider,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
  BatchSpanProcessor,
} = require('@opentelemetry/tracing')
const { CollectorTraceExporter } = require('@opentelemetry/exporter-collector')
const { Resource } = require('@opentelemetry/resources')
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions')
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express')
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http')
const { registerInstrumentations } = require('@opentelemetry/instrumentation')
const opentelemetry = require('@opentelemetry/sdk-node')
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node')
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node')
const { OTTracePropagator } = require('@opentelemetry/propagator-ot-trace')
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger')
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-http");

const providerUrl = process.env.OTEL_TRACE_URL || 'http://localhost:14268/api/traces'

// Can be 'jaeger' or 'otlp'
const exporterProvider = process.env.OTEL_PROVIDER || 'jaeger'

var exporter

const init = (serviceName, environment) => {


  // User Collector Or Jaeger Exporter
  //const exporter = new CollectorTraceExporter(options)
  
  if (exporterProvider == "jaeger") {
    console.log("Using Jaeger Exporter for OpenTelemetry");
    exporter = new JaegerExporter({
      tags: [],
      endpoint: providerUrl,
    })
  } else if (exporterProvider == "otlp") {
    console.log("Using OTLP Exporter for OpenTelemetry");
    exporter = new OTLPTraceExporter({
      url: providerUrl,
      headers: {}
    })
  } else {
    console.log("Using Collector Exporter for OpenTelemetry");
    exporter = new CollectorTraceExporter({
      tags: [],
      endpoint: providerUrl,
    });
  }

  const provider = new NodeTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName, // Service name that showuld be listed in jaeger ui
      [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: environment,
    }),
  })

  //provider.addSpanProcessor(new SimpleSpanProcessor(exporter))

  // Use the BatchSpanProcessor to export spans in batches in order to more efficiently use resources.
  provider.addSpanProcessor(new BatchSpanProcessor(exporter))

  // Enable to see the spans printed in the console by the ConsoleSpanExporter
  //provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter())) 

  provider.register({ propagator: new OTTracePropagator() })

  console.log(`Tracing initialized (endpoint URL): ${providerUrl}`)

  registerInstrumentations({
    instrumentations: [new ExpressInstrumentation(), new HttpInstrumentation()],
  })
  
  const tracer = provider.getTracer(serviceName)
  return { tracer }
}

module.exports = {
  init: init,
}