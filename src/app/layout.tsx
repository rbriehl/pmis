import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "E-Unify PMIS",
  description: "Project Management Information System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
