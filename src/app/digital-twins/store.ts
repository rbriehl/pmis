import { useCallback } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { STORAGE_KEY, type Submission, type SubmissionStatus } from "./data";

const SEED: Submission[] = [];

let counter = 0;
function uid(): string {
  counter += 1;
  return `sub_${Date.now().toString(36)}_${counter.toString(36)}`;
}

// Deterministic sequential manuscript ID (HDSR-DT-2026-00N) based on how many
// submissions already exist. Withdrawn/draft records still consume a number so
// IDs stay stable once assigned.
function nextManuscriptId(existing: Submission[]): string {
  const year = 2026;
  const n = existing.length + 1;
  return `HDSR-DT-${year}-${String(n).padStart(3, "0")}`;
}

export type NewSubmission = Omit<
  Submission,
  "id" | "manuscriptId" | "status" | "submittedAt" | "updatedAt"
>;

export function useSubmissions() {
  const [submissions, setSubmissions] = useLocalStorage<Submission[]>(STORAGE_KEY, SEED);

  const add = useCallback(
    (draft: NewSubmission): Submission => {
      const now = new Date().toISOString();
      let created!: Submission;
      setSubmissions((prev) => {
        created = {
          ...draft,
          id: uid(),
          manuscriptId: nextManuscriptId(prev),
          status: "Submitted",
          submittedAt: now,
          updatedAt: now,
        };
        return [created, ...prev];
      });
      return created;
    },
    [setSubmissions],
  );

  const setStatus = useCallback(
    (id: string, status: SubmissionStatus) => {
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, status, updatedAt: new Date().toISOString() } : s,
        ),
      );
    },
    [setSubmissions],
  );

  const remove = useCallback(
    (id: string) => {
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
    },
    [setSubmissions],
  );

  return { submissions, add, setStatus, remove };
}
