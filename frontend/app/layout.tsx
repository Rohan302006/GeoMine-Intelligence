import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "GeoMine — AI Mining Intelligence & Reporting System (SIH26023 Prototype)",
  description: "AI-Powered Geological, Mining & Statistical Intelligence Prototype for Smart India Hackathon 2026.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full w-full">
      <body className="h-full w-full m-0 p-0 flex flex-col overflow-hidden bg-[#F7F8FA] text-[#1F2933]">
        <Navbar />
        <div className="flex flex-1 w-full min-h-0 overflow-hidden">
          <Sidebar />
          <main className="flex-1 h-full overflow-y-auto bg-[#F7F8FA] p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
