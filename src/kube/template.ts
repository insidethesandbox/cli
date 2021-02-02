import { map } from "lodash"
import type { Config } from "../config"

const IMAGE_PULL_SECRET = 'registry-insidethesandbox'

export function deployment(
  { name, namespace, replicas = 1, image_url = `registry.digitalocean.com/insidethesandbox/${namespace}-${name}:latest`, container_port = 80, image_pull_secret = IMAGE_PULL_SECRET, env }:
  { name: string, namespace: string, replicas?: number, image_url?: string, container_port?: number, image_pull_secret?: string, env?: Record<string, any> }) {
  return {
    apiVersion: 'apps/v1',
    kind: 'Deployment',
    metadata: {
      name: name,
      namespace: namespace,
      labels: {
        app: name,
      },
    },
    spec: {
      selector: { matchLabels: { app: name } },
      replicas: replicas,
      revisionHistoryLimit: 1,
      template: {
        metadata: {
          labels: { app: name }
        },
        spec: {
          restartPolicy: 'Always',
          imagePullSecrets: [{ name: image_pull_secret }],
          containers: [
            {
              name: name,
              image: image_url,
              ports: [{ containerPort: container_port }],
              env: map(env, (val, key) => ({ name: key, value: `${val}` })),
              resources: {
                requests: { memory: '30Mi', cpu: '5m' },
                limits: { memory: '100Mi', cpu: '10m' }
              }
            }
          ]
        }
      }
    }
  }
}

export function service({ name, namespace, port = 80 }: { name: string, namespace: string, port: number }) {
  return {
    apiVersion: 'v1',
    kind: 'Service',
    metadata: {
      name: name,
      namespace: namespace,
    },
    spec: {
      selector: { app: name },
      type: 'ClusterIP',
      ports: [{ port: port }]
    }
  }
}

export function namespace({ namespace }: { namespace: string }) {
  return {
    apiVersion: 'v1',
    kind: 'Namespace',
    metadata: {
      name: namespace,
      annotations: {
        'linkerd.io/inject': 'enabled',
      }
    }
  }
}

export function certificate({ namespace, tls_crt, tls_key }:  { namespace: string, tls_crt: string, tls_key: string }) {
  return {
    apiVersion: 'v1',
    kind: 'Secret',
    metadata: {
      name: `${namespace}.tls`,
      namespace: namespace,
    },
    type: 'kubernetes.io/tls',
    data: {
      'tls.crt': tls_crt,
      'tls.key': tls_key,
    }    
  }
}

export function ingress({ applications, namespace }: { namespace: string, applications: Config["applications"] }) {
  return {
    apiVersion: 'networking.k8s.io/v1',
    kind: 'Ingress',
    metadata: {
      name: `${namespace}.ingress`,
      namespace: namespace,
      annotations: {
        'kubernetes.io/ingress.class': 'nginx',
      },
    },
    spec: {
      tls: [
        {
          hosts: applications.map(app => app.host),
          secretName: `${namespace}.tls`,
        }
      ],
      rules: applications.map(app => ({
        host: app.host,
        http: {
          paths: [
            {
              path: '/',
              pathType: 'Prefix',
              backend: { service: { name: app.name, port: { number: app.port } } }
            }
          ]
        }
      }))
    }
  }
}
