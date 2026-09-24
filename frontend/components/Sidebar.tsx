"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Bot,
  FileText,
  BarChart2,
  FileSpreadsheet,
  Cloud,
  Database,
  ShieldCheck,
  Settings,
  ChevronDown,
  ChevronRight,
  UploadCloud,
  Clock,
  CheckCircle2,
  TrendingUp,
  Truck,
  Layers,
  Globe2,
  GitCompare,
  Landmark,
  Archive
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  // Accordion state for Documents, Analytics, Reports
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    documents: true,
    analytics: true,
    reports: true
  });

  const toggleSection = (sec: string) => {
    setOpenSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  return (
    <aside className="w-64 bg-white border-r border-[#D5DCE3] flex flex-col h-full flex-shrink-0 select-none justify-between font-serif text-[13px] overflow-y-auto">
      <div className="py-3">
        {/* 1. Dashboard */}
        <div className="px-2 mb-1">
          <Link
            href="/"
            className={`flex items-center gap-2.5 px-3 py-2 rounded transition-colors ${
              pathname === "/"
                ? "bg-[#EAF2F8] text-[#123B6D] font-bold border-l-4 border-[#123B6D]"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Home className="w-4 h-4 text-[#123B6D]" />
            <span>Dashboard</span>
          </Link>
        </div>

        {/* 2. AI Assistant */}
        <div className="px-2 mb-1">
          <Link
            href="/ai-assistant"
            className={`flex items-center gap-2.5 px-3 py-2 rounded transition-colors ${
              pathname === "/ai-assistant"
                ? "bg-[#EAF2F8] text-[#123B6D] font-bold border-l-4 border-[#123B6D]"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Bot className="w-4 h-4 text-[#123B6D]" />
            <span>AI Assistant</span>
          </Link>
        </div>

        {/* 3. Documents Section */}
        <div className="px-2 mb-1">
          <button
            onClick={() => toggleSection("documents")}
            className="w-full flex items-center justify-between px-3 py-2 text-gray-800 hover:bg-gray-100 rounded text-left font-bold"
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-[#123B6D]" />
              <span>Documents</span>
            </div>
            {openSections.documents ? (
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
            )}
          </button>

          {openSections.documents && (
            <div className="ml-5 pl-2 border-l border-gray-200 mt-1 space-y-0.5">
              <Link
                href="/documents"
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded text-[12px] transition-colors ${
                  pathname === "/documents"
                    ? "bg-[#EAF2F8] text-[#123B6D] font-bold"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-gray-400" />
                <span>All Documents</span>
              </Link>
              <Link
                href="/documents#upload"
                className="flex items-center gap-2 px-2.5 py-1.5 rounded text-[12px] text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <UploadCloud className="w-3.5 h-3.5 text-gray-400" />
                <span>Upload Documents</span>
              </Link>
              <Link
                href="/documents#queue"
                className="flex items-center gap-2 px-2.5 py-1.5 rounded text-[12px] text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span>Processing Queue</span>
              </Link>
              <Link
                href="/validation"
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded text-[12px] transition-colors ${
                  pathname === "/validation"
                    ? "bg-[#EAF2F8] text-[#123B6D] font-bold"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-gray-400" />
                <span>Data Validation</span>
              </Link>
            </div>
          )}
        </div>

        {/* 4. Analytics Section */}
        <div className="px-2 mb-1">
          <button
            onClick={() => toggleSection("analytics")}
            className="w-full flex items-center justify-between px-3 py-2 text-gray-800 hover:bg-gray-100 rounded text-left font-bold"
          >
            <div className="flex items-center gap-2.5">
              <BarChart2 className="w-4 h-4 text-[#123B6D]" />
              <span>Analytics</span>
            </div>
            {openSections.analytics ? (
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
            )}
          </button>

          {openSections.analytics && (
            <div className="ml-5 pl-2 border-l border-gray-200 mt-1 space-y-0.5">
              <Link
                href="/analytics"
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded text-[12px] transition-colors ${
                  pathname === "/analytics"
                    ? "bg-[#EAF2F8] text-[#123B6D] font-bold"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5 text-gray-400" />
                <span>Production</span>
              </Link>
              <Link
                href="/analytics#dispatch"
                className="flex items-center gap-2 px-2.5 py-1.5 rounded text-[12px] text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Truck className="w-3.5 h-3.5 text-gray-400" />
                <span>Dispatch</span>
              </Link>
              <Link
                href="/analytics#resources"
                className="flex items-center gap-2 px-2.5 py-1.5 rounded text-[12px] text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Layers className="w-3.5 h-3.5 text-gray-400" />
                <span>Resources</span>
              </Link>
              <Link
                href="/analytics#imports"
                className="flex items-center gap-2 px-2.5 py-1.5 rounded text-[12px] text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Globe2 className="w-3.5 h-3.5 text-gray-400" />
                <span>Imports/Exports</span>
              </Link>
              <Link
                href="/analytics#comparative"
                className="flex items-center gap-2 px-2.5 py-1.5 rounded text-[12px] text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <GitCompare className="w-3.5 h-3.5 text-gray-400" />
                <span>Comparative Analysis</span>
              </Link>
            </div>
          )}
        </div>

        {/* 5. Reports Section */}
        <div className="px-2 mb-1">
          <button
            onClick={() => toggleSection("reports")}
            className="w-full flex items-center justify-between px-3 py-2 text-gray-800 hover:bg-gray-100 rounded text-left font-bold"
          >
            <div className="flex items-center gap-2.5">
              <FileSpreadsheet className="w-4 h-4 text-[#123B6D]" />
              <span>Reports</span>
            </div>
            {openSections.reports ? (
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
            )}
          </button>

          {openSections.reports && (
            <div className="ml-5 pl-2 border-l border-gray-200 mt-1 space-y-0.5">
              <Link
                href="/reports?tab=custom"
                className="flex items-center gap-2 px-2.5 py-1.5 rounded text-[12px] text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-gray-400" />
                <span>Generate Report</span>
              </Link>
              <Link
                href="/reports"
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded text-[12px] transition-colors ${
                  pathname === "/reports"
                    ? "bg-[#EAF2F8] text-[#123B6D] font-bold"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Landmark className="w-3.5 h-3.5 text-[#123B6D]" />
                <span>Parliamentary Queries</span>
              </Link>
              <Link
                href="/reports?tab=archive"
                className="flex items-center gap-2 px-2.5 py-1.5 rounded text-[12px] text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Archive className="w-3.5 h-3.5 text-gray-400" />
                <span>Generated Reports</span>
              </Link>
            </div>
          )}
        </div>

        {/* 6. Topics & Word Cloud */}
        <div className="px-2 mb-1">
          <Link
            href="/topics"
            className={`flex items-center gap-2.5 px-3 py-2 rounded transition-colors ${
              pathname === "/topics"
                ? "bg-[#EAF2F8] text-[#123B6D] font-bold border-l-4 border-[#123B6D]"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Cloud className="w-4 h-4 text-[#123B6D]" />
            <span>Topics & Word Cloud</span>
          </Link>
        </div>

        {/* 7. Data Catalog */}
        <div className="px-2 mb-1">
          <Link
            href="/catalog"
            className={`flex items-center gap-2.5 px-3 py-2 rounded transition-colors ${
              pathname === "/catalog"
                ? "bg-[#EAF2F8] text-[#123B6D] font-bold border-l-4 border-[#123B6D]"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Database className="w-4 h-4 text-[#123B6D]" />
            <span>Data Catalog</span>
          </Link>
        </div>

        {/* 8. Audit Logs */}
        <div className="px-2 mb-1">
          <Link
            href="/audit"
            className={`flex items-center gap-2.5 px-3 py-2 rounded transition-colors ${
              pathname === "/audit"
                ? "bg-[#EAF2F8] text-[#123B6D] font-bold border-l-4 border-[#123B6D]"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#123B6D]" />
            <span>Audit Logs</span>
          </Link>
        </div>

        {/* 9. Settings */}
        <div className="px-2 mb-1">
          <Link
            href="/settings"
            className={`flex items-center gap-2.5 px-3 py-2 rounded transition-colors ${
              pathname === "/settings"
                ? "bg-[#EAF2F8] text-[#123B6D] font-bold border-l-4 border-[#123B6D]"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Settings className="w-4 h-4 text-[#123B6D]" />
            <span>Settings</span>
          </Link>
        </div>
      </div>

      {/* Platform Footer Strip at Bottom of Sidebar */}
      <div className="p-3 border-t border-[#D5DCE3] bg-gray-50 text-[10.5px] text-gray-500 text-center leading-normal space-y-1">
        <div className="font-medium text-gray-600">© 2026 GeoMine Intelligence Platform</div>
        <div className="text-[9.5px] text-gray-400">SIH 2026 Prototype • Non-Governmental</div>
      </div>
    </aside>
  );
}
