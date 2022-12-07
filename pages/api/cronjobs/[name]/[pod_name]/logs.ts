import type { NextApiRequest, NextApiResponse } from 'next'
import {KubeConfig, CoreV1Api} from '@kubernetes/client-node'

const kc = new KubeConfig();
kc.loadFromDefault();
const coreV1Api = kc.makeApiClient(CoreV1Api);

type Query = {
  name: string
  pod_name: string
}

type Error = {
    error: string,
    statusCode: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string | Error>
) {
    const { name, pod_name }: Query = req.query as Query

    try {
        const cronJobRes = await coreV1Api.readNamespacedPodLog(
            pod_name, 
            "production"
        )
        res.status(200).json(cronJobRes.body)
    }catch(error: any) {
        res.status(error.statusCode).json({
            error: error.body.message,
            statusCode: error.statusCode
        })
    }
}
