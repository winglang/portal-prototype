import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wing Portal",
  description: "A developer portal that brings you to the clouds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
          <Header />
          <div style={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
            <Sidebar />
            <main style={{ padding: '20px' }}>
              {children}
            </main>
          </div>
        </div>

      </body>
    </html>
  );
}
