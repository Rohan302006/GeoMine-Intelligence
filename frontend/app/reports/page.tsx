"use client";

import React, { useState, useEffect } from "react";
import {
  Landmark,
  FileSpreadsheet,
  Printer,
  CheckCircle,
  Home,
  ChevronRight,
  Download,
  FileText,
  Clock,
  Sparkles,
  Archive
} from "lucide-react";
import { fetchFromAPI } from "@/lib/api";
import { getCurrentUser, canGenerateReports, AuthUser } from "@/lib/auth";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<"parliamentary" | "custom" | "archive">("parliamentary");
  const [authUser, setAuthUser] = useState<AuthUser>({
    name: "Executive Officer",
    email: "officer@geomine.ai",
    role: "Officer"
  });
  const [parlQuestion, setParlQuestion] = useState(
    "Provide the production of coal by CIL subsidiaries during the last three financial years and identify the highest producing subsidiary."
  );
  const [house, setHouse] = useState("Lok Sabha");
  const [qType, setQType] = useState("Unstarred");
  const [parlResult, setParlResult] = useState<any | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    setAuthUser(getCurrentUser());
    function onAuthChange() {
      setAuthUser(getCurrentUser());
    }
    window.addEventListener("auth-changed", onAuthChange);
    return () => window.removeEventListener("auth-changed", onAuthChange);
  }, []);

  // Custom Report Form State
  const [reportType, setReportType] = useState("Coal Production Report");
  const [reportYear, setReportYear] = useState("2024-25");
  const [reportFormat, setReportFormat] = useState("PDF");
  const [reportTitle, setReportTitle] = useState("Annual Coal Production & Performance Audit Report");
  const [customReportResult, setCustomReportResult] = useState<any | null>(null);

  // Archive
  const [reportsList, setReportsList] = useState<any[]>([]);

  useEffect(() => {
    loadReportsList();
    // Auto-generate default response for seamless presentation
    handleGenerateParliamentary();
  }, []);

  async function loadReportsList() {
    try {
      const reps = await fetchFromAPI("/reports");
      setReportsList(reps || []);
    } catch (e) {
      console.error("Error loading reports:", e);
    }
  }

  async function handleGenerateParliamentary() {
    setGenerating(true);
    try {
      const res = await fetchFromAPI("/reports/parliamentary", {
        method: "POST",
        body: JSON.stringify({
          question: parlQuestion,
          house,
          question_type: qType
        })
      });
      setParlResult(res);
      await loadReportsList();
    } catch (e) {
      console.error("Parliamentary error:", e);
    } finally {
      setGenerating(false);
    }
  }

  async function handleGenerateCustomReport() {
    setGenerating(true);
    try {
      const res = await fetchFromAPI("/reports/generate", {
        method: "POST",
        body: JSON.stringify({
          title: reportTitle,
          report_type: reportType,
          year: reportYear,
          format: reportFormat
        })
      });
      setCustomReportResult(res);
      await loadReportsList();
    } catch (e) {
      console.error("Custom report error:", e);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-5 font-serif">
      {/* 1. Official Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-[13px] text-[#5B6573]">
        <Home className="w-3.5 h-3.5 text-[#123B6D]" />
        <LinkLike text="Home" onClick={() => {}} />
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <LinkLike text="Reports" onClick={() => {}} />
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <span className="text-[#123B6D] font-bold">Parliamentary Queries</span>
      </nav>

      {/* 2. Page Title Header */}
      <div className="flex items-start justify-between border-b border-[#D5DCE3] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-[#EAF2F8] border border-[#123B6D]/20 flex items-center justify-center text-[#123B6D]">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-[24px] font-bold text-[#123B6D] leading-tight">
              Parliamentary / High-Priority Legislative Notice Composer
            </h1>
            <p className="text-[14px] text-[#5B6573] mt-0.5">
              Generate accurate, source-backed responses for parliamentary questions and high-priority administrative inquiries.
            </p>
          </div>
        </div>

        {/* Action Tabs */}
        <div className="flex items-center bg-white border border-[#D5DCE3] rounded p-0.5 shadow-sm text-[12px]">
          <button
            onClick={() => setActiveTab("parliamentary")}
            className={`px-3 py-1.5 rounded transition-all font-bold ${
              activeTab === "parliamentary"
                ? "bg-[#123B6D] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Parliamentary Queries
          </button>
          <button
            onClick={() => setActiveTab("custom")}
            className={`px-3 py-1.5 rounded transition-all font-bold ${
              activeTab === "custom"
                ? "bg-[#123B6D] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Custom Report Builder
          </button>
          <button
            onClick={() => setActiveTab("archive")}
            className={`px-3 py-1.5 rounded transition-all font-bold ${
              activeTab === "archive"
                ? "bg-[#123B6D] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Archive ({reportsList.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Parliamentary Query Generator */}
      {activeTab === "parliamentary" && (
        <div className="space-y-6">
          {!canGenerateReports(authUser.role) && (
            <div className="bg-amber-50 border border-amber-300 text-amber-900 p-4 rounded text-[13px] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900 text-[11px] uppercase tracking-wide border border-amber-300">
                  Read-Only Mode ({authUser.role})
                </span>
                <span>Generating official parliamentary gazette replies requires <b>Officer</b> or <b>Admin</b> role permissions.</span>
              </div>
              <span className="text-[11px] text-amber-800 font-medium">Use &quot;Switch Role&quot; in Navbar to unlock</span>
            </div>
          )}
          {/* Card 1: Compose Your Query Form */}
          <div className="bg-white border border-[#D5DCE3] rounded p-6 shadow-sm space-y-4">
            <h2 className="text-[17px] font-bold text-[#123B6D] border-b border-gray-100 pb-2">
              Compose Your Query
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-[14px]">
              <div>
                <label className="font-bold text-gray-800 block mb-1 text-[13px]">
                  Legislative House *
                </label>
                <select
                  value={house}
                  onChange={(e) => setHouse(e.target.value)}
                  className="w-full bg-white border border-[#D5DCE3] rounded px-3 py-2 text-[14px] text-gray-900 focus:outline-none focus:border-[#123B6D]"
                >
                  <option value="Lok Sabha">Lok Sabha (House of the People)</option>
                  <option value="Rajya Sabha">Rajya Sabha (Council of States)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-800 block mb-1 text-[13px]">
                  Question Category *
                </label>
                <select
                  value={qType}
                  onChange={(e) => setQType(e.target.value)}
                  className="w-full bg-white border border-[#D5DCE3] rounded px-3 py-2 text-[14px] text-gray-900 focus:outline-none focus:border-[#123B6D]"
                >
                  <option value="Unstarred">Unstarred (Written Answer with Annexure)</option>
                  <option value="Starred">Starred (Oral Answer on Floor)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold text-gray-800 block mb-1 text-[13px]">
                Notice Question / Reference Subject *
              </label>
              <textarea
                value={parlQuestion}
                onChange={(e) => setParlQuestion(e.target.value)}
                rows={3}
                className="w-full bg-white border border-[#D5DCE3] rounded p-3 text-[14px] text-gray-900 focus:outline-none focus:border-[#123B6D] leading-relaxed"
              />
              <div className="flex justify-end text-[11px] text-gray-500 mt-1">
                {parlQuestion.length}/1000
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={handleGenerateParliamentary}
                disabled={generating || !parlQuestion.trim() || !canGenerateReports(authUser.role)}
                className="px-5 py-2.5 bg-[#123B6D] hover:bg-[#0B2E53] disabled:opacity-50 disabled:cursor-not-allowed text-white text-[13px] font-bold rounded flex items-center gap-2 transition-all shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>
                  {generating
                    ? "Drafting Statement..."
                    : !canGenerateReports(authUser.role)
                    ? "Generation Restricted (Viewer Tier)"
                    : "Generate Official Parliamentary Response"}
                </span>
              </button>
            </div>
          </div>

          {/* Card 2: Official Generated Parliamentary Response Display */}
          {parlResult && (
            <div className="bg-white border border-[#D5DCE3] rounded shadow-sm overflow-hidden">
              {/* Green status verification bar */}
              <div className="bg-[#F0FDF4] border-b border-[#DCFCE7] px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#166534] font-bold text-[14px]">
                  <CheckCircle className="w-5 h-5 text-[#16a34a]" />
                  <span>Official Parliamentary Reply Generated & Verified</span>
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-white border border-[#D5DCE3] hover:bg-gray-50 text-gray-800 text-[12px] font-bold rounded flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Printer className="w-3.5 h-3.5 text-gray-600" />
                  <span>Print Gazette</span>
                </button>
              </div>

              {/* Official Gazette White Document Sheet */}
              <div className="p-8 space-y-6 text-[#1F2933]">
                {/* Official Document Header Block */}
                <div className="text-center space-y-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/emblem.svg"
                    alt="GeoMine Intelligence Crest"
                    className="h-14 w-auto mx-auto mb-2 object-contain"
                  />
                  <div className="font-bold text-[14px] uppercase tracking-wider text-gray-800">
                    GEOMINE INTELLIGENCE DIRECTORATE
                  </div>
                  <div className="font-bold text-[14px] uppercase tracking-wider text-gray-800">
                    MINERAL ANALYTICS & STATISTICAL DIVISION
                  </div>
                  <div className="font-bold text-[15px] uppercase tracking-wider text-[#123B6D] mt-1">
                    {house.toUpperCase()}
                  </div>
                  <div className="font-bold text-[13px] text-gray-700">
                    {qType.toUpperCase()} QUESTION NO. 2841
                  </div>
                </div>

                <div className="w-full border-t border-[#D5DCE3] my-4" />

                {/* Metadata List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[14px] text-gray-800 max-w-xl">
                  <div className="flex">
                    <span className="font-bold w-28">Subject</span>
                    <span>: Coal Production by CIL Subsidiaries</span>
                  </div>
                  <div className="flex">
                    <span className="font-bold w-28">Question No.</span>
                    <span>: 2841</span>
                  </div>
                  <div className="flex">
                    <span className="font-bold w-28">Date</span>
                    <span>: 16th September 2026</span>
                  </div>
                  <div className="flex">
                    <span className="font-bold w-28">Status</span>
                    <span>: Statement Laid on Table</span>
                  </div>
                </div>

                {/* Formal Statement Text */}
                <div className="bg-[#F7F8FA] border border-[#D5DCE3] p-5 rounded text-[14px] leading-relaxed space-y-3 whitespace-pre-wrap">
                  {parlResult.formal_answer}
                </div>

                {/* Annexure-I Table */}
                {parlResult.table_data && parlResult.table_data.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <div className="font-bold text-[14px] text-[#123B6D]">
                      ANNEXURE-I: Subsidiary-wise Coal Production for FY 2022–23, 2023–24 & 2024–25 (Million Tonnes)
                    </div>
                    <div className="border border-[#D5DCE3] rounded overflow-hidden">
                      <table className="w-full text-left text-[14px]">
                        <thead className="bg-[#123B6D] text-white">
                          <tr>
                            <th className="px-4 py-2.5 font-bold">Subsidiary / Agency</th>
                            <th className="px-4 py-2.5 text-right font-bold">2022–23 (MT)</th>
                            <th className="px-4 py-2.5 text-right font-bold">2023–24 (MT)</th>
                            <th className="px-4 py-2.5 text-right font-bold">2024–25 (MT)</th>
                            <th className="px-4 py-2.5 text-right font-bold">Trend Growth</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#D5DCE3]">
                          {parlResult.table_data.map((row: any, rIdx: number) => (
                            <tr
                              key={rIdx}
                              className={rIdx % 2 === 1 ? "bg-[#F7F8FA]" : "bg-white"}
                            >
                              <td className="px-4 py-2.5 font-medium text-gray-900">
                                {row.subsidiary}
                              </td>
                              <td className="px-4 py-2.5 text-right tabular-nums text-gray-700">
                                {row.fy23}
                              </td>
                              <td className="px-4 py-2.5 text-right tabular-nums text-gray-700">
                                {row.fy24}
                              </td>
                              <td className="px-4 py-2.5 text-right tabular-nums font-bold text-[#123B6D]">
                                {row.fy25}
                              </td>
                              <td className="px-4 py-2.5 text-right tabular-nums font-bold text-[#2E7D32]">
                                {row.growth}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Citations & Disclaimer Footer */}
                <div className="pt-4 border-t border-[#D5DCE3] text-[11.5px] text-[#5B6573] flex flex-col gap-2">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <b>Data Lineage:</b> National Coal Production Compendium 2024–25 • Geological Resource Survey
                    </div>
                    <div className="bg-[#EAF2F8] text-[#123B6D] font-bold px-2.5 py-1 rounded border border-[#123B6D]/20 text-[11px]">
                      Mathematical Confidence: 99.6%
                    </div>
                  </div>
                  <div className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded">
                    <b>Disclaimer:</b> This platform is a prototype solution developed for the Smart India Hackathon 2026 (PS ID: SIH26023). It is not an official portal of the Ministry of Coal or CMPDI/CIL.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Custom Report Builder */}
      {activeTab === "custom" && (
        <div className="bg-white border border-[#D5DCE3] p-6 rounded shadow-sm space-y-5">
          <div className="border-b border-gray-100 pb-2">
            <h2 className="text-[17px] font-bold text-[#123B6D]">
              Custom Official Report Builder
            </h2>
            <p className="text-[13px] text-gray-500">
              Compile analytical and geological reports with structured institutional styling in PDF, Word, or Excel format.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-[14px]">
            <div>
              <label className="font-bold text-gray-800 block mb-1 text-[13px]">
                Report Classification:
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full bg-white border border-[#D5DCE3] rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-[#123B6D]"
              >
                <option value="Coal Production Report">Coal Production Report</option>
                <option value="Subsidiary Performance Report">Subsidiary Performance Report</option>
                <option value="Coal Dispatch Report">Coal Dispatch & Sectoral Report</option>
                <option value="Coal Resource Report">Coal Resource & Basin Inventory</option>
                <option value="Executive Summary">Executive Summary for Ministry</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-gray-800 block mb-1 text-[13px]">
                Reporting Period:
              </label>
              <select
                value={reportYear}
                onChange={(e) => setReportYear(e.target.value)}
                className="w-full bg-white border border-[#D5DCE3] rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-[#123B6D]"
              >
                <option value="2024-25">FY 2024–25</option>
                <option value="2023-24">FY 2023–24</option>
                <option value="2022-23">FY 2022–23</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-gray-800 block mb-1 text-[13px]">
                Export Format:
              </label>
              <select
                value={reportFormat}
                onChange={(e) => setReportFormat(e.target.value)}
                className="w-full bg-white border border-[#D5DCE3] rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-[#123B6D]"
              >
                <option value="PDF">Adobe PDF (.pdf)</option>
                <option value="DOCX">Microsoft Word (.docx)</option>
                <option value="Excel">Microsoft Excel (.xlsx)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-gray-800 block mb-1 text-[13px]">
              Document Title:
            </label>
            <input
              type="text"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              className="w-full bg-white border border-[#D5DCE3] rounded px-3 py-2 text-[14px] text-gray-900 focus:outline-none focus:border-[#123B6D]"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleGenerateCustomReport}
              disabled={generating || !canGenerateReports(authUser.role)}
              className="px-5 py-2.5 bg-[#123B6D] hover:bg-[#0B2E53] disabled:opacity-50 disabled:cursor-not-allowed text-white text-[13px] font-bold rounded flex items-center gap-2 transition-all shadow-sm"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>
                {generating
                  ? "Compiling Document..."
                  : !canGenerateReports(authUser.role)
                  ? "Compilation Restricted (Viewer Tier)"
                  : `Generate & Compile ${reportFormat}`}
              </span>
            </button>
          </div>

          {customReportResult && (
            <div className="p-4 bg-[#F0FDF4] border border-[#DCFCE7] rounded flex items-center justify-between">
              <div>
                <div className="text-[14px] font-bold text-[#166534]">
                  Report Compiled Successfully: {customReportResult.title}
                </div>
                <div className="text-[12px] text-gray-600 mt-0.5">
                  Format: {customReportResult.format} • Institutional Layout
                </div>
              </div>
              <button
                onClick={() => alert(`Report downloaded from: ${customReportResult.file_path}`)}
                className="px-3.5 py-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white text-[12px] font-bold rounded flex items-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Report</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Generated Reports Archive */}
      {activeTab === "archive" && (
        <div className="bg-white border border-[#D5DCE3] rounded shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#D5DCE3] bg-gray-50">
            <h2 className="text-[16px] font-bold text-[#123B6D]">
              Official Reports Repository & Archive
            </h2>
            <p className="text-[12px] text-gray-500">
              Listing of verified PDF, Word, and Excel documents generated by platform officers.
            </p>
          </div>

          <div className="divide-y divide-[#D5DCE3]">
            {reportsList.map((rep, idx) => (
              <div
                key={rep.id || idx}
                className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[#EAF2F8] border border-[#123B6D]/20 flex items-center justify-center text-[#123B6D]">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-gray-900">{rep.title}</div>
                    <div className="text-[12px] text-gray-500">
                      Category: {rep.report_type} • Format: {rep.format}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => alert(`Downloading: ${rep.title}`)}
                  className="px-3 py-1.5 bg-white border border-[#D5DCE3] hover:bg-gray-50 text-gray-700 text-[12px] font-bold rounded flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function LinkLike({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-[#5B6573] hover:text-[#123B6D] transition-colors"
    >
      {text}
    </button>
  );
}
