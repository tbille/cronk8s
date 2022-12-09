import useSWR from "swr";
import { useRouter } from "next/router";
import Link from "next/link";

import { formatDistanceStrict, parseISO } from "date-fns";

import { Breadcrumb, Layout, Table, Tag, Typography } from "antd";

const { Content } = Layout;

const { Title, Text } = Typography;

const fetcher = async (cronjobName: string) => {
  const res = await fetch(`/api/cronjobs/${cronjobName}/jobs`);
  let data = await res.json();
  data = data.map((job: any) => {
    job.key = job.metadata.uid;
    return job;
  });

  return data.reverse();
};

export default function CronJob() {
  const router = useRouter();
  const { cronjobName } = router.query;

  const { data, error } = useSWR(cronjobName, fetcher, {
    refreshInterval: 60000,
  });

  const columns: ColumnsType<any> = [
    {
      title: "Name",
      dataIndex: "metadata",
      key: "metadata.name",
      render: (metadata: { name: string }) => (
        <Link href={`/${cronjobName}/${metadata.name}`}>
          <Text>{metadata.name}</Text>
        </Link>
      ),
    },
    {
      title: "Started",
      dataIndex: "status",
      key: "status.startTime",
      render: (status: { startTime: string }) => (
        <Text>{status.startTime}</Text>
      ),
    },
    {
      title: "Completed",
      dataIndex: "status",
      key: "status.completionTime",
      render: (status: { completionTime: string }) => (
        <Text>{status.completionTime}</Text>
      ),
    },
    {
      title: "Execution Time",
      dataIndex: "status",
      key: "status.executionTime",
      render: (status: {
        startTime: string;
        completionTime: string;
        failed?: string;
      }) =>
        status.startTime &&
        !status.failed && (
          <Text>
            {formatDistanceStrict(
              status.completionTime
                ? parseISO(status.completionTime)
                : new Date(),
              parseISO(status.startTime)
            )}
          </Text>
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: {
        succeeded?: boolean;
        failed?: boolean;
        active?: boolean;
      }) => {
        if (status.failed) {
          return <Tag color="red">Failed</Tag>;
        }

        if (status.succeeded) {
          return <Tag color="green">Succeeded</Tag>;
        }

        if (status.active) {
          return <Tag color="blue">Running</Tag>;
        }
      },
    },
  ];

  return (
    <Content style={{ padding: "2rem 5rem" }}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>
          <Link href="/">Cronjobs</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{cronjobName}</Breadcrumb.Item>
      </Breadcrumb>
      <div style={{ background: "#fff", padding: 24, minHeight: 280 }}>
        <Title>{cronjobName}</Title>
        <Title level={2}>Jobs</Title>
        {data && <Table columns={columns} dataSource={data} />}
      </div>
    </Content>
  );
}
