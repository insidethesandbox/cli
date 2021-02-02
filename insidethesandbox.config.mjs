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
