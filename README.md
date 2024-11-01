# Metrics / Telemetry tester

This is a very basic node.js app used to test metrics and telemetry infrastructure in K8s.

## Basic use:
```
npm start

> app-metrics-telemetry-tester@0.0.0 start
> node ./bin/www

Using Jaeger Exporter for OpenTelemetry
Tracing initialized (endpoint URL): http://localhost:14268/api/traces
Listening http port: 3000
Trace URL: http://localhost:3000/trace
Metrics URL: http://localhost:3000/metrics

```

### Running docker container
```
docker run -p 3000:3000 -it serverninja/app-metrics-telemetry-tester
```

### URLs
- http://localhost:3000 - This will show a basic page that pretty much does nothing
- http://localhost:3000/trace - This will invoke a trace with the node.js openTelemetry modules. The trace will be exposed on port 14268 and will also be logged to STDOUT. You will see the trace ID on the page
- http://localhost:3000/metrics - This is a route for basic prometheus metrics for the node.js express app

## Building with docker
```
docker build -t serverninja/app-metrics-telemetry-tester .
```

### Building with Podman / multi-arch
```
IMAGE_NAME=serverninja/app-metrics-telemetry-tester

# First, initialise the manifest
podman manifest create $IMAGE_NAME

# Build the image attaching them to the manifest
podman build --platform linux/amd64,linux/arm64  --manifest $IMAGE_NAME  .

# Finally publish the manifest
podman manifest push $IMAGE_NAME

# Clean up manifest
podman manifest rm $IMAGE_NAME
```