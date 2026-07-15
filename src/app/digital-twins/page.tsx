"use client";
import { useState } from "react";
import { App, ConfigProvider, Layout, Tabs, Typography, Badge } from "antd";
import { ReadOutlined, SendOutlined, ProfileOutlined } from "@ant-design/icons";
import CallForSubmissions from "./CallForSubmissions";
import SubmitManuscript from "./SubmitManuscript";
import MySubmissions from "./MySubmissions";
import { useSubmissions } from "./store";
import { ISSUE } from "./data";

const { Header, Content, Footer } = Layout;
const { Text } = Typography;
const CRIMSON = "#A51C30";

function Portal() {
  const [tab, setTab] = useState("cfs");
  const { submissions } = useSubmissions();

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f5f7" }}>
      <Header
        style={{
          background: "#fff",
          borderBottom: "1px solid #eee",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          position: "sticky",
          top: 0,
          zIndex: 10,
          height: 60,
        }}
      >
        <div style={{ lineHeight: 1.15 }}>
          <Text strong style={{ fontSize: 16, color: CRIMSON, letterSpacing: 0.3 }}>
            Harvard Data Science Review
          </Text>
          <div>
            <Text type="secondary" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>
              Special Issue · Digital Twins
            </Text>
          </div>
        </div>
        <Text type="secondary" style={{ fontSize: 12 }}>Submission Portal</Text>
      </Header>

      <Content style={{ maxWidth: 1200, width: "100%", margin: "0 auto", padding: "20px 20px 40px" }}>
        <Tabs
          activeKey={tab}
          onChange={setTab}
          size="large"
          items={[
            {
              key: "cfs",
              label: <span><ReadOutlined /> Call for Submissions</span>,
              children: <CallForSubmissions onSubmit={() => setTab("submit")} />,
            },
            {
              key: "submit",
              label: <span><SendOutlined /> Submit</span>,
              children: <SubmitManuscript onDone={() => setTab("mine")} />,
            },
            {
              key: "mine",
              label: (
                <span>
                  <ProfileOutlined /> My Submissions{" "}
                  {submissions.length > 0 && <Badge count={submissions.length} color={CRIMSON} style={{ marginLeft: 4 }} />}
                </span>
              ),
              children: <MySubmissions onStartSubmission={() => setTab("submit")} />,
            },
          ]}
        />
      </Content>

      <Footer style={{ textAlign: "center", background: "transparent", color: "#888", fontSize: 12 }}>
        {ISSUE.journal} — Digital Twins Special Issue · Guest-edited call for submissions ·{" "}
        <a href={`mailto:${ISSUE.contactEmail}`} style={{ color: CRIMSON }}>{ISSUE.contactEmail}</a>
        <div style={{ marginTop: 4 }}>Demonstration portal — submissions are stored locally in your browser.</div>
      </Footer>
    </Layout>
  );
}

export default function DigitalTwinsPage() {
  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: CRIMSON, borderRadius: 8, fontSize: 14 },
      }}
    >
      <App>
        <Portal />
      </App>
    </ConfigProvider>
  );
}
