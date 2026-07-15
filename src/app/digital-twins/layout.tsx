import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Digital Twins — HDSR Special Issue · Call for Submissions",
  description:
    "Submission portal for the Harvard Data Science Review special issue on Digital Twins. Read the call for submissions, review topics and guest editors, and submit a manuscript.",
};

export default function DigitalTwinsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
