"use client";
import { useState } from "react";
import { Button, Card, Form, Input, Alert, Typography } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { useAuth } from "@/context/AuthContext";

const { Title, Text } = Typography;

function DemoLogin() {
  const { login } = useAuth();
  const [error, setError] = useState(false);

  function onFinish({ email, password }: { email: string; password: string }) {
    setError(!login(email, password));
  }

  return (
    <>
      {error && <Alert message="Invalid credentials" type="error" style={{ marginBottom: 16 }} showIcon />}
      <Form
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        initialValues={{ email: "admin@e-unify.ai", password: "pmis2025" }}
      >
        <Form.Item label="Email" name="email" rules={[{ required: true }]}>
          <Input placeholder="admin@e-unify.ai" autoComplete="off" />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true }]}>
          <Input.Password placeholder="••••••••" autoComplete="new-password" />
        </Form.Item>
        <Form.Item style={{ marginBottom: 0 }}>
          <Button type="primary" htmlType="submit" block>Sign In</Button>
        </Form.Item>
      </Form>
      <Text type="secondary" style={{ display: "block", marginTop: 16, fontSize: 12, textAlign: "center" }}>
        Demo: admin@e-unify.ai / pmis2025
      </Text>
    </>
  );
}

function MagicLinkLogin() {
  const { sendMagicLink } = useAuth();
  const [sending, setSending] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onFinish({ email }: { email: string }) {
    setSending(true);
    setError(null);
    const res = await sendMagicLink(email);
    setSending(false);
    if (res.ok) setSentTo(email);
    else setError(res.error ?? "Could not send the login link.");
  }

  if (sentTo) {
    return (
      <Alert
        type="success"
        showIcon
        message="Check your email"
        description={`We sent a login link to ${sentTo}. Click it to sign in — no password needed.`}
      />
    );
  }

  return (
    <>
      {error && <Alert message={error} type="error" style={{ marginBottom: 16 }} showIcon />}
      <Text type="secondary" style={{ display: "block", marginBottom: 16, textAlign: "center" }}>
        Enter your email and we&apos;ll send you a secure login link.
      </Text>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Email" name="email" rules={[{ required: true, type: "email", message: "Enter a valid email" }]}>
          <Input placeholder="you@example.com" prefix={<MailOutlined />} autoComplete="email" />
        </Form.Item>
        <Form.Item style={{ marginBottom: 0 }}>
          <Button type="primary" htmlType="submit" block loading={sending}>
            Send login link
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default function LoginPage() {
  const { mode } = useAuth();
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f2f5" }}>
      <Card style={{ width: 380, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={3} style={{ margin: 0, color: "#1677ff" }}>E-Unify PMIS</Title>
          <Text type="secondary">Project Management Information System</Text>
        </div>
        {mode === "supabase" ? <MagicLinkLogin /> : <DemoLogin />}
      </Card>
    </div>
  );
}
