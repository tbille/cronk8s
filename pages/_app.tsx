import "../styles/globals.css";
import type { AppProps } from "next/app";
import Link from "next/link";
import Image from "next/image";

import { Layout, Menu } from "antd";

const { Header } = Layout;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Header className="header">
        <div className="logo" style={{ float: "left", marginTop: "7px" }}>
          <Image
            src="/cronk8s-wordmark-white.svg"
            alt="CronK8s logo"
            width={180}
            height={50}
            style={{ float: "left" }}
          />
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "cronjobs",
              label: <Link href="/">Cron Jobs</Link>,
            },
          ]}
        />
      </Header>
      <Component {...pageProps} />
    </Layout>
  );
}
