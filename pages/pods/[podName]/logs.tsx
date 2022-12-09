import useSWR from "swr";
import stripAnsi from "strip-ansi";

import { useRouter } from "next/router";

import { Layout, Breadcrumb, Typography } from "antd";

const { Content } = Layout;
const { Text } = Typography;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Logs() {
  const router = useRouter();
  const { podName } = router.query;

  const { data, error } = useSWR(`/api/pods/${podName}/logs`, fetcher, {
    refreshInterval: 60000,
  });

  return (
    <Content style={{ padding: "2rem 5rem" }}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Cron Jobs</Breadcrumb.Item>
      </Breadcrumb>
      <div style={{ background: "#fff", padding: 24, minHeight: 280 }}>
        {data && (
          <Text>
            <pre>{stripAnsi(data)}</pre>
          </Text>
        )}
      </div>
    </Content>
  );
}
