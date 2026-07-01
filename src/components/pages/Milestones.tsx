"use client";
import { Button, Card, Space, Table, Tag, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Title } = Typography;

const data = [
  { key: 1, milestone: "Architecture Design Complete", project: "AI Integration", due: "2025-07-15", status: "Complete" },
  { key: 2, milestone: "Pilot Deployment", project: "Digital Transformation", due: "2025-07-31", status: "On Track" },
  { key: 3, milestone: "Compliance Audit Submission", project: "Compliance 2025", due: "2025-08-01", status: "At Risk" },
  { key: 4, milestone: "Network Infrastructure Cutover", project: "Infra Modernization", due: "2025-09-01", status: "Behind" },
  { key: 5, milestone: "Executive Review Gate", project: "AI Integration", due: "2025-09-15", status: "On Track" },
];

const statusColor: Record<string, string> = { Complete: "green", "On Track": "blue", "At Risk": "orange", Behind: "red" };

const columns = [
  { title: "Milestone", dataIndex: "milestone", key: "milestone" },
  { title: "Project", dataIndex: "project", key: "project" },
  { title: "Due Date", dataIndex: "due", key: "due" },
  { title: "Status", dataIndex: "status", key: "status", render: (s: string) => <Tag color={statusColor[s]}>{s}</Tag> },
];

export default function Milestones() {
  return (
    <div>
      <Space style={{ width: "100%", justifyContent: "space-between", marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>Milestones</Title>
        <Button type="primary" icon={<PlusOutlined />}>Add Milestone</Button>
      </Space>
      <Card>
        <Table dataSource={data} columns={columns} size="small" />
      </Card>
    </div>
  );
}
