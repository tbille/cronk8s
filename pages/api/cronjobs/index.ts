// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {KubeConfig, BatchV1beta1Api} from '@kubernetes/client-node'
import type {V1beta1CronJobList} from '@kubernetes/client-node'

const kc = new KubeConfig()
kc.loadFromDefault()
const batchV1beta1Api = kc.makeApiClient(BatchV1beta1Api)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<V1beta1CronJobList>
) {
    let cronjobs: string[] = []

    const cronJobRes = await batchV1beta1Api.listNamespacedCronJob("production")
    res.status(200).json(cronJobRes.body)
}
