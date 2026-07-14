"use client";
import { useState } from "react";
import { Button, Form, Input, InputNumber, Modal, Popconfirm, Select, Space, Switch, Table, Tag, Typography } from "antd";
import type { TableProps } from "antd";
import { DeleteOutlined, DownloadOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useRecords } from "@/lib/discovery/useRecords";
import type { ArtifactConfig, FieldDef, RowRecord } from "./config";

const { Text } = Typography;

function toCsv(config: ArtifactConfig, rows: RowRecord[]): string {
  const cols = [...config.fields.map((f) => ({ key: f.name, label: f.label })), { key: "isSample", label: "Source" }];
  const esc = (v: unknown) => {
    const s = v === undefined || v === null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = cols.map((c) => esc(c.label)).join(",");
  const body = rows
    .map((r) => cols.map((c) => esc(c.key === "isSample" ? (r.isSample ? "Sample" : "Entered") : r[c.key])).join(","))
    .join("\n");
  return `${header}\n${body}`;
}

function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Returns the antd control as a plain element so it becomes the direct child of
// Form.Item — Form.Item injects value/onChange onto its direct child, so wrapping
// this in a component would swallow those props and break form binding.
function renderInput(field: FieldDef) {
  if (field.type === "textarea") return <Input.TextArea rows={3} placeholder={field.placeholder} />;
  if (field.type === "number") return <InputNumber style={{ width: "100%" }} min={0} placeholder={field.placeholder} />;
  if (field.type === "select") {
    return <Select options={(field.options ?? []).map((o) => ({ value: o, label: o }))} placeholder={field.placeholder} />;
  }
  return <Input placeholder={field.placeholder} />;
}

export default function CrudTable({ config }: { config: ArtifactConfig }) {
  const { rows, loading, error, add, update, remove } = useRecords(config);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showSamples, setShowSamples] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const tableFields = config.fields.filter((f) => f.inTable !== false);

  function openAdd() {
    setEditingId(null);
    form.resetFields();
    setOpen(true);
  }

  function openEdit(row: RowRecord) {
    setEditingId(row.id);
    form.setFieldsValue(row);
    setOpen(true);
  }

  async function handleFinish(values: Record<string, string | number>) {
    setSaving(true);
    try {
      if (editingId) {
        await update(editingId, values);
      } else {
        await add(values);
      }
      form.resetFields();
      setEditingId(null);
      setOpen(false);
    } finally {
      setSaving(false);
    }
  }

  function handleDelete(id: string) {
    return remove(id);
  }

  const columns: TableProps<RowRecord>["columns"] = [
    ...tableFields.map((f) => ({
      title: f.label,
      dataIndex: f.name,
      key: f.name,
      width: f.width,
      render: (v: string | number) =>
        f.tagColors && typeof v === "string" && v ? <Tag color={f.tagColors[v] ?? "default"}>{v}</Tag> : (v as React.ReactNode),
    })),
    {
      title: "Source",
      dataIndex: "isSample",
      key: "isSample",
      width: 90,
      render: (isSample: boolean) => (isSample ? <Tag color="gold">Sample</Tag> : <Tag color="green">Entered</Tag>),
    },
    {
      title: "Actions",
      key: "actions",
      width: 110,
      render: (_: unknown, row: RowRecord) => (
        <Space>
          <Button type="text" size="small" icon={<EditOutlined />} onClick={() => openEdit(row)} />
          <Popconfirm title="Delete this record?" onConfirm={() => handleDelete(row.id)} okText="Delete" okButtonProps={{ danger: true }}>
            <Button type="text" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const visibleRows = showSamples ? rows : rows.filter((r) => !r.isSample);
  const sampleCount = rows.filter((r) => r.isSample).length;

  return (
    <div>
      <Space style={{ width: "100%", justifyContent: "space-between", marginBottom: 16 }} wrap>
        <Space size={16} wrap>
          <Text type="secondary">
            {rows.length} record{rows.length === 1 ? "" : "s"}
            {sampleCount > 0 ? ` · ${sampleCount} sample${sampleCount === 1 ? "" : "s"}` : ""}
          </Text>
          <Space size={6}>
            <Switch size="small" checked={showSamples} onChange={setShowSamples} />
            <Text type="secondary" style={{ fontSize: 12 }}>Show samples</Text>
          </Space>
        </Space>
        <Space>
          <Button
            icon={<DownloadOutlined />}
            onClick={() => downloadCsv(`${config.table}.csv`, toCsv(config, visibleRows))}
            disabled={visibleRows.length === 0}
          >
            Export CSV
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
            Add {config.itemLabel}
          </Button>
        </Space>
      </Space>

      {error && (
        <Text type="danger" style={{ display: "block", marginBottom: 8 }}>
          {error}
        </Text>
      )}

      <Table<RowRecord>
        dataSource={visibleRows}
        columns={columns}
        rowKey="id"
        size="small"
        loading={loading}
        scroll={{ x: "max-content" }}
        pagination={{ pageSize: 10, hideOnSinglePage: true }}
      />

      <Modal
        title={`${editingId ? "Edit" : "New"} ${config.itemLabel}`}
        open={open}
        onCancel={() => { form.resetFields(); setEditingId(null); setOpen(false); }}
        onOk={() => form.submit()}
        okText={editingId ? "Save Changes" : `Add ${config.itemLabel}`}
        confirmLoading={saving}
        width={560}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handleFinish} style={{ marginTop: 16 }}>
          {config.fields.map((f) => (
            <Form.Item
              key={f.name}
              name={f.name}
              label={f.label}
              rules={f.required ? [{ required: true, message: "Required" }] : undefined}
            >
              {renderInput(f)}
            </Form.Item>
          ))}
        </Form>
      </Modal>
    </div>
  );
}
