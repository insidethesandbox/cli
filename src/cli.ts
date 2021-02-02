import yargs from 'yargs'
import { github_action_builder, github_action_tempalte } from './github'
import { kube_builder, kube_generate_config } from './kube'

yargs(process.argv.slice(2), process.cwd())
  .usage('Inside the Sandbox - CLI\nfor auto generate kubernetes config & github action')
  .command(['kube', 'k8s', 'k'], 'generate kubernetes config', kube_builder, kube_generate_config)
  .command(['github', 'git', 'g'], 'generate github workflows cicd config', github_action_builder, github_action_tempalte)
  .demandCommand(1)
  .parse()
