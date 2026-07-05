"use client";
import { Button, Card, List, Space, Tag, Typography } from "antd";
import { FileTextOutlined, PlusOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const docs = [
  { title: "Program Charter v2.1", project: "Digital Transformation", updated: "2025-06-20", type: "Charter" },
  { title: "Risk Management Plan", project: "All Programs", updated: "2025-06-15", type: "Plan" },
  { title: "Architecture Decision Record #12", project: "AI Integration", updated: "2025-06-10", type: "ADR" },
  { title: "Compliance Gap Assessment", project: "Compliance 2025", updated: "2025-05-28", type: "Report" },
  { title: "Stage Gate 2 Review Package", project: "Infra Modernization", updated: "2025-05-15", type: "Review" },
  { title: "HDSR Program Charter", project: "HDSR", updated: "2026-06-30", type: "Charter" },
];

const typeColor: Record<string, string> = { Charter: "blue", Plan: "green", ADR: "purple", Report: "orange", Review: "cyan" };

export default function Documents() {
  return (
    <div>
      <Space style={{ width: "100%", justifyContent: "space-between", marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>Document Library</Title>
        <Button type="primary" icon={<PlusOutlined />}>Upload</Button>
      </Space>
      <Card>
        <List
          dataSource={docs}
          renderItem={(item) => (
            <List.Item actions={[<Tag color={typeColor[item.type]} key="type">{item.type}</Tag>]}>
              <List.Item.Meta
                avatar={<FileTextOutlined style={{ fontSize: 20, color: "#1677ff" }} />}
                title={<a href="#">{item.title}</a>}
                description={<Text type="secondary">{item.project} · Updated {item.updated}</Text>}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
