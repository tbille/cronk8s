import type { NextApiRequest, NextApiResponse } from 'next'
import {KubeConfig, BatchV1beta1Api} from '@kubernetes/client-node'

const kc = new KubeConfig();
kc.loadFromDefault();
const batchV1beta1Api = kc.makeApiClient(BatchV1beta1Api);

type Query = {
  name: string
}

type Data = {
    name: string
}

type Error = {
    error: string,
    statusCode: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) {
    const { name }: Query = req.query as Query

    try {
        const cronJobRes = await batchV1beta1Api.readNamespacedCronJob(name, "production")

        let nameRes: string = ""
        if(cronJobRes.body.metadata?.name) {
            nameRes = cronJobRes.body.metadata.name
        }
        res.status(200).json({ name: nameRes })
    }catch(error: any) {
        res.status(error.statusCode).json({
            error: error.body.message,
            statusCode: error.statusCode
        })
    }
}
