import type { NextApiRequest, NextApiResponse } from 'next'
import {KubeConfig, BatchV1Api, V1Job, V1OwnerReference} from '@kubernetes/client-node'

const kc = new KubeConfig();
kc.loadFromDefault();
const batchV1Api = kc.makeApiClient(BatchV1Api);

type Query = {
  name: string
}

type Error = {
    error: string,
    statusCode: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<V1Job[] | Error>
) {
    const { name }: Query = req.query as Query

    try {
        let jobs: V1Job[] = []

        const cronJobRes = await batchV1Api.listNamespacedJob("production")
        cronJobRes.body.items.forEach((job: V1Job) => {
            job.metadata?.ownerReferences?.forEach((ownerReference: V1OwnerReference) => {
                if(ownerReference.name === name) {
                    jobs.push(job)
                }
            })
        })
        res.status(200).json(jobs)
    }catch(error: any) {
        res.status(error.statusCode).json({
            error: error.body.message,
            statusCode: error.statusCode
        })
    }
}