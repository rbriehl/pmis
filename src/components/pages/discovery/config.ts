// Field + seed definitions for the three discovery artifacts.
// All seed rows are fictional samples (isSample: true) — no real org data.

export type FieldType = "text" | "textarea" | "number" | "select";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  required?: boolean;
  inTable?: boolean; // show as a table column (default true)
  tagColors?: Record<string, string>; // render value as a colored Tag
  placeholder?: string;
  width?: number;
}

export interface RowRecord {
  id: string;
  isSample: boolean;
  [key: string]: string | number | boolean;
}

export interface ArtifactConfig {
  key: string;
  label: string;
  itemLabel: string; // singular, e.g. "Org Unit"
  storageKey: string; // localStorage key (local backend)
  table: string; // Supabase table name (supabase backend)
  fields: FieldDef[];
  seed: RowRecord[];
}

const LEVEL = { Low: "green", Medium: "gold", High: "red" };
const LEVEL_POSITIVE = { Low: "default", Medium: "blue", High: "green" };

// ---------------------------------------------------------------- Org Chart
const orgChart: ArtifactConfig = {
  key: "org",
  label: "Org Chart",
  itemLabel: "Org Unit",
  storageKey: "discovery.orgChart.v1",
  table: "org_units",
  fields: [
    { name: "function", label: "Function / Unit", type: "text", required: true },
    { name: "roleTitle", label: "Role Title", type: "text", required: true },
    { name: "headcount", label: "Headcount", type: "number", width: 100 },
    { name: "reportsTo", label: "Reports To", type: "text" },
    {
      name: "transactionVolume",
      label: "Transaction Volume",
      type: "select",
      options: ["Low", "Medium", "High"],
      tagColors: LEVEL,
    },
    {
      name: "stakeholderType",
      label: "Stakeholder Type",
      type: "select",
      options: ["Decision-maker", "Doer", "Sponsor"],
      tagColors: { "Decision-maker": "geekblue", Doer: "cyan", Sponsor: "gold" },
    },
    { name: "primaryProcesses", label: "Primary Processes", type: "textarea", inTable: false },
    { name: "notes", label: "Notes", type: "textarea", inTable: false },
  ],
  seed: [
    { id: "org-1", isSample: true, function: "Innovation Lab Leadership", roleTitle: "Lab Director", headcount: 1, reportsTo: "VP Engineering", transactionVolume: "Low", stakeholderType: "Sponsor", primaryProcesses: "Portfolio prioritization, funding decisions", notes: "Primary sponsor for automation initiatives" },
    { id: "org-2", isSample: true, function: "Rapid Prototyping", roleTitle: "Prototype Engineer", headcount: 5, reportsTo: "Lab Director", transactionVolume: "High", stakeholderType: "Doer", primaryProcesses: "Build POCs, hardware/software integration, bench testing", notes: "Highest repetitive-task load" },
    { id: "org-3", isSample: true, function: "Data & Analytics", roleTitle: "Data Scientist", headcount: 3, reportsTo: "Lab Director", transactionVolume: "Medium", stakeholderType: "Doer", primaryProcesses: "Model development, data pipeline maintenance", notes: "" },
    { id: "org-4", isSample: true, function: "Program Management", roleTitle: "Technical PM", headcount: 2, reportsTo: "Lab Director", transactionVolume: "Medium", stakeholderType: "Decision-maker", primaryProcesses: "Scheduling, stakeholder comms, status reporting", notes: "Owns weekly status roll-up" },
  ],
};

