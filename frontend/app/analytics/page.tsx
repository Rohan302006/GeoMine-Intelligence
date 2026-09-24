"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  BarChart3,
  GitCompare,
  Home,
  ChevronRight,
  Filter
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  LineChart,
  Line
} from "recharts";

export default function AnalyticsPage() {
  const [sub1, setSub1] = useState("MCL");
  const [sub2, setSub2] = useState("SECL");

  const comparisonData = [
    { year: "2021-22", MCL: 168.17, SECL: 142.51, NCL: 122.43, CCL: 68.85 },
    { year: "2022-23", MCL: 193.28, SECL: 167.00, NCL: 131.00, CCL: 76.09 },
    { year: "2023-24", MCL: 218.31, SECL: 176.29, NCL: 140.50, CCL: 82.26 },
    { year: "2024-25", MCL: 218.31, SECL: 176.29, NCL: 140.50, CCL: 82.26 }
  ];

  const subsidiaryProfiles: any = {
    MCL: { name: "Mahanadi Coalfields", state: "Odisha", share: "28.0%", growth: "+12.9% (3-Yr CAGR)", opencast: "99.5%" },
    SECL: { name: "South Eastern Coalfields", state: "Chhattisgarh / MP", share: "22.6%", growth: "+5.6% (3-Yr CAGR)", opencast: "95.2%" },
    NCL: { name: "Northern Coalfields", state: "Singrauli (MP/UP)", share: "18.0%", growth: "+7.2% (3-Yr CAGR)", opencast: "100.0%" },
    CCL: { name: "Central Coalfields", state: "Jharkhand", share: "10.5%", growth: "+8.1% (3-Yr CAGR)", opencast: "94.0%" },
    WCL: { name: "Western Coalfields", state: "Maharashtra / MP", share: "8.1%", growth: "-1.2% (3-Yr CAGR)", opencast: "88.0%" },
    ECL: { name: "Eastern Coalfields", state: "West Bengal / Jharkhand", share: "6.7%", growth: "+9.2% (3-Yr CAGR)", opencast: "85.0%" },
    BCCL: { name: "Bharat Coking Coal", state: "Dhanbad (Jharkhand)", share: "4.5%", growth: "+0.0% (3-Yr CAGR)", opencast: "89.0%" }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-5 font-serif text-[#1F2933]">
      {/* 1. Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-[#5B6573]">
        <Home className="w-3.5 h-3.5 text-[#123B6D]" />
        <span>Home</span>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <span className="text-[#123B6D] font-bold">Comparative Subsidiary Analytics</span>
      </nav>

      {/* 2. Header */}
      <div className="bg-white border border-[#D5DCE3] p-5 rounded shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#123B6D]">
            Comparative Subsidiary & Multi-Year Growth Analytics
          </h1>
          <p className="text-[13px] text-[#5B6573] mt-0.5">
            Statistical trend curves, compound annual growth rates (CAGR), and operational variances across operating basins.
          </p>
        </div>
      </div>

      {/* 3. Subsidiary Selection Strip */}
      <div className="bg-white border border-[#D5DCE3] p-4 rounded shadow-sm flex flex-wrap items-center gap-4 text-[14px]">
        <GitCompare className="w-4 h-4 text-[#123B6D]" />
        <span className="font-bold text-gray-800">Compare Operating Subsidiaries:</span>
        <select
          value={sub1}
          onChange={(e) => setSub1(e.target.value)}
          className="bg-white border border-[#D5DCE3] rounded px-3 py-1.5 text-[#123B6D] font-bold focus:outline-none"
        >
          {Object.keys(subsidiaryProfiles).map((k) => (
            <option key={k} value={k}>{k} ({subsidiaryProfiles[k].name})</option>
          ))}
        </select>
        <span className="text-gray-400 font-bold">VS</span>
        <select
          value={sub2}
          onChange={(e) => setSub2(e.target.value)}
          className="bg-white border border-[#D5DCE3] rounded px-3 py-1.5 text-[#123B6D] font-bold focus:outline-none"
        >
          {Object.keys(subsidiaryProfiles).map((k) => (
            <option key={k} value={k}>{k} ({subsidiaryProfiles[k].name})</option>
          ))}
        </select>
      </div>

      {/* 4. Comparative Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-[#D5DCE3] p-5 rounded shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h3 className="text-[16px] font-bold text-[#123B6D]">{sub1} — {subsidiaryProfiles[sub1]?.name}</h3>
            <span className="text-[12px] bg-[#EAF2F8] text-[#123B6D] px-2.5 py-0.5 rounded font-bold border border-[#123B6D]/20">
              {subsidiaryProfiles[sub1]?.share} of CIL
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[13px]">
            <div className="bg-[#F7F8FA] p-2.5 rounded border border-[#D5DCE3]">
              <span className="text-gray-500 block text-[11px] font-bold uppercase">Basin State</span>
              <span className="font-bold text-gray-800">{subsidiaryProfiles[sub1]?.state}</span>
            </div>
            <div className="bg-[#F7F8FA] p-2.5 rounded border border-[#D5DCE3]">
              <span className="text-gray-500 block text-[11px] font-bold uppercase">Growth Trajectory</span>
              <span className="font-bold text-[#2E7D32]">{subsidiaryProfiles[sub1]?.growth}</span>
            </div>
            <div className="bg-[#F7F8FA] p-2.5 rounded border border-[#D5DCE3] col-span-2">
              <span className="text-gray-500 block text-[11px] font-bold uppercase">Mining Technology Profile</span>
              <span className="font-bold text-gray-800">{subsidiaryProfiles[sub1]?.opencast} Opencast Mechanization</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#D5DCE3] p-5 rounded shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h3 className="text-[16px] font-bold text-[#123B6D]">{sub2} — {subsidiaryProfiles[sub2]?.name}</h3>
            <span className="text-[12px] bg-[#EAF2F8] text-[#123B6D] px-2.5 py-0.5 rounded font-bold border border-[#123B6D]/20">
              {subsidiaryProfiles[sub2]?.share} of CIL
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[13px]">
            <div className="bg-[#F7F8FA] p-2.5 rounded border border-[#D5DCE3]">
              <span className="text-gray-500 block text-[11px] font-bold uppercase">Basin State</span>
              <span className="font-bold text-gray-800">{subsidiaryProfiles[sub2]?.state}</span>
            </div>
            <div className="bg-[#F7F8FA] p-2.5 rounded border border-[#D5DCE3]">
              <span className="text-gray-500 block text-[11px] font-bold uppercase">Growth Trajectory</span>
              <span className="font-bold text-[#2E7D32]">{subsidiaryProfiles[sub2]?.growth}</span>
            </div>
            <div className="bg-[#F7F8FA] p-2.5 rounded border border-[#D5DCE3] col-span-2">
              <span className="text-gray-500 block text-[11px] font-bold uppercase">Mining Technology Profile</span>
              <span className="font-bold text-gray-800">{subsidiaryProfiles[sub2]?.opencast} Opencast Mechanization</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Production Growth Curves Chart */}
      <div className="bg-white border border-[#D5DCE3] p-5 rounded shadow-sm">
        <h3 className="text-[16px] font-bold text-[#123B6D] mb-0.5">
          Comparative Production Trajectories
        </h3>
        <p className="text-[12px] text-gray-500 mb-4">
          Historical raw coal production over 4 financial years (Million Tonnes)
        </p>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="year" stroke="#475569" fontSize={12} />
              <YAxis stroke="#475569" fontSize={12} domain={[50, 250]} />
              <Tooltip
                contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#D5DCE3", color: "#1F2933", fontSize: "13px" }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
              <Line type="monotone" dataKey={sub1} stroke="#123B6D" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey={sub2} stroke="#1F5A96" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
