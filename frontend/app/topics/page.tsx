"use client";

import React, { useState, useEffect } from "react";
import { Cloud, TrendingUp, Home, ChevronRight, Hash } from "lucide-react";
import { fetchFromAPI } from "@/lib/api";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  LineChart,
  Line
} from "recharts";

export default function TopicsPage() {
  const [wordCloud, setWordCloud] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [trends, setTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTopicData() {
      try {
        const [wc, top, tr] = await Promise.all([
          fetchFromAPI("/topics/wordcloud"),
          fetchFromAPI("/topics/distribution"),
          fetchFromAPI("/topics/trends")
        ]);
        setWordCloud(wc || []);
        setTopics(top || []);
        setTrends(tr || []);
      } catch (e) {
        console.error("Topics error:", e);
      } finally {
        setLoading(false);
      }
    }
    loadTopicData();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-5 font-serif text-[#1F2933]">
      {/* 1. Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-[#5B6573]">
        <Home className="w-3.5 h-3.5 text-[#123B6D]" />
        <span>Home</span>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <span className="text-[#123B6D] font-bold">Topics & Word Cloud</span>
      </nav>

      {/* 2. Official Header */}
      <div className="bg-white border border-[#D5DCE3] p-5 rounded shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#123B6D]">
            Geological & Mining Topic Identification Engine
          </h1>
          <p className="text-[13px] text-[#5B6573] mt-0.5">
            Statistical term frequency analysis and multi-year legislative topic trajectories across coal repository publications.
          </p>
        </div>
      </div>

      {/* 3. Word Cloud Mosaic (Muted Institutional Shades of Navy and Slate) */}
      <div className="bg-white border border-[#D5DCE3] p-6 rounded shadow-sm">
        <h2 className="text-[14px] font-bold uppercase tracking-wider text-[#123B6D] mb-3 flex items-center gap-2">
          <Hash className="w-4 h-4 text-[#123B6D]" />
          <span>Mining Domain Frequency Term Cloud</span>
        </h2>
        <div className="flex flex-wrap gap-2.5 items-center justify-center p-6 bg-[#F7F8FA] rounded border border-[#D5DCE3] min-h-[180px]">
          {wordCloud.map((w, idx) => {
            const fontSizes = ["text-[13px]", "text-[15px]", "text-[17px]", "text-[19px]", "text-[22px]", "text-[26px]"];
            const colors = ["text-[#123B6D]", "text-[#1F5A96]", "text-[#334155]", "text-[#0B2E53]", "text-[#475569]"];
            const sizeClass = fontSizes[Math.min(Math.floor(w.value / 2), fontSizes.length - 1)];
            const colorClass = colors[idx % colors.length];

            return (
              <span
                key={idx}
                className={`${sizeClass} ${colorClass} font-bold px-2.5 py-1 rounded bg-white border border-[#D5DCE3] hover:border-[#123B6D] transition-all cursor-pointer shadow-xs`}
                title={`${w.text}: ${w.value} occurrences`}
              >
                {w.text}
              </span>
            );
          })}
        </div>
      </div>

      {/* 4. Topic Distribution & Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Table/List of Topic Distribution */}
        <div className="bg-white border border-[#D5DCE3] p-5 rounded shadow-sm">
          <h3 className="text-[16px] font-bold text-[#123B6D] mb-1">
            Domain Topic Distribution
          </h3>
          <p className="text-[12px] text-gray-500 mb-4">
            Relative occurrence across verified documents
          </p>
          <div className="space-y-3">
            {topics.map((t, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[13px]">
                  <span className="font-bold text-gray-800">{t.topic}</span>
                  <span className="text-gray-600 font-bold">{t.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-[#D5DCE3]">
                  <div
                    className="h-full bg-[#123B6D] rounded-full"
                    style={{ width: `${Math.max(t.percentage * 2, 8)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Multi-Year Topic Trajectory Chart */}
        <div className="bg-white border border-[#D5DCE3] p-5 rounded shadow-sm">
          <h3 className="text-[16px] font-bold text-[#123B6D] mb-1">
            Topic Mentions Over Time
          </h3>
          <p className="text-[12px] text-gray-500 mb-4">
            Shifts in legislative and technical focus across financial years
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="year" stroke="#475569" fontSize={12} />
                <YAxis stroke="#475569" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#D5DCE3", color: "#1F2933", fontSize: "13px" }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "5px" }} />
                <Line type="monotone" dataKey="Opencast Mining" stroke="#123B6D" strokeWidth={2.5} />
                <Line type="monotone" dataKey="Exploration" stroke="#1F5A96" strokeWidth={2} />
                <Line type="monotone" dataKey="Safety & Environment" stroke="#B7791F" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
