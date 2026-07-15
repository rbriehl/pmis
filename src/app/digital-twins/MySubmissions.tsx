"use client";
import { useState } from "react";
import {
  App,
  Button,
  Card,
  Col,
  Drawer,
  Empty,
  Popconfirm,
  Row,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import type { TableProps } from "antd";
import { ArrowRightOutlined, FileTextOutlined } from "@ant-design/icons";
import {
  STATUS_COLOR,
  TOPIC_LABEL,
  type Submission,
  type SubmissionStatus,
} from "./data";
import { useSubmissions } from "./store";

const { Title, Paragraph, Text, Link } = Typography;
const CRIMSON = "#A51C30";

function fmt(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MySubmissions({ onStartSubmission }: { onStartSubmission: () => void }) {
  const { submissions, setStatus, remove } = useSubmissions();
  const { message } = App.useApp();
  const [active, setActive] = useState<Submission | null>(null);

  const activeCount = submissions.filter(
    (s) => !["Withdrawn", "Rejected"].includes(s.status),
  ).length;
  const acceptedCount = submissions.filter((s) => s.status === "Accepted").length;

  const columns: TableProps<Submission>["columns"] = [
    {
      title: "Manuscript ID",
      dataIndex: "manuscriptId",
      key: "manuscriptId",
      render: (id: string, row) => (
        <Link onClick={() => setActive(row)} style={{ color: CRIMSON, fontWeight: 600 }}>
          {id}
        </Link>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (t: string, row) => (
        <a onClick={() => setActive(row)} style={{ color: "inherit" }}>{t}</a>
      ),
    },
    {
      title: "Topics",
      dataIndex: "topics",
      key: "topics",
      render: (topics: string[]) => (
        <Space size={[4, 4]} wrap>
          {topics.map((id) => (
            <Tag key={id} style={{ maxWidth: 160 }}>
              <span style={{ display: "inline-block", maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", verticalAlign: "bottom" }}>
                {TOPIC_LABEL[id] ?? id}
              </span>
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s: SubmissionStatus) => <Tag color={STATUS_COLOR[s]}>{s}</Tag>,
      filters: (Object.keys(STATUS_COLOR) as SubmissionStatus[]).map((s) => ({ text: s, value: s })),
      onFilter: (value, row) => row.status === value,
    },
    {
      title: "Submitted",
      dataIndex: "submittedAt",
      key: "submittedAt",
      render: (iso: string) => <Text type="secondary" style={{ fontSize: 12 }}>{fmt(iso)}</Text>,
      sorter: (a, b) => a.submittedAt.localeCompare(b.submittedAt),
      defaultSortOrder: "descend",
    },
    {
      title: "",
      key: "actions",
      render: (_, row) =>
        ["Withdrawn", "Rejected", "Accepted"].includes(row.status) ? null : (
          <Popconfirm
            title="Withdraw this submission?"
            description="It will be marked withdrawn. This cannot be undone from here."
            okText="Withdraw"
            okButtonProps={{ danger: true }}
            onConfirm={() => {
              setStatus(row.id, "Withdrawn");
              message.info(`${row.manuscriptId} withdrawn`);
            }}
          >
            <Button type="text" size="small" danger>Withdraw</Button>
          </Popconfirm>
        ),
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <Title level={3} style={{ marginBottom: 4 }}>My submissions</Title>
          <Paragraph type="secondary" style={{ marginBottom: 0 }}>
            Manuscripts you have submitted to the Digital Twins special issue, saved in this browser.
          </Paragraph>
        </div>
        <Button type="primary" style={{ background: CRIMSON }} onClick={onStartSubmission}>
          New submission <ArrowRightOutlined />
        </Button>
      </div>

      <Row gutter={[16, 16]} style={{ margin: "20px 0 4px" }}>
        <Col xs={12} md={8}><Card size="small"><Statistic title="Total" value={submissions.length} /></Card></Col>
        <Col xs={12} md={8}><Card size="small"><Statistic title="Active in review" value={activeCount} valueStyle={{ color: CRIMSON }} /></Card></Col>
        <Col xs={12} md={8}><Card size="small"><Statistic title="Accepted" value={acceptedCount} valueStyle={{ color: "#389e0d" }} /></Card></Col>
      </Row>

      <Card style={{ marginTop: 16 }} styles={{ body: { padding: submissions.length ? 0 : 24 } }}>
        {submissions.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No submissions yet"
          >
            <Button type="primary" style={{ background: CRIMSON }} onClick={onStartSubmission}>
              Submit your first manuscript
            </Button>
          </Empty>
        ) : (
          <Table
            rowKey="id"
            dataSource={submissions}
            columns={columns}
            size="middle"
            pagination={submissions.length > 8 ? { pageSize: 8 } : false}
          />
        )}
      </Card>

      <Drawer
        title={active?.manuscriptId}
        width={Math.min(560, typeof window !== "undefined" ? window.innerWidth : 560)}
        open={!!active}
        onClose={() => setActive(null)}
        extra={active && <Tag color={STATUS_COLOR[active.status]}>{active.status}</Tag>}
      >
        {active && (
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <div>
              <Text type="secondary" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 0.6 }}>Title</Text>
              <div><Text strong style={{ fontSize: 16 }}>{active.title}</Text></div>
            </div>

            <div>
              <Text type="secondary" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 0.6 }}>Authors</Text>
              <Space direction="vertical" size={2} style={{ width: "100%", marginTop: 4 }}>
                {active.authors.map((a, i) => (
                  <Text key={i}>
                    {a.name} <Text type="secondary">· {a.affiliation}</Text>{" "}
                    {a.corresponding && <Tag color={CRIMSON} style={{ marginLeft: 4 }}>Corresponding</Tag>}
                  </Text>
                ))}
              </Space>
            </div>

            <div>
              <Text type="secondary" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 0.6 }}>Topic areas</Text>
              <div style={{ marginTop: 4 }}>
                <Space size={[4, 4]} wrap>
                  {active.topics.map((id) => <Tag key={id}>{TOPIC_LABEL[id] ?? id}</Tag>)}
                </Space>
              </div>
            </div>

            <div>
              <Text type="secondary" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 0.6 }}>Abstract</Text>
              <Paragraph style={{ marginTop: 4, whiteSpace: "pre-wrap" }}>{active.abstract}</Paragraph>
            </div>

            {active.keywords.length > 0 && (
              <div>
                <Text type="secondary" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 0.6 }}>Keywords</Text>
                <div style={{ marginTop: 4 }}>
                  <Space size={[4, 4]} wrap>{active.keywords.map((k) => <Tag key={k}>{k}</Tag>)}</Space>
                </div>
              </div>
            )}

            <div>
              <Text type="secondary" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 0.6 }}>Manuscript</Text>
              <div style={{ marginTop: 4 }}>
                <Link href={active.manuscriptUrl} target="_blank" rel="noreferrer" style={{ color: CRIMSON }}>
                  <FileTextOutlined /> {active.manuscriptUrl}
                </Link>
              </div>
            </div>

            {active.coverLetter && (
              <div>
                <Text type="secondary" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 0.6 }}>Cover letter</Text>
                <Paragraph style={{ marginTop: 4, whiteSpace: "pre-wrap" }}>{active.coverLetter}</Paragraph>
              </div>
            )}

            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Submitted {fmt(active.submittedAt)} · Updated {fmt(active.updatedAt)}
              </Text>
            </div>

            {!["Withdrawn", "Rejected", "Accepted"].includes(active.status) && (
              <Space wrap>
                <Popconfirm
                  title="Withdraw this submission?"
                  okText="Withdraw"
                  okButtonProps={{ danger: true }}
                  onConfirm={() => {
                    setStatus(active.id, "Withdrawn");
                    message.info(`${active.manuscriptId} withdrawn`);
                    setActive(null);
                  }}
                >
                  <Button danger>Withdraw submission</Button>
                </Popconfirm>
                <Popconfirm
                  title="Permanently delete this record?"
                  description="Removes it from this browser entirely."
                  okText="Delete"
                  okButtonProps={{ danger: true }}
                  onConfirm={() => {
                    remove(active.id);
                    message.success("Record deleted");
                    setActive(null);
                  }}
                >
                  <Button type="text" danger>Delete record</Button>
                </Popconfirm>
              </Space>
            )}
          </Space>
        )}
      </Drawer>
    </div>
  );
}
