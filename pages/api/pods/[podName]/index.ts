import type { NextApiRequest, NextApiResponse } from 'next'
import {KubeConfig, CoreV1Api} from '@kubernetes/client-node'
import type {V1Pod} from '@kubernetes/client-node'

const kc = new KubeConfig();
kc.loadFromDefault();
const coreV1Api = kc.makeApiClient(CoreV1Api);

type Query = {
    podName: string
}

type Error = {
    error: string,
    statusCode: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<V1Pod | Error>
) {
    const { podName }: Query = req.query as Query

    try {
        const podRes = await coreV1Api.readNamespacedPod(podName, "production")
        res.status(200).json(podRes.body)
    }catch(error: any) {
        res.status(error.statusCode).json({
            error: error.body.message,
            statusCode: error.statusCode
        })
    }
}
