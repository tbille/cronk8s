import useSWR from "swr";
import Link from "next/link";
import { Breadcrumb, Layout, Table, Tag, Typography, Tooltip } from "antd";
import { PlaySquareTwoTone } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

import parser from "cron-parser";

const { Content } = Layout;

const { Text } = Typography;

interface ICronJobStatus {
  lastScheduleTime: string;
  active?: any[];
}

interface ICronJob {
  key?: string;
  metadata: {
    annotations: any;
    creationTimestamp: string;
    name: string;
    namespace: string;
    resourceVersion: string;
    selfLink: string;
    uid: string;
  };
  spec: {
    concurrencyPolicy: string;
    failedJobsHistoryLimit: number;
    jobTemplate: any;
    schedule: string;
    successfulJobsHistoryLimit: number;
    suspend: boolean;
  };
  status: ICronJobStatus;
}

interface ICronJobs {
  apiVersion: string;
  items: ICronJob[];
  kind: string;
  metadata: {
    resourceVersion: string;
    selfLink: string;
  };
}

const fetcher = async () => {
  const res = await fetch("/api/cronjobs");
  let data = await res.json();
  data.items = data.items.map((item: ICronJob) => {
    item.key = item.metadata.uid;
    return item;
  });

  return data;
};

export default function Home() {
  const { data, error } = useSWR<ICronJobs>("/api/cronjobs", fetcher, {
    refreshInterval: 60000,
  });

  const columns: ColumnsType<ICronJob> = [
    {
      title: "",
      dataIndex: "status",
      key: "status",
      render: (status: ICronJobStatus) => {
        return (
          status.active && (
            <Tooltip placement="right" title="Running">
              <PlaySquareTwoTone twoToneColor="#52c41a" />
            </Tooltip>
          )
        );
      },
      width: 50,
    },
    {
      title: "Name",
      dataIndex: "metadata",
      key: "metadata.name",
      render: (metadata: { name: string }) => (
        <Link href={`/${metadata.name}`}>
          <Text>{metadata.name}</Text>
        </Link>
      ),
    },
    {
      title: "Status",
      dataIndex: "spec",
      key: "spec.suspend",
      render: (spec: { suspend: boolean }) => (
        <Tag color={spec.suspend ? "red" : "green"}>
          {spec.suspend ? "Disabled" : "Enabled"}
        </Tag>
      ),
    },
    {
      title: "Next run",
      dataIndex: "spec",
      key: "spec.schedule",
      render: (spec: { schedule: string }) => {
        const interval = parser.parseExpression(spec.schedule);
        return <Text>{interval.next().toString()}</Text>;
      },
    },
  ];

  return (
    <Content style={{ padding: "2rem 5rem" }}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Cron Jobs</Breadcrumb.Item>
      </Breadcrumb>
      <div style={{ background: "#fff", padding: 24, minHeight: 280 }}>
        {data && <Table columns={columns} dataSource={data.items} />}
      </div>
    </Content>
  );
}
