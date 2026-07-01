"use client";
import { Card, Col, Row, Statistic, Table, Tag, Typography } from "antd";

const { Title } = Typography;

const portfolioHealth = [
  { key: 1, project: "Digital Transformation", budget: "$1.2M", spent: "$680K", schedule: "On Track", scope: "Stable" },
  { key: 2, project: "Infrastructure Modernization", budget: "$800K", spent: "$510K", schedule: "At Risk", scope: "Change Pending" },
  { key: 3, project: "Compliance 2025", budget: "$450K", spent: "$390K", schedule: "On Track", scope: "Stable" },
  { key: 4, project: "AI Integration Program", budget: "$2.1M", spent: "$320K", schedule: "Behind", scope: "Expanding" },
];

const statusColor: Record<string, string> = { "On Track": "green", "At Risk": "orange", "Behind": "red", "Stable": "blue", "Change Pending": "orange", "Expanding": "purple" };

const columns = [
  { title: "Project", dataIndex: "project", key: "project" },
  { title: "Budget", dataIndex: "budget", key: "budget" },
  { title: "Spent", dataIndex: "spent", key: "spent" },
  { title: "Schedule", dataIndex: "schedule", key: "schedule", render: (s: string) => <Tag color={statusColor[s]}>{s}</Tag> },
  { title: "Scope", dataIndex: "scope", key: "scope", render: (s: string) => <Tag color={statusColor[s]}>{s}</Tag> },
];

export default function Reports() {
  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>Portfolio Health Report</Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card><Statistic title="Total Portfolio Budget" value="$4.55M" /></Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card><Statistic title="Total Spend to Date" value="$1.9M" suffix="(42%)" /></Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card><Statistic title="Projects On Track" value={2} suffix="/ 4" valueStyle={{ color: "#52c41a" }} /></Card>
        </Col>
      </Row>
      <Card title="Program Status Summary (RAG)">
        <Table dataSource={portfolioHealth} columns={columns} pagination={false} size="small" />
      </Card>
    </div>
  );
}
