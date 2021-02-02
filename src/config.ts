import * as path from 'path'
import { array, defaulted, number, object, record, string, create, dynamic, optional, any } from 'superstruct'
import type { Infer } from 'superstruct'
import { merge } from 'lodash'

export const config_schema = object({
  digitalocean: object({
    access_token: string(),
  }),
  kubernetes: object({
    cluster: optional(string()),
    namespace: string(),
  }),
  cloudflare: object({
    crt: string(),
    key: string(),
  }),
  applications: array(
    object({
      name: string(),
      host: string(),
      folder: string(),
      image_name: string(), // auto generate
      image_url: string(), // auto generate
      port: number(),
      env: defaulted(record(string(), string()), {})
    })
  )
})

export const check_config = (u: unknown) => create(u, config_schema)

export type Config = Infer<typeof config_schema>

export async function load_insidethesandbox_config(relative_config_path = './insidethesandbox.config.mjs') {
  const config_path = path.join(process.cwd(), relative_config_path)
  const raw_config = (await import(config_path)).default;
  const raw_config2 = merge(raw_config, {
    applications: raw_config.applications.map((a: any) => {
      const image_name = a.image_name || `${raw_config.kubernetes.namespace}-${a.name}`;
      const image_url = a.image_url || `registry.digitalocean.com/insidethesandbox/${image_name}`
      return { image_name, image_url }
    })
  })
  const config = check_config(raw_config2)
  return config
}