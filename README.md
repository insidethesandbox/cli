# Inside the Sandbox - CLI Tool

## Command

### generate kubernetes config
`./dist/isb.mjs kube -f yaml -o k8s.yaml`

### genereate github ci/ci
`./dist/isb.mjs github`

## Config file

all of them need to define `insidethesandbox.config.mjs`
```js
export default {
  digitalocean: {
    access_token: ''
  },
  kubernetes: {
    cluster: '',
    namespace: 'examplenamespace',
  },
  cloudflare: {
    crt: '',
    key: '',
  },
  applications: [
    {
      name: 'journey',
      host: 'ze.insidethesandbox.studio',
      folder: './journey',
      port: 80
    },
    {
      name: 'web',
      host: 'mm.ze.insidethesandbox.studio',
      folder: './webx',
      port: 777,
      env: {
        PORT: '777'
      }
    },
  ]
}

```