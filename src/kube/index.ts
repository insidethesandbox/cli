import * as path from 'path'
import * as fs from 'fs'
import YAML from 'yaml'
import { flattenDeep, join } from 'lodash'
import * as k8s from './template'
import type { Argv } from 'yargs'
import { load_insidethesandbox_config } from '../config'

type InferBuilder<T> = T extends (argv: Argv) => Argv<infer U> ? U : never;

export const kube_builder = (argv: Argv) => argv
  .option('format', {
    alias: 'f',
    choices: ['yaml', 'json'],
    default: 'yaml' as 'json' | 'yaml',
  })
  .option('config', {
    alias: 'c',
    describe: 'config file',
    default: './insidethesandbox.config.mjs',
  })
  .option('output', {
    alias: 'o',
    describe: 'output destination [stdout, or file location]',
    default: 'stdout',
  })

export async function kube_generate_config(args: InferBuilder<typeof kube_builder>) {
  const config = await load_insidethesandbox_config(args.config);
  const k8s_config = flattenDeep<any>([
    k8s.namespace({ namespace: config.kubernetes.namespace }),
    k8s.certificate({ namespace: config.kubernetes.namespace, tls_crt: config.cloudflare.crt, tls_key: config.cloudflare.key }),
    k8s.ingress({ namespace: config.kubernetes.namespace, applications: config.applications }),
    config.applications.map(app => [
      k8s.service({ namespace: config.kubernetes.namespace, name: app.name, port: app.port }),
      k8s.deployment({ namespace: config.kubernetes.namespace, name: app.name, env: app.env ?? {} }),
    ])
  ])
  const out = args.format === 'json'
    ? JSON.stringify(k8s_config, null, 2)
    : join(k8s_config.map(c => YAML.stringify(c)), '---\n')
  if (args.output === 'stdout') {
    console.log(out)
  } else {
    const out_path = path.join(process.cwd(), args.output)
    fs.mkdirSync(path.parse(out_path).dir, { recursive: true })
    fs.writeFileSync(path.join(process.cwd(), args.output), out);
  }
}