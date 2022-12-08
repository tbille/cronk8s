import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { Breadcrumb, Layout, Table, Tag, Typography, Tooltip } from "antd";

const { Content } = Layout;

const { Title, Text } = Typography;

export default function CronJob() {
  const router = useRouter();
  const { cronjobName } = router.query;
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/cronjobs/${cronjobName}/jobs`);
      const data = await res.json();
      setData(data.reverse());
    };
    fetchData();
  }, [cronjobName]);

  const columns: ColumnsType<any> = [
    {
      title: "Name",
      dataIndex: "metadata",
      key: "metadata.name",
      render: (metadata: { name: string }) => <Text>{metadata.name}</Text>,
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
          return <Tag color="blue">Active</Tag>;
        }
      },
    },
  ];

  return (
    <Layout>
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
    </Layout>
  );
}
