"use client";
import { Card, Col, Row, Typography, Tag, Space, Divider, Button } from "antd";
import {
  CalendarOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  MailOutlined,
  FileTextOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import Countdown from "./Countdown";
import {
  ISSUE,
  OVERVIEW,
  TOPICS,
  GUEST_EDITORS,
  CRITERIA,
  KEY_DATES,
} from "./data";

const { Title, Paragraph, Text, Link } = Typography;

const CRIMSON = "#A51C30";

export default function CallForSubmissions({ onSubmit }: { onSubmit: () => void }) {
  return (
    <div>
      {/* Hero */}
      <div
        style={{
          background: `linear-gradient(135deg, ${CRIMSON} 0%, #6f0f22 100%)`,
          borderRadius: 16,
          padding: "36px 36px 32px",
          color: "#fff",
          marginBottom: 24,
        }}
      >
        <Text style={{ color: "rgba(255,255,255,0.85)", textTransform: "uppercase", letterSpacing: 1.5, fontSize: 12, fontWeight: 600 }}>
          {ISSUE.journal} · {ISSUE.kicker}
        </Text>
        <Title style={{ color: "#fff", margin: "10px 0 4px", fontSize: 46, lineHeight: 1.05 }}>
          Digital Twins
        </Title>
        <Paragraph style={{ color: "rgba(255,255,255,0.9)", fontSize: 16, maxWidth: 720, marginBottom: 24 }}>
          A special issue assembling state-of-the-art applications, methods, and perspectives —
          and assessing the social, ethical, and economic impacts of digital twins across
          engineering, medicine, urban planning, and the social sciences.
        </Paragraph>

        <Space size="large" wrap align="end" style={{ width: "100%", justifyContent: "space-between" }}>
          <div>
            <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>
              Submission deadline
            </Text>
            <div style={{ marginTop: 8 }}>
              <Countdown deadline={ISSUE.deadline} />
            </div>
          </div>
          <Button
            size="large"
            onClick={onSubmit}
            style={{ background: "#fff", color: CRIMSON, fontWeight: 600, border: "none" }}
          >
            Submit a manuscript <ArrowRightOutlined />
          </Button>
        </Space>
      </div>

      {/* Key dates */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {KEY_DATES.map((d) => (
          <Col xs={24} sm={8} key={d.label}>
            <Card size="small" style={{ height: "100%" }}>
              <Space direction="vertical" size={2}>
                <Text type="secondary" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 0.6 }}>
                  <CalendarOutlined /> {d.label}
                </Text>
                <Text strong style={{ fontSize: 18 }}>{d.value}</Text>
                {d.hint && <Text type="secondary" style={{ fontSize: 12 }}>{d.hint}</Text>}
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={15}>
          <Card title={<span><FileTextOutlined /> About this special issue</span>}>
            {OVERVIEW.map((p, i) => (
              <Paragraph key={i} style={{ fontSize: 14.5, marginBottom: 12 }}>
                {p}
              </Paragraph>
            ))}
          </Card>

          <Card title="Submission topics" style={{ marginTop: 24 }}>
            <Paragraph type="secondary" style={{ marginTop: -4 }}>
              We especially welcome papers on the following topics. Choose one or more when you submit.
            </Paragraph>
            <Space direction="vertical" size={10} style={{ width: "100%" }}>
              {TOPICS.map((t, i) => (
                <div key={t.id} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <Tag color={CRIMSON} style={{ marginTop: 2, flexShrink: 0 }}>{i + 1}</Tag>
                  <Text style={{ fontSize: 14 }}>{t.label}</Text>
                </div>
              ))}
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={9}>
          <Card title={<span><TeamOutlined /> Guest editors</span>}>
            <Space direction="vertical" size={14} style={{ width: "100%" }}>
              {GUEST_EDITORS.map((e) => (
                <div key={e.name}>
                  <Text strong style={{ fontSize: 15 }}>{e.name}</Text>
                  <div><Text type="secondary" style={{ fontSize: 13 }}>{e.affiliation}</Text></div>
                </div>
              ))}
            </Space>
          </Card>

          <Card title={<span><CheckCircleOutlined /> Submission criteria</span>} style={{ marginTop: 24 }}>
            <Space direction="vertical" size={12} style={{ width: "100%" }}>
              {CRITERIA.map((c, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <CheckCircleOutlined style={{ color: CRIMSON, marginTop: 4 }} />
                  <Text style={{ fontSize: 13.5 }}>{c}</Text>
                </div>
              ))}
            </Space>
            <Divider style={{ margin: "16px 0" }} />
            <Space direction="vertical" size={4}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                <MailOutlined /> Questions? Contact the HDSR Editorial Office
              </Text>
              <Link href={`mailto:${ISSUE.contactEmail}`} style={{ color: CRIMSON }}>
                {ISSUE.contactEmail}
              </Link>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Manuscripts are formally processed through {ISSUE.submissionSystem}.
              </Text>
            </Space>
          </Card>

          <Button
            type="primary"
            size="large"
            block
            onClick={onSubmit}
            style={{ marginTop: 24, background: CRIMSON }}
          >
            Start a submission <ArrowRightOutlined />
          </Button>
        </Col>
      </Row>
    </div>
  );
}
