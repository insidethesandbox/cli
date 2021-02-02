# Inside the Sandbox - CLI Tool

## Install

```bash
curl https://raw.githubusercontent.com/insidethesandbox/cli/main/install.sh | bash
```

## Command

start everything with
```bash
isb --help
```

### generate kubernetes config
```bash
isb kube -f yaml -o k8s.yaml
```

### genereate github ci/ci
```bash
isb github
```

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