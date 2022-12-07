// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {KubeConfig, BatchV1beta1Api} from '@kubernetes/client-node'
import type {V1CronJob} from '@kubernetes/client-node'

const kc = new KubeConfig()
kc.loadFromDefault()
const batchV1beta1Api = kc.makeApiClient(BatchV1beta1Api)

type Data = {
  cronjobs: string[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    let cronjobs: string[] = []

    const cronJobRes = await batchV1beta1Api.listNamespacedCronJob("production")
    cronJobRes.body.items.forEach(function(item: V1CronJob) {
        if(item.metadata?.name) {
            cronjobs.push(item.metadata.name)
        }
    })

    res.status(200).json({ cronjobs: cronjobs })
}
