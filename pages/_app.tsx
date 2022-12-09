import "../styles/globals.css";
import type { AppProps } from "next/app";
import Link from "next/link";

import { Layout, Menu } from "antd";

const { Header } = Layout;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Header>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "cronjobs",
              label: <Link href="/">CronJobs</Link>,
            },
          ]}
        />
      </Header>
      <Component {...pageProps} />
    </Layout>
  );
}
