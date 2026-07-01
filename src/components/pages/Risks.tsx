"use client";
import { Button, Card, Space, Table, Tag, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Title } = Typography;

const data = [
  { key: 1, id: "R-001", title: "Vendor delay on infrastructure components", project: "Infra Modernization", type: "Risk", probability: "High", impact: "High", status: "Open", owner: "A. Patel" },
  { key: 2, id: "R-002", title: "Resource availability for Q3 deliverables", project: "Digital Transformation", type: "Risk", probability: "Medium", impact: "High", status: "Mitigating", owner: "J. Smith" },
  { key: 3, id: "I-001", title: "Legacy API authentication failure", project: "AI Integration", type: "Issue", probability: "—", impact: "High", status: "Open", owner: "R. Davis" },
  { key: 4, id: "A-001", title: "Security architecture review board approval", project: "Compliance 2025", type: "Action", probability: "—", impact: "Medium", status: "Closed", owner: "M. Chen" },
];

const impactColor: Record<string, string> = { High: "red", Medium: "orange", Low: "green", "—": "default" };
const typeColor: Record<string, string> = { Risk: "volcano", Issue: "red", Action: "blue", Decision: "purple" };
const statusColor: Record<string, string> = { Open: "red", Mitigating: "orange", Closed: "green" };

const columns = [
  { title: "ID", dataIndex: "id", key: "id", width: 80 },
  { title: "Title", dataIndex: "title", key: "title" },
  { title: "Project", dataIndex: "project", key: "project" },
  { title: "Type", dataIndex: "type", key: "type", render: (t: string) => <Tag color={typeColor[t]}>{t}</Tag> },
  { title: "Probability", dataIndex: "probability", key: "probability" },
  { title: "Impact", dataIndex: "impact", key: "impact", render: (v: string) => <Tag color={impactColor[v]}>{v}</Tag> },
  { title: "Status", dataIndex: "status", key: "status", render: (s: string) => <Tag color={statusColor[s]}>{s}</Tag> },
  { title: "Owner", dataIndex: "owner", key: "owner" },
];

export default function Risks() {
  return (
    <div>
      <Space style={{ width: "100%", justifyContent: "space-between", marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>RAID Log</Title>
        <Button type="primary" icon={<PlusOutlined />}>Add Entry</Button>
      </Space>
      <Card>
        <Table dataSource={data} columns={columns} size="small" />
      </Card>
    </div>
  );
}
