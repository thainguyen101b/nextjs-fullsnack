import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tasks",
  description: "Tasks description",
};

export default function TasksLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
