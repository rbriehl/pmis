"use client";
import { Button, Card, Space, Table, Tag, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Title } = Typography;

const data = [
  { key: 1, name: "Digital Transformation", pm: "J. Smith", start: "2025-01-15", end: "2025-12-31", status: "On Track", budget: "$1.2M" },
  { key: 2, name: "Infrastructure Modernization", pm: "A. Patel", start: "2025-03-01", end: "2025-09-30", status: "At Risk", budget: "$800K" },
  { key: 3, name: "Compliance 2025", pm: "M. Chen", start: "2025-01-01", end: "2025-06-30", status: "On Track", budget: "$450K" },
  { key: 4, name: "AI Integration Program", pm: "R. Davis", start: "2025-04-01", end: "2026-03-31", status: "Behind", budget: "$2.1M" },
];

const statusColor: Record<string, string> = { "On Track": "green", "At Risk": "orange", "Behind": "red" };

const columns = [
  { title: "Project Name", dataIndex: "name", key: "name" },
  { title: "PM", dataIndex: "pm", key: "pm" },
  { title: "Start", dataIndex: "start", key: "start" },
  { title: "End", dataIndex: "end", key: "end" },
  { title: "Budget", dataIndex: "budget", key: "budget" },
  { title: "Status", dataIndex: "status", key: "status", render: (s: string) => <Tag color={statusColor[s]}>{s}</Tag> },
];

export default function Projects() {
  return (
    <div>
      <Space style={{ width: "100%", justifyContent: "space-between", marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>Projects</Title>
        <Button type="primary" icon={<PlusOutlined />}>New Project</Button>
      </Space>
      <Card>
        <Table dataSource={data} columns={columns} size="small" />
      </Card>
    </div>
  );
}