// ------------------------------------------------ AI / Automation Initiatives
const initiatives: ArtifactConfig = {
  key: "initiatives",
  label: "AI / Automation Initiatives",
  itemLabel: "Initiative",
  storageKey: "discovery.initiatives.v1",
  table: "initiatives",
  fields: [
    { name: "name", label: "Initiative Name", type: "text", required: true },
    { name: "owningFunction", label: "Owning Function", type: "text" },
    { name: "sponsor", label: "Sponsor", type: "text", inTable: false },
    { name: "useCase", label: "Use Case", type: "textarea", required: true, inTable: false },
    { name: "tool", label: "Tool / Tech", type: "text" },
    {
      name: "buildOrBuy",
      label: "Build / Buy",
      type: "select",
      options: ["Build", "Buy"],
      tagColors: { Build: "geekblue", Buy: "purple" },
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: ["Production", "Pilot", "Abandoned", "Shadow IT"],
      tagColors: { Production: "green", Pilot: "blue", Abandoned: "default", "Shadow IT": "red" },
    },
    {
      name: "adoption",
      label: "Adoption",
      type: "select",
      options: ["Low", "Medium", "High"],
      tagColors: { Low: "red", Medium: "gold", High: "green" },
    },
    { name: "valueDelivered", label: "Value Delivered", type: "textarea", inTable: false },
    { name: "annualSpend", label: "Annual Spend (USD)", type: "text", placeholder: "e.g. $12K", inTable: false },
  ],
  seed: [
    { id: "init-1", isSample: true, name: "Automated Test Report Generator", owningFunction: "Rapid Prototyping", sponsor: "Lab Director", useCase: "Auto-generate test summary reports from bench instrument data", tool: "Python + Jinja", buildOrBuy: "Build", status: "Production", adoption: "High", valueDelivered: "~6 hrs/week saved per engineer", annualSpend: "$0 (internal)" },
    { id: "init-2", isSample: true, name: "Meeting Notes Summarizer", owningFunction: "Program Management", sponsor: "Technical PM", useCase: "Summarize stakeholder meetings into action items", tool: "Copilot / LLM", buildOrBuy: "Buy", status: "Pilot", adoption: "Medium", valueDelivered: "Faster follow-up turnaround", annualSpend: "$12K" },
    { id: "init-3", isSample: true, name: "Predictive Maintenance Model", owningFunction: "Data & Analytics", sponsor: "Lab Director", useCase: "Predict equipment failure from sensor telemetry", tool: "scikit-learn", buildOrBuy: "Build", status: "Pilot", adoption: "Low", valueDelivered: "TBD — in validation", annualSpend: "$25K" },
    { id: "init-4", isSample: true, name: "Legacy OCR Document Intake", owningFunction: "Program Management", sponsor: "—", useCase: "Digitize scanned specification documents", tool: "Unknown vendor tool", buildOrBuy: "Buy", status: "Shadow IT", adoption: "Low", valueDelivered: "Unclear — undocumented", annualSpend: "Unknown" },
  ],
};

// ----------------------------------------------------------- Pain Points
const painPoints: ArtifactConfig = {
  key: "pain",
  label: "Pain Points",
  itemLabel: "Pain Point",
  storageKey: "discovery.painPoints.v1",
  table: "pain_points",
  fields: [
    { name: "description", label: "Description", type: "textarea", required: true, width: 280 },
    { name: "affectedFunction", label: "Affected Function", type: "text" },
    { name: "whoAffected", label: "Who Is Affected", type: "text", inTable: false },
    {
      name: "frequency",
      label: "Frequency",
      type: "select",
      options: ["Daily", "Weekly", "Monthly", "Quarterly"],
      tagColors: { Daily: "red", Weekly: "orange", Monthly: "blue", Quarterly: "default" },
    },
    {
      name: "impact",
      label: "Impact",
      type: "select",
      options: ["Low", "Medium", "High"],
      tagColors: LEVEL,
    },
    {
      name: "automatability",
      label: "Automatability",
      type: "select",
      options: ["Low", "Medium", "High"],
      tagColors: LEVEL_POSITIVE,
    },
    { name: "currentWorkaround", label: "Current Workaround", type: "textarea", inTable: false },
    { name: "rootCause", label: "Suspected Root Cause", type: "textarea", inTable: false },
  ],
  seed: [
    { id: "pain-1", isSample: true, description: "Manual compilation of weekly status across 4 teams", affectedFunction: "Program Management", whoAffected: "Technical PMs", frequency: "Weekly", impact: "Medium", automatability: "High", currentWorkaround: "Copy-paste from emails into a slide deck", rootCause: "No central status system" },
    { id: "pain-2", isSample: true, description: "Re-entering test data from instruments into spreadsheets", affectedFunction: "Rapid Prototyping", whoAffected: "Prototype Engineers", frequency: "Daily", impact: "High", automatability: "High", currentWorkaround: "Manual transcription", rootCause: "Instruments not integrated with data store" },
    { id: "pain-3", isSample: true, description: "Searching for prior art and past POC results", affectedFunction: "Data & Analytics", whoAffected: "Data Scientists", frequency: "Weekly", impact: "Medium", automatability: "Medium", currentWorkaround: "Ask colleagues, dig through shared drives", rootCause: "No searchable knowledge base" },
    { id: "pain-4", isSample: true, description: "Procurement approval routing takes days", affectedFunction: "Innovation Lab Leadership", whoAffected: "Whole lab", frequency: "Monthly", impact: "High", automatability: "Low", currentWorkaround: "Email chains and manual follow-up", rootCause: "Paper-based approval chain" },
  ],
};

export const ARTIFACTS: ArtifactConfig[] = [orgChart, initiatives, painPoints];
