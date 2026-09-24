"use client";

import React, { useState, useEffect } from "react";
import { Database, ExternalLink, ShieldCheck, Home, ChevronRight, CheckCircle2 } from "lucide-react";
import { fetchFromAPI } from "@/lib/api";

export default function DataCatalogPage() {
  const [catalog, setCatalog] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCatalog() {
      try {
        const data = await fetchFromAPI("/catalog");
        setCatalog(data || []);
      } catch (e) {
        console.error("Catalog error:", e);
      } finally {
        setLoading(false);
      }
    }
    loadCatalog();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-5 font-serif text-[#1F2933]">
      {/* 1. Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-[#5B6573]">
        <Home className="w-3.5 h-3.5 text-[#123B6D]" />
        <span>Home</span>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <span className="text-[#123B6D] font-bold">Ministry Data Catalog</span>
      </nav>

      {/* 2. Official Header */}
      <div className="bg-white border border-[#D5DCE3] p-5 rounded shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#123B6D]">
            Public Coal Statistical Catalog & Knowledge Lineage
          </h1>
          <p className="text-[13px] text-[#5B6573] mt-0.5">
            Registered public datasets, statistical compendiums, and geological inventories.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[12px] bg-[#F7F8FA] border border-[#D5DCE3] px-3 py-1.5 rounded text-gray-700">
          <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
          <span>Public Data Lineage Verified</span>
        </div>
      </div>

      {/* 3. Catalog Items List */}
      <div className="space-y-4">
        {catalog.map((item, idx) => (
          <div
            key={item.id || idx}
            className="bg-white border border-[#D5DCE3] p-5 rounded shadow-sm space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-2">
              <div className="flex items-center gap-2.5">
                <span className="text-[12px] font-bold text-[#123B6D] bg-[#EAF2F8] px-2 py-0.5 rounded border border-[#123B6D]/20">
                  {item.id}
                </span>
                <h2 className="text-[16px] font-bold text-[#123B6D]">{item.name}</h2>
              </div>
              <span className="text-[12px] text-[#2E7D32] font-bold bg-[#F0FDF4] border border-[#DCFCE7] px-2.5 py-0.5 rounded flex items-center gap-1 self-start sm:self-auto">
                <CheckCircle2 className="w-3.5 h-3.5" /> {item.status}
              </span>
            </div>

            <p className="text-[14px] text-gray-700 leading-relaxed">{item.description}</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[13px]">
              <div className="bg-[#F7F8FA] p-2.5 rounded border border-[#D5DCE3]">
                <span className="text-gray-500 block text-[11px] font-bold uppercase">Source Agency</span>
                <span className="font-bold text-gray-900">{item.source}</span>
              </div>
              <div className="bg-[#F7F8FA] p-2.5 rounded border border-[#D5DCE3]">
                <span className="text-gray-500 block text-[11px] font-bold uppercase">Coverage</span>
                <span className="font-bold text-gray-900">{item.coverage}</span>
              </div>
              <div className="bg-[#F7F8FA] p-2.5 rounded border border-[#D5DCE3]">
                <span className="text-gray-500 block text-[11px] font-bold uppercase">Reconciled Records</span>
                <span className="font-bold text-[#123B6D]">{item.record_count} Records</span>
              </div>
              <div className="bg-[#F7F8FA] p-2.5 rounded border border-[#D5DCE3]">
                <span className="text-gray-500 block text-[11px] font-bold uppercase">Reliability Index</span>
                <span className="font-bold text-[#2E7D32]">{item.quality_score}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[12px] text-gray-500 pt-1">
              <span>Publication Date: {item.publication_date}</span>
              <a
                href={item.source_url}
                target="_blank"
                rel="noreferrer"
                className="text-[#123B6D] font-bold hover:underline flex items-center gap-1"
              >
                <span>View Source Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
