"use client";
import React, { useState } from "react";
import { Layout, Menu, Avatar, Dropdown, Typography, Badge, Space } from "antd";
import {
  DashboardOutlined,
  ProjectOutlined,
  WarningOutlined,
  CalendarOutlined,
  FileTextOutlined,
  BarChartOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Risks from "./pages/Risks";
import Milestones from "./pages/Milestones";
import Documents from "./pages/Documents";
import Reports from "./pages/Reports";

const { Header, Sider, Content, Footer } = Layout;
const { Text } = Typography;

const NAV_ITEMS = [
  { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
  { key: "projects", icon: <ProjectOutlined />, label: "Projects" },
  { key: "risks", icon: <WarningOutlined />, label: "RAID Log" },
  { key: "milestones", icon: <CalendarOutlined />, label: "Milestones" },
  { key: "documents", icon: <FileTextOutlined />, label: "Documents" },
  { key: "reports", icon: <BarChartOutlined />, label: "Reports" },
  { key: "settings", icon: <SettingOutlined />, label: "Settings" },
];

const PAGE_MAP: Record<string, React.ReactElement> = {
  dashboard: <Dashboard />,
  projects: <Projects />,
  risks: <Risks />,
  milestones: <Milestones />,
  documents: <Documents />,
  reports: <Reports />,
  settings: <div style={{ padding: 24 }}><Text>Settings — coming soon</Text></div>,
};

export default function AppShell() {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [page, setPage] = useState("dashboard");

  const userMenu = {
    items: [
      { key: "logout", icon: <LogoutOutlined />, label: "Sign Out", onClick: logout },
    ],
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} theme="dark">
        <div style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 16px" }}>
          {!collapsed && (
            <Text strong style={{ color: "#fff", fontSize: 16, letterSpacing: 1 }}>PMIS</Text>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[page]}
          items={NAV_ITEMS}
          onClick={({ key }) => setPage(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
          <Text strong style={{ fontSize: 18 }}>E-Unify Project Management</Text>
          <Space size={16}>
            <Badge count={3} size="small">
              <BellOutlined style={{ fontSize: 18, cursor: "pointer" }} />
            </Badge>
            <Dropdown menu={userMenu} trigger={["click"]}>
              <Space style={{ cursor: "pointer" }}>
                <Avatar icon={<UserOutlined />} style={{ background: "#1677ff" }} />
                <Text>{user?.name}</Text>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content style={{ margin: "24px 16px", minHeight: 280 }}>
          {PAGE_MAP[page] ?? PAGE_MAP.dashboard}
        </Content>
        <Footer style={{ textAlign: "center", color: "#888", fontSize: 12 }}>
          E-Unify PMIS © {new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
}
