"use client";
import { useState } from "react";
import { Button, Card, Form, Input, Alert, Typography } from "antd";
import { useAuth } from "@/context/AuthContext";

const { Title, Text } = Typography;

export default function LoginPage() {
  const { login } = useAuth();
  const [error, setError] = useState(false);

  function onFinish({ email, password }: { email: string; password: string }) {
    if (!login(email, password)) setError(true);
    else setError(false);
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f2f5" }}>
      <Card style={{ width: 380, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={3} style={{ margin: 0, color: "#1677ff" }}>E-Unify PMIS</Title>
          <Text type="secondary">Project Management Information System</Text>
        </div>
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
      </Card>
    </div>
  );
}
