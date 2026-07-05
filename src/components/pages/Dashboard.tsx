"use client";
import { Card, Col, Row, Statistic, Table, Tag, Progress, Typography } from "antd";
import { ProjectOutlined, WarningOutlined, CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";

const { Title } = Typography;

const recentProjects = [
  { key: 1, name: "Digital Transformation", status: "On Track", health: 82, phase: "Execution" },
  { key: 2, name: "Infrastructure Modernization", status: "At Risk", health: 54, phase: "Planning" },
  { key: 3, name: "Compliance 2025", status: "On Track", health: 91, phase: "Monitoring" },
  { key: 4, name: "AI Integration Program", status: "Behind", health: 38, phase: "Initiation" },
  { key: 5, name: "HDSR (Harvard Data Science Review)", status: "On Track", health: 88, phase: "Execution" },
];

const statusColor: Record<string, string> = { "On Track": "green", "At Risk": "orange", "Behind": "red" };

const columns = [
  { title: "Project", dataIndex: "name", key: "name" },
  { title: "Phase", dataIndex: "phase", key: "phase" },
  { title: "Health", dataIndex: "health", key: "health", render: (v: number) => <Progress percent={v} size="small" strokeColor={v >= 70 ? "#52c41a" : v >= 50 ? "#faad14" : "#ff4d4f"} /> },
  { title: "Status", dataIndex: "status", key: "status", render: (s: string) => <Tag color={statusColor[s]}>{s}</Tag> },
];

export default function Dashboard() {
  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>Program Overview</Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Active Projects" value={13} prefix={<ProjectOutlined />} valueStyle={{ color: "#1677ff" }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Open Risks" value={8} prefix={<WarningOutlined />} valueStyle={{ color: "#faad14" }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Milestones This Month" value={4} prefix={<ClockCircleOutlined />} valueStyle={{ color: "#722ed1" }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Gates Passed" value={9} suffix="/ 11" prefix={<CheckCircleOutlined />} valueStyle={{ color: "#52c41a" }} /></Card>
        </Col>
      </Row>
      <Card title="Recent Projects">
        <Table dataSource={recentProjects} columns={columns} pagination={false} size="small" />
      </Card>
    </div>
  );
}
