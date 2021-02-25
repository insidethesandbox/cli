import type { Config } from '../config'

export function github_action_template({ app, namespace, kubernete_cluster = '49d2977a-5827-4036-9093-d26032fed169' }: { app: Config["applications"][number], namespace: string, kubernete_cluster?: string }) {
  return {
    "name": app.name,
    "on": {
      "push": {
        "paths": [
          `${app.folder}/**`.replace(/^.\//, '')
        ]
      }
    },
    "env": {
      "APP_NAME": app.name,
      "IMAGE_NAME": app.image_name,
      "BUILD_FOLDER": app.folder,
      "IMAGE_URL": `registry.digitalocean.com/insidethesandbox/${app.image_name}`,
      "KUBERNETES_CLUSTER": kubernete_cluster,
      "KUBERNETES_NAMESPACE": namespace,
      "DIGITALOCEAN_ACCESS_TOKEN": "${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}"
    },
    "jobs": {
      "main": {
        "runs-on": "ubuntu-latest",
        "steps": [
          {
            "name": "Check Out",
            "uses": "actions/checkout@v2"
          },
          {
            "name": "Build image",
            "run": "docker build --tag $IMAGE_NAME $BUILD_FOLDER"
          },
          {
            "name": "Install Doctl",
            "uses": "digitalocean/action-doctl@v2",
            "with": {
              "token": "${{ env.DIGITALOCEAN_ACCESS_TOKEN }}"
            }
          },
          {
            "name": "Push Image",
            "run": "doctl registry login\ndocker tag $IMAGE_NAME $IMAGE_URL\ndocker push $IMAGE_URL\n"
          },
          {
            "name": "Doctl Config For Kubernetes",
            "run": "doctl kubernetes cluster kubeconfig save $KUBERNETES_CLUSTER\n"
          },
          {
            "name": "Restart Deployment",
            "run": "kubectl rollout restart deployment/$APP_NAME -n $KUBERNETES_NAMESPACE\n"
          }
        ]
      }
    }
  }
}
