import * as path from 'path'
import * as fs from 'fs'
import YAML from 'yaml'
import { flattenDeep, join } from 'lodash'
import * as github from './template'
import type { Argv } from 'yargs'
import { load_insidethesandbox_config } from '../config'

type InferBuilder<T> = T extends (argv: Argv) => Argv<infer U> ? U : never;

export const github_action_builder = (argv: Argv) => argv
  .option('config', {
    alias: 'c',
    describe: 'config file',
    default: './insidethesandbox.config.mjs',
  })
  .option('output', {
    alias: 'o',
    describe: 'github workflow directory',
    default: '.github/workflows',
  })

export async function github_action_tempalte(args: InferBuilder<typeof github_action_builder>) {
  const workflow_folder = path.join(process.cwd(), args.output)
  fs.mkdirSync(workflow_folder, { recursive: true });
  const config = await load_insidethesandbox_config(args.config);
  for (const app of config.applications) {
    const cicd_json = github.github_action_template({ 
      app: app, 
      namespace: config.kubernetes.namespace, 
      kubernete_cluster: config.kubernetes.cluster 
    })
    const cicd_yaml = YAML.stringify(cicd_json)
    fs.writeFileSync(path.join(workflow_folder, `${app.name}.workflow.yml`), cicd_yaml)
  }
}