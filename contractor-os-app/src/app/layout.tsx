import type { Metadata } from "next";
import Sidebar from "@/components/sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "contractorOS — HC Ventures",
  description: "Contractor management platform for HC Ventures real estate operations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex">
        <Sidebar />
        <main className="ml-64 flex-1 p-8">{children}</main>
      </body>
    </html>
  );
}
