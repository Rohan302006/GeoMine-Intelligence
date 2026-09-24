"use client";

import React from "react";
import { Settings, ShieldCheck, User, Database, Home, ChevronRight } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-5 font-serif text-[#1F2933]">
      {/* 1. Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-[#5B6573]">
        <Home className="w-3.5 h-3.5 text-[#123B6D]" />
        <span>Home</span>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <span className="text-[#123B6D] font-bold">System Configuration & Settings</span>
      </nav>

      {/* 2. Header */}
      <div className="bg-white border border-[#D5DCE3] p-5 rounded shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#123B6D]">
            System Configuration & Administrative Settings
          </h1>
          <p className="text-[13px] text-[#5B6573] mt-0.5">
            Institutional permissions, data governance parameters, and database connection profiles.
          </p>
        </div>
      </div>

      {/* 3. Settings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Profile */}
        <div className="bg-white border border-[#D5DCE3] p-6 rounded shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-[#123B6D] font-bold text-[16px] border-b border-gray-100 pb-2">
            <User className="w-4 h-4" />
            <span>Authenticated Officer Profile</span>
          </div>

          <div className="space-y-3 text-[14px]">
            <div>
              <span className="text-gray-500 block text-[11px] font-bold uppercase">Active Role Profile</span>
              <span className="font-bold text-gray-900">Executive Officer</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[11px] font-bold uppercase">Role & Access Tier</span>
              <span className="text-[#123B6D] font-bold bg-[#EAF2F8] px-2.5 py-0.5 rounded border border-[#123B6D]/20 inline-block text-[12px]">
                Officer (Data Analysis & Report Compilation)
              </span>
            </div>
            <div>
              <span className="text-gray-500 block text-[11px] font-bold uppercase">Operational Station</span>
              <span className="text-gray-800">Analytical Operations Headquarters</span>
            </div>
          </div>
        </div>

        {/* Database & Governance */}
        <div className="bg-white border border-[#D5DCE3] p-6 rounded shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-[#123B6D] font-bold text-[16px] border-b border-gray-100 pb-2">
            <Database className="w-4 h-4" />
            <span>Data Governance & Storage Engine</span>
          </div>

          <div className="space-y-3 text-[14px]">
            <div>
              <span className="text-gray-500 block text-[11px] font-bold uppercase">Active Database Engine</span>
              <span className="font-bold text-gray-900">PostgreSQL (with SQLite Fallback Integration)</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[11px] font-bold uppercase">Vector Indexing</span>
              <span className="text-[#2E7D32] font-bold bg-[#F0FDF4] px-2.5 py-0.5 rounded border border-[#DCFCE7] inline-block text-[12px]">
                Deterministic Cosine Similarity Active
              </span>
            </div>
            <div>
              <span className="text-gray-500 block text-[11px] font-bold uppercase">Statistical Compliance Baseline</span>
              <span className="text-gray-800">Coal Controller&apos;s Organisation (CCO) Annual Standards</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
