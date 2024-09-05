import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { cn } from "@/lib/utils";

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
      <body className={cn(inter.className, "overflow-hidden")}>
        <div className="flex h-screen flex-col">
          <Header />
          <ResizablePanelGroup direction="horizontal" className="flex-grow">
            <ResizablePanel defaultSize={14} minSize={14} collapsible>
              <div className="h-full overflow-y-auto"> 
                <div className="p-2">
                  <Sidebar />
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={86}>
              <div className="h-full overflow-y-auto">
                {children}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </body>
    </html>
  );
}
