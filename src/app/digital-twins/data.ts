// Static Call-for-Submissions content and the submission data model for the
// HDSR "Digital Twins" special issue portal. Everything here is derived from
// the published call for submissions — no server, no external data source.

export const ISSUE = {
  journal: "Harvard Data Science Review",
  journalShort: "HDSR",
  title: "Digital Twins",
  kicker: "Special Issue — Call for Submissions",
  publication: "Spring / Summer 2027",
  // End of the final submission day, local time.
  deadline: "2026-07-15T23:59:59",
  contactEmail: "datasciencereview@harvard.edu",
  submissionSystem: "Editorial Manager",
} as const;

export const OVERVIEW: string[] = [
  '"Digital Twins" have been touted as an analytical and conceptual game changer, capturing the attention of academic researchers, industry, and policymakers alike. Applications of digital twin frameworks span engineering and medicine, as well as urban planning and the social sciences. Some examples align closely to common definitions of digital twins, integrating real-time data streams, system perspectives, state-of-the-art analytics and AI, and computational power. Others, especially those dealing with social systems or where human systems interface with natural and built environments, are perhaps better thought of as "in the spirit of" a digital twin.',
  "Despite the current prominence of digital twins, challenges and questions remain, especially around definitions, suitable applications, technical requirements, and the barriers to digital twins delivering on their promise.",
  "This special issue of the Harvard Data Science Review (HDSR) will assemble state-of-the-art applications, methods, and perspectives, identify gaps and potential solutions, and assess the social, ethical, and economic impacts of a digital twin approach that is making inroads in nearly every aspect of society. Contributions are invited that add clarity to general understanding of digital twins; we are especially interested in article submissions that endeavor to speak across disciplinary divides and application areas, finding commonalities in a fractured community of users, developers, and consumers of digital twin apparatuses, as well as on methods and theory to advance the quality and scientific rigor of digital twins.",
];

// Submission topic areas. `id` is stable and used as the value stored on a
// submission; `label` is the display string from the call.
export const TOPICS: { id: string; label: string }[] = [
  { id: "definitions", label: "Defining digital twins, their historical development, and their relationships with synthetic data and generative AI" },
  { id: "essential-elements", label: "Essential elements of digital twins across domains" },
  { id: "applications", label: "Innovative applications" },
  { id: "challenges", label: "Data, technical, and other ongoing challenges" },
  { id: "limits", label: "Establishing the limits of digital twins and their unintended consequences" },
  { id: "humans", label: "Humans in the machine: dealing with behavior, preferences, and decisions" },
  { id: "ethics", label: "Ethical aspects of digital twins (e.g., data, coverage, algorithms)" },
  { id: "infrastructure", label: "Digital twin infrastructures and platforms" },
];

export const TOPIC_LABEL: Record<string, string> = Object.fromEntries(
  TOPICS.map((t) => [t.id, t.label]),
);

export const GUEST_EDITORS: { name: string; affiliation: string }[] = [
  { name: "Michael Batty", affiliation: "University College London (UCL)" },
  { name: "Rachel Franklin", affiliation: "Harvard University" },
  { name: "S. V. Subramanian", affiliation: "Harvard University" },
  { name: "Sarah Williams", affiliation: "Massachusetts Institute of Technology (MIT)" },
];

export const CRITERIA: string[] = [
  "All submissions undergo the standard HDSR review process: single-blind assessment by at least two independent peer reviewers.",
  "Submissions are processed through Editorial Manager and author guidelines must be strictly followed.",
  "Special issue submissions should be submitted as full manuscripts in the format of an HDSR template.",
];

export const KEY_DATES: { label: string; value: string; hint?: string }[] = [
  { label: "Submission deadline", value: "July 15, 2026", hint: "Full manuscripts" },
  { label: "Peer review", value: "Aug 2026 – Q1 2027", hint: "≥ 2 single-blind reviewers" },
  { label: "Expected publication", value: "Spring / Summer 2027" },
];

// ── Submission data model ───────────────────────────────────────────────────

export type SubmissionStatus =
  | "Draft"
  | "Submitted"
  | "Under Review"
  | "Revisions Requested"
  | "Accepted"
  | "Rejected"
  | "Withdrawn";

export const STATUS_ORDER: SubmissionStatus[] = [
  "Draft",
  "Submitted",
  "Under Review",
  "Revisions Requested",
  "Accepted",
  "Rejected",
  "Withdrawn",
];

// antd Tag colour per status.
export const STATUS_COLOR: Record<SubmissionStatus, string> = {
  Draft: "default",
  Submitted: "blue",
  "Under Review": "gold",
  "Revisions Requested": "orange",
  Accepted: "green",
  Rejected: "red",
  Withdrawn: "default",
};

export type Author = {
  name: string;
  affiliation: string;
  email: string;
  corresponding: boolean;
};

export type Submission = {
  id: string; // internal uuid-ish key
  manuscriptId: string; // e.g. HDSR-DT-2026-001
  title: string;
  authors: Author[];
  abstract: string;
  topics: string[]; // TOPICS ids
  keywords: string[];
  manuscriptUrl: string;
  coverLetter: string;
  status: SubmissionStatus;
  submittedAt: string; // ISO
  updatedAt: string; // ISO
};

export const STORAGE_KEY = "hdsr-dt-submissions";
