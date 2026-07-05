"use client";
import { useState } from "react";
import { Button, Card, DatePicker, Form, Input, InputNumber, Modal, Select, Space, Table, Tag, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Title } = Typography;

type Project = {
  key: number;
  name: string;
  pm: string;
  start: string;
  end: string;
  status: string;
  budget: string;
};

const INITIAL: Project[] = [
  { key: 1, name: "Digital Transformation", pm: "J. Smith", start: "2025-01-15", end: "2025-12-31", status: "On Track", budget: "$1.2M" },
  { key: 2, name: "Infrastructure Modernization", pm: "A. Patel", start: "2025-03-01", end: "2025-09-30", status: "At Risk", budget: "$800K" },
  { key: 3, name: "Compliance 2025", pm: "M. Chen", start: "2025-01-01", end: "2025-06-30", status: "On Track", budget: "$450K" },
  { key: 4, name: "AI Integration Program", pm: "R. Davis", start: "2025-04-01", end: "2026-03-31", status: "Behind", budget: "$2.1M" },
  { key: 5, name: "HDSR (Harvard Data Science Review)", pm: "L. Cohen", start: "2026-01-01", end: "2026-12-31", status: "On Track", budget: "$350K" },
];

const statusColor: Record<string, string> = { "On Track": "green", "At Risk": "orange", "Behind": "red" };

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(INITIAL);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  function handleAdd(values: {
    name: string;
    pm: string;
    dates: [dayjs.Dayjs, dayjs.Dayjs];
    status: string;
    budget: number;
  }) {
    const next: Project = {
      key: Date.now(),
      name: values.name,
      pm: values.pm,
      start: values.dates[0].format("YYYY-MM-DD"),
      end: values.dates[1].format("YYYY-MM-DD"),
      status: values.status,
      budget: `$${(values.budget / 1000).toFixed(0)}K`,
    };
    setProjects((prev) => [...prev, next]);
    form.resetFields();
    setOpen(false);
  }

  const columns = [
    { title: "Project Name", dataIndex: "name", key: "name" },
    { title: "PM", dataIndex: "pm", key: "pm" },
    { title: "Start", dataIndex: "start", key: "start" },
    { title: "End", dataIndex: "end", key: "end" },
    { title: "Budget", dataIndex: "budget", key: "budget" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s: string) => <Tag color={statusColor[s]}>{s}</Tag>,
    },
  ];

  return (
    <div>
      <Space style={{ width: "100%", justifyContent: "space-between", marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>Projects</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
          New Project
        </Button>
      </Space>

      <Card>
        <Table dataSource={projects} columns={columns} size="small" />
      </Card>

      <Modal
        title="New Project"
        open={open}
        onCancel={() => { form.resetFields(); setOpen(false); }}
        onOk={() => form.submit()}
        okText="Create Project"
        width={520}
      >
        <Form form={form} layout="vertical" onFinish={handleAdd} style={{ marginTop: 16 }}>
          <Form.Item label="Project Name" name="name" rules={[{ required: true, message: "Required" }]}>
            <Input placeholder="e.g. Cloud Migration Phase 2" />
          </Form.Item>
          <Form.Item label="Project Manager" name="pm" rules={[{ required: true, message: "Required" }]}>
            <Input placeholder="e.g. J. Smith" />
          </Form.Item>
          <Form.Item label="Start & End Date" name="dates" rules={[{ required: true, message: "Required" }]}>
            <DatePicker.RangePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Budget (USD)" name="budget" rules={[{ required: true, message: "Required" }]}>
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              step={10000}
              formatter={(v) => `$ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(v) => (Number(v?.replace(/\$\s?|(,*)/g, "") ?? 0) as 0)}
              placeholder="e.g. 500000"
            />
          </Form.Item>
          <Form.Item label="Initial Status" name="status" initialValue="On Track" rules={[{ required: true }]}>
            <Select options={[
              { value: "On Track", label: "On Track" },
              { value: "At Risk", label: "At Risk" },
              { value: "Behind", label: "Behind" },
            ]} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
