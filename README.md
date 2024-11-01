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

---

### URLs
- http://localhost:3000 - This will show a basic page that pretty much does nothing
- http://localhost:3000/trace - This will invoke a trace with the node.js openTelemetry modules. The trace will be sent to the url configured in the `OTEL_TRACE_URL` environment variable. The traceId will also be logged to STDOUT. You will see the traceId on the page. Each time you refresh this page, you will generate a new traceId.
- http://localhost:3000/metrics - This is a route for basic prometheus metrics for the node.js express app

---

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

---

# Installing via helm chart:

Chart located in /helm directory

For more information, [ckick here](./helm/README.md).

---

# License
Copyright 2024 Jennifer Reed

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this work except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
