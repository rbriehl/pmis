"use client";
import { Alert, Card, Tabs, Typography } from "antd";
import { ARTIFACTS } from "./discovery/config";
import CrudTable from "./discovery/CrudTable";

const { Title } = Typography;

export default function Discovery() {
  const items = ARTIFACTS.map((a) => ({
    key: a.key,
    label: a.label,
    children: <CrudTable config={a} />,
  }));

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>Discovery — Org Source Material</Title>
      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
        message="Data is stored locally in this browser only"
        description="Records never leave this device — nothing is sent to a server or cloud database. Seeded rows are fictional samples (tagged 'Sample'); records you add are tagged 'Entered'."
      />
      <Card>
        <Tabs items={items} />
      </Card>
    </div>
  );
}
