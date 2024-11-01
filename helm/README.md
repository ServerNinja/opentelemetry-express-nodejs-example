# Helm chart

Installation
```
helm upgrade --install app-tester ./app-metrics-telemetry-tester
```

Example values.yaml
```
---
# Telemetry configuration
telemetry:
  provider: otlp
  # Set this to the URL of your telemetry collection endpoint
  url: http://collector.otel.svc.cluster.local:4318/v1/traces

# ServiceMonitor for prometheus metrics collection
serviceMonitor:
  enabled: true

# Ingress configuration
ingress:
  enabled: true
  className: nginx

  annotations:
    kubernetes.io/ingress.class: "nginx"
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"

  hosts:
    - host: app-test.example.com
      paths:
        - path: /
          pathType: Prefix
          backend:
            service:
              port:
                name: http
  tls:
    - hosts:
        - app-test.example.com
      secretName: certificate-secret-name

```
