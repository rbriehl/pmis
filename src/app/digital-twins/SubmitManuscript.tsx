"use client";
import { useState } from "react";
import {
  App,
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  Result,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  SendOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { TOPICS, type Submission } from "./data";
import { useSubmissions, type NewSubmission } from "./store";

const { Title, Paragraph, Text } = Typography;
const CRIMSON = "#A51C30";

type FormValues = {
  title: string;
  abstract: string;
  topics: string[];
  keywords: string;
  manuscriptUrl: string;
  coverLetter?: string;
  authors: { name: string; affiliation: string; email: string; corresponding?: boolean }[];
  agree: boolean;
};

export default function SubmitManuscript({
  onDone,
}: {
  onDone: (created: Submission) => void;
}) {
  const { add } = useSubmissions();
  const { message } = App.useApp();
  const [form] = Form.useForm<FormValues>();
  const [created, setCreated] = useState<Submission | null>(null);

  const handleFinish = (v: FormValues) => {
    const authors = (v.authors ?? []).map((a) => ({
      name: a.name.trim(),
      affiliation: a.affiliation.trim(),
      email: a.email.trim(),
      corresponding: !!a.corresponding,
    }));

    if (!authors.some((a) => a.corresponding)) {
      // Default the first author to corresponding if none was flagged.
      if (authors[0]) authors[0].corresponding = true;
    }

    const draft: NewSubmission = {
      title: v.title.trim(),
      authors,
      abstract: v.abstract.trim(),
      topics: v.topics,
      keywords: v.keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean),
      manuscriptUrl: v.manuscriptUrl.trim(),
      coverLetter: (v.coverLetter ?? "").trim(),
    };

    const record = add(draft);
    message.success(`Manuscript ${record.manuscriptId} received`);
    setCreated(record);
  };

  if (created) {
    return (
      <Result
        status="success"
        title="Submission received"
        subTitle={
          <span>
            Your manuscript has been logged as{" "}
            <Text strong>{created.manuscriptId}</Text>. In a live deployment it would now be
            routed through {`Editorial Manager`} for single-blind peer review by at least two
            independent reviewers.
          </span>
        }
        extra={[
          <Button type="primary" key="track" style={{ background: CRIMSON }} onClick={() => onDone(created)}>
            Track my submissions
          </Button>,
          <Button
            key="another"
            onClick={() => {
              form.resetFields();
              setCreated(null);
            }}
          >
            Submit another
          </Button>,
        ]}
      />
    );
  }

  return (
    <div style={{ maxWidth: 860, margin: "0 auto" }}>
      <Title level={3} style={{ marginBottom: 4 }}>Submit a manuscript</Title>
      <Paragraph type="secondary">
        Complete the details below to log a full manuscript for the <Text strong>Digital Twins</Text> special
        issue. Fields marked required must be completed. This portal records your submission locally in this
        browser; formal peer review is handled in Editorial Manager.
      </Paragraph>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        onFinishFailed={() => message.error("Please fix the highlighted fields")}
        initialValues={{ authors: [{ corresponding: true }], topics: [] }}
        requiredMark
      >
        <Card title="Manuscript" style={{ marginBottom: 20 }}>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "A title is required" }, { max: 300, message: "Keep the title under 300 characters" }]}
          >
            <Input placeholder="e.g. In the Spirit of a Digital Twin: Coupling Urban Mobility and Social Data" />
          </Form.Item>

          <Form.Item
            name="abstract"
            label="Abstract"
            rules={[
              { required: true, message: "An abstract is required" },
              { min: 100, message: "Abstracts should be at least 100 characters" },
            ]}
            extra="Summarize the contribution, methods, and findings."
          >
            <Input.TextArea rows={6} showCount maxLength={2500} placeholder="Abstract…" />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} md={14}>
              <Form.Item
                name="topics"
                label="Topic area(s)"
                rules={[{ required: true, message: "Select at least one topic" }]}
                extra="Choose all that apply from the call for submissions."
              >
                <Select
                  mode="multiple"
                  placeholder="Select topic areas"
                  optionLabelProp="label"
                  options={TOPICS.map((t, i) => ({
                    value: t.id,
                    label: `${i + 1}. ${t.label.length > 48 ? t.label.slice(0, 48) + "…" : t.label}`,
                    title: t.label,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={10}>
              <Form.Item
                name="keywords"
                label="Keywords"
                rules={[{ required: true, message: "Add a few keywords" }]}
                extra="Comma-separated."
              >
                <Input placeholder="digital twins, urban analytics, generative AI" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="manuscriptUrl"
            label="Manuscript link"
            rules={[
              { required: true, message: "Provide a link to the manuscript file" },
              { type: "url", message: "Enter a valid URL (https://…)" },
            ]}
            extra="Link to the full manuscript in HDSR template format (e.g. shared drive, DOI, or preprint)."
          >
            <Input placeholder="https://…" />
          </Form.Item>

          <Form.Item name="coverLetter" label="Cover letter (optional)">
            <Input.TextArea rows={4} maxLength={4000} showCount placeholder="A note to the guest editors…" />
          </Form.Item>
        </Card>

        <Card title="Authors" style={{ marginBottom: 20 }}>
          <Form.List
            name="authors"
            rules={[
              {
                validator: async (_, authors) => {
                  if (!authors || authors.length < 1) {
                    return Promise.reject(new Error("At least one author is required"));
                  }
                },
              },
            ]}
          >
            {(fields, { add: addAuthor, remove }, { errors }) => (
              <>
                {fields.map((field, idx) => (
                  <div
                    key={field.key}
                    style={{
                      border: "1px solid #f0f0f0",
                      borderRadius: 8,
                      padding: 16,
                      marginBottom: 12,
                      position: "relative",
                    }}
                  >
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      <UserOutlined /> Author {idx + 1}
                    </Text>
                    <Row gutter={16} style={{ marginTop: 8 }}>
                      <Col xs={24} md={8}>
                        <Form.Item
                          name={[field.name, "name"]}
                          label="Full name"
                          rules={[{ required: true, message: "Required" }]}
                          style={{ marginBottom: 8 }}
                        >
                          <Input placeholder="Jane Doe" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={9}>
                        <Form.Item
                          name={[field.name, "affiliation"]}
                          label="Affiliation"
                          rules={[{ required: true, message: "Required" }]}
                          style={{ marginBottom: 8 }}
                        >
                          <Input placeholder="University / Institution" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={7}>
                        <Form.Item
                          name={[field.name, "email"]}
                          label="Email"
                          rules={[
                            { required: true, message: "Required" },
                            { type: "email", message: "Invalid email" },
                          ]}
                          style={{ marginBottom: 8 }}
                        >
                          <Input placeholder="jane@uni.edu" />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Space align="center" style={{ justifyContent: "space-between", width: "100%" }}>
                      <Form.Item
                        name={[field.name, "corresponding"]}
                        valuePropName="checked"
                        style={{ marginBottom: 0 }}
                      >
                        <Checkbox>Corresponding author</Checkbox>
                      </Form.Item>
                      {fields.length > 1 && (
                        <Button
                          type="text"
                          danger
                          size="small"
                          icon={<DeleteOutlined />}
                          onClick={() => remove(field.name)}
                        >
                          Remove
                        </Button>
                      )}
                    </Space>
                  </div>
                ))}
                <Button type="dashed" onClick={() => addAuthor({ corresponding: false })} icon={<PlusOutlined />} block>
                  Add author
                </Button>
                <Form.ErrorList errors={errors} />
              </>
            )}
          </Form.List>
        </Card>

        <Card style={{ marginBottom: 20 }}>
          <Form.Item
            name="agree"
            valuePropName="checked"
            rules={[
              {
                validator: (_, v) =>
                  v ? Promise.resolve() : Promise.reject(new Error("You must confirm the guidelines")),
              },
            ]}
            style={{ marginBottom: 8 }}
          >
            <Checkbox>
              I confirm this is an original full manuscript in HDSR template format, that all authors consent to
              submission, and that it will undergo single-blind peer review under the standard HDSR process.
            </Checkbox>
          </Form.Item>
          <Divider style={{ margin: "8px 0 16px" }} />
          <Space>
            <Button type="primary" htmlType="submit" size="large" icon={<SendOutlined />} style={{ background: CRIMSON }}>
              Submit manuscript
            </Button>
            <Button size="large" onClick={() => form.resetFields()}>
              Reset
            </Button>
          </Space>
        </Card>
      </Form>
    </div>
  );
}
