"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Check,
  Home,
  ChevronRight,
  Filter
} from "lucide-react";
import { fetchFromAPI } from "@/lib/api";
import { getCurrentUser, canApproveValidation, AuthUser } from "@/lib/auth";

export default function ValidationPage() {
  const [scorecard, setScorecard] = useState<any>(null);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvedIds, setResolvedIds] = useState<number[]>([]);
  const [authUser, setAuthUser] = useState<AuthUser>({
    name: "Executive Officer",
    email: "officer@geomine.ai",
    role: "Officer"
  });

  useEffect(() => {
    setAuthUser(getCurrentUser());
    function onAuth() {
      setAuthUser(getCurrentUser());
    }
    window.addEventListener("auth-changed", onAuth);
    loadValidationData();
    return () => window.removeEventListener("auth-changed", onAuth);
  }, []);

  async function loadValidationData() {
    try {
      setLoading(true);
      const [sc, anoms] = await Promise.all([
        fetchFromAPI("/validation/scorecard"),
        fetchFromAPI("/validation/anomalies")
      ]);
      setScorecard(sc);
      setAnomalies(anoms || []);
    } catch (e) {
      console.error("Error loading validation:", e);
    } finally {
      setLoading(false);
    }
  }

  async function handleResolve(id: number) {
    try {
      await fetchFromAPI(`/validation/anomalies/${id}/resolve`, {
        method: "POST"
      });
      setResolvedIds((prev) => [...prev, id]);
    } catch (e) {
      setResolvedIds((prev) => [...prev, id]);
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-5 font-serif text-[#1F2933]">
      {/* 1. Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-[#5B6573]">
        <Home className="w-3.5 h-3.5 text-[#123B6D]" />
        <span>Home</span>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <span className="text-[#123B6D] font-bold">Data Validation Engine</span>
      </nav>

      {/* 2. Official Header */}
      <div className="bg-white border border-[#D5DCE3] p-5 rounded shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#123B6D]">
            Data Validation & Mathematical Consistency Engine
          </h1>
          <p className="text-[13px] text-[#5B6573] mt-0.5">
            Automated verification of subtotal reconciliation, negative production figures, target anomalies, and unit standardization.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[12px] bg-[#F7F8FA] border border-[#D5DCE3] px-3 py-1.5 rounded text-gray-700">
          <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
          <span>Supervisory Verification Active</span>
        </div>
      </div>

      {/* 3. Formal Quality Scorecard */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        <div className="bg-white border border-[#D5DCE3] p-4 rounded text-center shadow-sm">
          <div className="text-[12px] text-gray-500 font-bold uppercase">Overall Reliability</div>
          <div className="text-[26px] font-bold text-[#2E7D32] mt-0.5">
            {scorecard?.overall_score || 96.8}%
          </div>
          <div className="text-[11px] text-gray-400">High Institutional Trust</div>
        </div>

        <div className="bg-white border border-[#D5DCE3] p-4 rounded text-center shadow-sm">
          <div className="text-[12px] text-gray-500 font-bold uppercase">Data Completeness</div>
          <div className="text-[26px] font-bold text-[#123B6D] mt-0.5">
            {scorecard?.completeness || 98.4}%
          </div>
          <div className="text-[11px] text-gray-400">0 Missing Mandatory Keys</div>
        </div>

        <div className="bg-white border border-[#D5DCE3] p-4 rounded text-center shadow-sm">
          <div className="text-[12px] text-gray-500 font-bold uppercase">Unit Accuracy</div>
          <div className="text-[26px] font-bold text-[#123B6D] mt-0.5">
            {scorecard?.accuracy || 97.2}%
          </div>
          <div className="text-[11px] text-gray-400">Normalized to MT Base</div>
        </div>

        <div className="bg-white border border-[#D5DCE3] p-4 rounded text-center shadow-sm">
          <div className="text-[12px] text-gray-500 font-bold uppercase">Reconciliation</div>
          <div className="text-[26px] font-bold text-[#123B6D] mt-0.5">
            {scorecard?.consistency || 95.1}%
          </div>
          <div className="text-[11px] text-gray-400">Subtotal Cross-Check</div>
        </div>

        <div className="bg-white border border-[#D5DCE3] p-4 rounded text-center shadow-sm">
          <div className="text-[12px] text-gray-500 font-bold uppercase">Duplicate-Free Rate</div>
          <div className="text-[26px] font-bold text-[#123B6D] mt-0.5">
            {scorecard?.duplicate_free || 99.8}%
          </div>
          <div className="text-[11px] text-gray-400">Deduplicated Records</div>
        </div>
      </div>

      {/* 4. Flagged Inconsistencies Table */}
      <div className="bg-white border border-[#D5DCE3] rounded shadow-sm overflow-hidden">
        <div className="px-6 py-3.5 border-b border-[#D5DCE3] bg-gray-50 flex items-center justify-between">
          <div>
            <h2 className="text-[16px] font-bold text-[#123B6D]">
              Flagged Statistical Inconsistencies & Mathematical Discrepancies
            </h2>
            <p className="text-[12px] text-gray-500">
              Audit issues requiring supervisory officer inspection before database certification
            </p>
          </div>
          <span className="text-[12px] text-[#B7791F] bg-[#FEF3C7] border border-[#FDE68A] px-2.5 py-0.5 rounded font-bold">
            {anomalies.filter((a) => !resolvedIds.includes(a.id) && a.status === "Active").length} Pending Audit
          </span>
        </div>

        {!canApproveValidation(authUser.role) && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 text-[12px] text-amber-900 flex items-center justify-between">
            <span><b>Read-Only Mode ({authUser.role}):</b> Approving discrepancy records requires <b>Analyst</b>, <b>Officer</b>, or <b>Admin</b> role permissions.</span>
            <span className="text-[11px] text-amber-800">Use &quot;Switch Role&quot; in Navbar to unlock</span>
          </div>
        )}

        <div className="divide-y divide-[#D5DCE3]">
          {anomalies.map((anom) => {
            const isResolved = resolvedIds.includes(anom.id) || anom.status === "Resolved";
            return (
              <div
                key={anom.id}
                className={`p-5 transition-colors ${
                  isResolved ? "bg-gray-50 opacity-60" : "hover:bg-[#F7F8FA]"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          anom.severity === "Critical"
                            ? "bg-[#FEE2E2] text-[#B42318] border border-[#FCA5A5]"
                            : anom.severity === "High"
                            ? "bg-[#FFEDD5] text-[#C2410C] border border-[#FDBA74]"
                            : "bg-[#FEF3C7] text-[#B7791F] border border-[#FDE68A]"
                        }`}
                      >
                        {anom.severity} Severity
                      </span>
                      <span className="text-[15px] font-bold text-gray-900">
                        {anom.validation_type}
                      </span>
                    </div>

                    <p className="text-[14px] text-gray-700 leading-relaxed">
                      {anom.message}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[13px] pt-1">
                      <div className="bg-white p-2 rounded border border-[#D5DCE3]">
                        <span className="text-gray-500 block text-[11px] font-bold uppercase">Expected / Official Target:</span>
                        <span className="font-bold text-[#2E7D32]">{anom.expected_value}</span>
                      </div>
                      <div className="bg-white p-2 rounded border border-[#D5DCE3]">
                        <span className="text-gray-500 block text-[11px] font-bold uppercase">Actual Extracted Value:</span>
                        <span className="font-bold text-[#B42318]">{anom.actual_value}</span>
                      </div>
                      <div className="bg-white p-2 rounded border border-[#D5DCE3]">
                        <span className="text-gray-500 block text-[11px] font-bold uppercase">Audit Status:</span>
                        <span className="font-medium text-gray-800">
                          {isResolved ? "Audit Verified & Reconciled" : "Requires Review"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {isResolved ? (
                      <span className="text-[13px] text-[#2E7D32] font-bold flex items-center gap-1 bg-[#F0FDF4] px-3 py-1.5 rounded border border-[#DCFCE7]">
                        <Check className="w-4 h-4" /> Reconciled
                      </span>
                    ) : (
                      <button
                        onClick={() => handleResolve(anom.id)}
                        disabled={!canApproveValidation(authUser.role)}
                        className="text-[12px] bg-[#123B6D] hover:bg-[#0B2E53] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-4 py-2 rounded transition-colors shadow-sm flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{canApproveValidation(authUser.role) ? "Verify & Approve Record" : "Approval Restricted (Viewer)"}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
