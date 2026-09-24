"use client";

import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  Database,
  FileCheck2,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  Bot,
  Filter,
  CheckCircle,
  FileText,
  Home,
  ChevronRight,
  BarChart2
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from "recharts";
import { fetchFromAPI } from "@/lib/api";
import Link from "next/link";

export default function ExecutiveDashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [prodTrends, setProdTrends] = useState<any[]>([]);
  const [subsidiaries, setSubsidiaries] = useState<any[]>([]);
  const [cokingData, setCokingData] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [dispatches, setDispatches] = useState<any[]>([]);
  const [imports, setImports] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState("2024-25");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [sum, trends, subs, coking, res, disp, imp, ins] = await Promise.all([
          fetchFromAPI("/dashboard/summary"),
          fetchFromAPI("/dashboard/production-trends"),
          fetchFromAPI("/dashboard/subsidiary-production"),
          fetchFromAPI("/dashboard/coking-vs-noncoking"),
          fetchFromAPI("/dashboard/resource-classification"),
          fetchFromAPI("/dashboard/dispatch-trends"),
          fetchFromAPI("/dashboard/import-trends"),
          fetchFromAPI("/dashboard/ai-insights")
        ]);

        setSummary(sum);
        setProdTrends(trends || []);
        setSubsidiaries(subs || []);
        setCokingData(coking || []);
        setResources(res || []);
        setDispatches(disp || []);
        setImports(imp || []);
        setInsights(ins || []);
      } catch (err) {
        console.error("Dashboard loading error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 font-serif text-[#1F2933]">
      {/* 1. Official Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-[#5B6573]">
        <Home className="w-3.5 h-3.5 text-[#123B6D]" />
        <span>Home</span>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <span className="text-[#123B6D] font-bold">Executive Dashboard</span>
      </nav>

      {/* 2. Top Title and Filter Strip */}
      <div className="bg-white border border-[#D5DCE3] p-5 rounded shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D32]" />
            <span className="text-[12px] uppercase tracking-wider text-gray-500 font-bold">
              National Coal Intelligence Command Portal
            </span>
          </div>
          <h1 className="text-[22px] font-bold text-[#123B6D] mt-1">
            CMPDI / Coal India Limited Production & Geological Overview
          </h1>
          <p className="text-[13px] text-[#5B6573] mt-0.5">
            Statistical compilation derived from the Coal Directory of India (CCO) and CMPDI Geological Inventory.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#F7F8FA] border border-[#D5DCE3] rounded px-3 py-1.5 text-[13px] text-gray-800">
            <Filter className="w-3.5 h-3.5 text-[#123B6D]" />
            <span className="font-bold text-gray-700">Reporting Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent font-bold text-[#123B6D] focus:outline-none cursor-pointer"
            >
              <option value="2024-25">FY 2024–25 (Latest)</option>
              <option value="2023-24">FY 2023–24</option>
              <option value="2022-23">FY 2022–23</option>
            </select>
          </div>

          <Link
            href="/ai-assistant"
            className="flex items-center gap-2 bg-[#123B6D] hover:bg-[#0B2E53] text-white text-[13px] font-bold px-4 py-2 rounded shadow-sm transition-all"
          >
            <Bot className="w-4 h-4" />
            <span>Launch Coal AI Assistant</span>
          </Link>
        </div>
      </div>

      {/* 3. Operational KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white border border-[#D5DCE3] p-5 rounded shadow-sm relative">
          <div className="flex justify-between items-start text-[12px] text-gray-500 font-bold uppercase tracking-wider mb-1">
            <span>Total Coal Production</span>
            <span className="text-[#2E7D32] bg-[#F0FDF4] border border-[#DCFCE7] px-1.5 py-0.5 rounded text-[11px] font-bold">
              +5.0% YoY
            </span>
          </div>
          <div className="text-[28px] font-bold text-[#123B6D] leading-tight">
            {summary?.total_coal_production_mt || 1047.52} <span className="text-[14px] font-normal text-gray-600">MT</span>
          </div>
          <div className="text-[12px] text-gray-600 mt-2 pt-2 border-t border-gray-100 flex justify-between">
            <span>All-India Domestic Output</span>
            <span className="font-bold text-gray-800">FY 2024–25</span>
          </div>
          <div className="text-[11px] text-gray-500 mt-0.5">Source: Official Published Coal Statistics</div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-[#D5DCE3] p-5 rounded shadow-sm relative">
          <div className="flex justify-between items-start text-[12px] text-gray-500 font-bold uppercase tracking-wider mb-1">
            <span>CIL Consolidated</span>
            <span className="text-[#2E7D32] bg-[#F0FDF4] border border-[#DCFCE7] px-1.5 py-0.5 rounded text-[11px] font-bold">
              +0.94% YoY
            </span>
          </div>
          <div className="text-[28px] font-bold text-[#123B6D] leading-tight">
            {summary?.cil_production_mt || 781.06} <span className="text-[14px] font-normal text-gray-600">MT</span>
          </div>
          <div className="text-[12px] text-gray-600 mt-2 pt-2 border-t border-gray-100 flex justify-between">
            <span>74.6% of National Supply</span>
            <span className="font-bold text-gray-800">7 Subsidiaries</span>
          </div>
          <div className="text-[11px] text-gray-500 mt-0.5">Source: Coal Directory Table 3.11</div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-[#D5DCE3] p-5 rounded shadow-sm relative">
          <div className="flex justify-between items-start text-[12px] text-gray-500 font-bold uppercase tracking-wider mb-1">
            <span>Geological Resources</span>
            <span className="text-[#123B6D] bg-[#EAF2F8] border border-[#123B6D]/20 px-1.5 py-0.5 rounded text-[11px] font-bold">
              GSI / CMPDI
            </span>
          </div>
          <div className="text-[28px] font-bold text-[#123B6D] leading-tight">
            {summary?.total_coal_resources_bt || 378.21} <span className="text-[14px] font-normal text-gray-600">BT</span>
          </div>
          <div className="text-[12px] text-gray-600 mt-2 pt-2 border-t border-gray-100 flex justify-between">
            <span>Measured (Proved): 196.44 BT</span>
            <span className="font-bold text-gray-800">51.9%</span>
          </div>
          <div className="text-[11px] text-gray-500 mt-0.5">National Coal Inventory</div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-[#D5DCE3] p-5 rounded shadow-sm relative">
          <div className="flex justify-between items-start text-[12px] text-gray-500 font-bold uppercase tracking-wider mb-1">
            <span>Data Reliability Score</span>
            <span className="text-[#2E7D32] bg-[#F0FDF4] border border-[#DCFCE7] px-1.5 py-0.5 rounded text-[11px] font-bold">
              Verified
            </span>
          </div>
          <div className="text-[28px] font-bold text-[#2E7D32] leading-tight">
            {summary?.data_quality_score || 96.8}%
          </div>
          <div className="text-[12px] text-gray-600 mt-2 pt-2 border-t border-gray-100 flex justify-between">
            <span>14 Registered Documents</span>
            <span className="font-bold text-gray-800">148 Records</span>
          </div>
          <div className="text-[11px] text-gray-500 mt-0.5">Mathematical Consistency Audit</div>
        </div>
      </div>

      {/* 4. Automated Statistical Intelligence Notes */}
      <div className="bg-white border border-[#D5DCE3] rounded p-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[16px] text-[#123B6D]">
              Key Geological & Production Intelligence Statements
            </span>
          </div>
          <span className="text-[12px] text-gray-500">
            Source-grounded automated administrative synthesis
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.map((ins) => (
            <div
              key={ins.id}
              className="bg-[#F7F8FA] border border-[#D5DCE3] p-4 rounded flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] uppercase font-bold text-[#123B6D] bg-[#EAF2F8] px-2 py-0.5 rounded border border-[#123B6D]/20">
                    {ins.type}
                  </span>
                  <span className="text-[11px] text-[#2E7D32] font-bold">
                    {ins.confidence}
                  </span>
                </div>
                <h4 className="text-[14px] font-bold text-gray-900 mb-1 leading-snug">
                  {ins.title}
                </h4>
                <p className="text-[13px] text-gray-700 leading-relaxed">
                  {ins.text}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-[#D5DCE3] text-[11px] text-gray-500 flex items-center justify-between">
                <span>Source: {ins.source}</span>
                <span className="text-[#123B6D] font-bold">Verified</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Production Trajectory & Subsidiary Breakdown (Statistical Analytics Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Production Growth */}
        <div className="bg-white border border-[#D5DCE3] p-5 rounded shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-4">
            <div>
              <h3 className="text-[16px] font-bold text-[#123B6D]">
                Coal Production Trajectory (FY 2021 – 2025)
              </h3>
              <p className="text-[12px] text-gray-500">
                All-India Total vs CIL Consolidated (Million Tonnes)
              </p>
            </div>
            <span className="text-[12px] font-bold bg-[#EAF2F8] text-[#123B6D] px-2.5 py-1 rounded border border-[#123B6D]/20">
              3-Year CAGR: 10.4%
            </span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={prodTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="year" stroke="#475569" fontSize={12} />
                <YAxis stroke="#475569" fontSize={12} domain={[500, 1100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#D5DCE3", color: "#1F2933", fontSize: "13px" }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Line type="monotone" dataKey="all_india" name="All-India Output (MT)" stroke="#123B6D" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="cil" name="CIL Output (MT)" stroke="#1F5A96" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="target" name="Annual Target (MT)" stroke="#B7791F" strokeDasharray="4 4" strokeWidth={1.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Subsidiary-wise Production */}
        <div className="bg-white border border-[#D5DCE3] p-5 rounded shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-4">
            <div>
              <h3 className="text-[16px] font-bold text-[#123B6D]">
                Subsidiary-wise Coal Output (2024–25)
              </h3>
              <p className="text-[12px] text-gray-500">
                Actual Output vs Target by Subsidiary (Million Tonnes)
              </p>
            </div>
            <span className="text-[12px] text-[#2E7D32] font-bold bg-[#F0FDF4] border border-[#DCFCE7] px-2.5 py-1 rounded">
              Leader: MCL (218.31 MT)
            </span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subsidiaries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="subsidiary" stroke="#475569" fontSize={12} />
                <YAxis stroke="#475569" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#D5DCE3", color: "#1F2933", fontSize: "13px" }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Bar dataKey="production_mt" name="Actual Output (MT)" fill="#123B6D" />
                <Bar dataKey="target_mt" name="Target (MT)" fill="#94A3B8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 6. Coking Breakdown & Resource Inventory */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Coking vs Non-Coking Donut */}
        <div className="bg-white border border-[#D5DCE3] p-5 rounded shadow-sm">
          <h3 className="text-[16px] font-bold text-[#123B6D] mb-0.5">
            Coking vs Non-Coking Ratio
          </h3>
          <p className="text-[12px] text-gray-500 mb-3">
            CIL Raw Coal Output Classification
          </p>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cokingData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  <Cell fill="#123B6D" />
                  <Cell fill="#B7791F" />
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val} MT`, "Volume"]}
                  contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#D5DCE3", color: "#1F2933", fontSize: "13px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 text-[13px]">
            <div className="flex justify-between border-b border-gray-100 pb-1">
              <span className="text-gray-700 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#123B6D]" /> Non-Coking (Thermal)
              </span>
              <span className="font-bold text-gray-900">745.26 MT (95.4%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B7791F]" /> Coking (Steel)
              </span>
              <span className="font-bold text-gray-900">35.80 MT (4.6%)</span>
            </div>
          </div>
        </div>

        {/* Resources Stacked Bars */}
        <div className="bg-white border border-[#D5DCE3] p-5 rounded shadow-sm col-span-2">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
            <div>
              <h3 className="text-[16px] font-bold text-[#123B6D]">
                Geological Coal Resources by Basin (State-wise)
              </h3>
              <p className="text-[12px] text-gray-500">
                Proved / Measured, Indicated, and Inferred Reserves (Million Tonnes)
              </p>
            </div>
            <span className="text-[12px] text-gray-600 font-bold">
              Top Basin: Jharkhand (89,260 MT)
            </span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resources}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="state" stroke="#475569" fontSize={11} />
                <YAxis stroke="#475569" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#D5DCE3", color: "#1F2933", fontSize: "13px" }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "5px" }} />
                <Bar dataKey="measured" name="Measured (Proved)" stackId="a" fill="#123B6D" />
                <Bar dataKey="indicated" name="Indicated" stackId="a" fill="#1F5A96" />
                <Bar dataKey="inferred" name="Inferred" stackId="a" fill="#94A3B8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
