"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, RefreshCw, UserCheck, Home, ChevronRight } from "lucide-react";
import { fetchFromAPI } from "@/lib/api";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuditLogs();
  }, []);

  async function loadAuditLogs() {
    try {
      setLoading(true);
      const data = await fetchFromAPI("/audit");
      setLogs(data || []);
    } catch (e) {
      console.error("Audit log error:", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-5 font-serif text-[#1F2933]">
      {/* 1. Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-[#5B6573]">
        <Home className="w-3.5 h-3.5 text-[#123B6D]" />
        <span>Home</span>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <span className="text-[#123B6D] font-bold">Audit & Traceability Logs</span>
      </nav>

      {/* 2. Header */}
      <div className="bg-white border border-[#D5DCE3] p-5 rounded shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#123B6D]">
            System Audit Trail & Compliance Verification Log
          </h1>
          <p className="text-[13px] text-[#5B6573] mt-0.5">
            Immutable tracking of every AI query, parliamentary report generation, file ingestion, and validation resolution.
          </p>
        </div>
        <button
          onClick={loadAuditLogs}
          className="flex items-center gap-1.5 text-[13px] bg-white border border-[#D5DCE3] hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded transition-colors shadow-sm font-bold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Audit Trail</span>
        </button>
      </div>

      {/* 3. Audit Table */}
      <div className="bg-white border border-[#D5DCE3] rounded shadow-sm overflow-hidden">
        <div className="px-6 py-3.5 border-b border-[#D5DCE3] bg-gray-50 flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-[#123B6D]">
            Official Compliance & Event Log Repository
          </h2>
          <span className="text-[12px] text-gray-600 font-bold">
            {logs.length} Operations Recorded
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px]">
            <thead className="bg-[#123B6D] text-white">
              <tr>
                <th className="px-4 py-2.5 font-bold">Timestamp</th>
                <th className="px-4 py-2.5 font-bold">Officer / Actor</th>
                <th className="px-3 py-2.5 font-bold">Action</th>
                <th className="px-3 py-2.5 font-bold">Entity</th>
                <th className="px-5 py-2.5 font-bold">Activity Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D5DCE3]">
              {logs.map((log, idx) => (
                <tr
                  key={log.id || idx}
                  className={idx % 2 === 1 ? "bg-[#F7F8FA]" : "bg-white"}
                >
                  <td className="px-4 py-2.5 font-mono text-[12px] text-gray-600 whitespace-nowrap">
                    {log.timestamp ? new Date(log.timestamp).toLocaleString() : "2026-09-15 10:42"}
                  </td>
                  <td className="px-4 py-2.5 font-bold text-gray-900 flex items-center gap-2">
                    <UserCheck className="w-3.5 h-3.5 text-[#123B6D]" />
                    <span>{log.user_name}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="bg-[#EAF2F8] text-[#123B6D] border border-[#123B6D]/20 px-2 py-0.5 rounded text-[11px] font-bold">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-gray-800">
                    {log.entity} {log.entity_id ? `(#${log.entity_id})` : ""}
                  </td>
                  <td className="px-5 py-2.5 text-gray-700 max-w-md truncate">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
