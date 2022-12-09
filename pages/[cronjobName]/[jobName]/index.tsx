import useSWR from "swr";
import { useRouter } from "next/router";
import Link from "next/link";

import { Breadcrumb, Layout, Table, Tag, Typography } from "antd";

const { Content } = Layout;

const { Text } = Typography;

const fetcher = async (url: string) => {
  const res = await fetch(url);
  let data = await res.json();
  data = data.map((item: any) => {
    item.key = item.metadata.uid;
    return item;
  });

  return data;
};

export default function Pod() {
  const router = useRouter();
  const { cronjobName, jobName } = router.query;

  let url = `/api/pods`;
  if (jobName) {
    url = `${url}?filter=${jobName}`;
  }

  const { data, error } = useSWR(url, fetcher, {
    refreshInterval: 60000,
  });

  const columns: ColumnsType<any> = [
    {
      title: "Pod Name",
      dataIndex: "metadata",
      key: "metadata.name",
      render: (metadata: { name: string }) => (
        <Link href={`/pods/${metadata.name}/logs`}>
          <Text>{metadata.name}</Text>
        </Link>
      ),
    },
    {
      title: "Created",
      dataIndex: "metadata",
      key: "metadata.creationTimestamp",
      render: (metadata: { creationTimestamp: string }) => (
        <Text>{metadata.creationTimestamp}</Text>
      ),
    },
    {
      title: "Host IP",
      dataIndex: "status",
      key: "status.hostIP",
      render: (status: { hostIP: string }) => <Text>{status.hostIP}</Text>,
    },
    {
      title: "Pod IP",
      dataIndex: "status",
      key: "status.podIP",
      render: (status: { podIP: string }) => <Text>{status.podIP}</Text>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status.phase",
      render: (status: { phase: string }) => {
        if (status.phase === "Failed") {
          return <Tag color="red">{status.phase}</Tag>;
        }

        if (status.phase === "Succeeded") {
          return <Tag color="green">{status.phase}</Tag>;
        }
        if (status.phase === "Running") {
          return <Tag color="blue">{status.phase}</Tag>;
        }
      },
    },
  ];

  return (
    <Content style={{ padding: "2rem 5rem" }}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>
          <Link href="/">Cron Jobs</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href={`/${cronjobName}`}>{cronjobName}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{jobName}</Breadcrumb.Item>
      </Breadcrumb>
      <div style={{ background: "#fff", padding: 24, minHeight: 280 }}>
        {data && <Table columns={columns} dataSource={data} />}
      </div>
    </Content>
  );
}
