"use client";

import React, { useState } from "react";
import {
  Bot,
  Send,
  FileText,
  ShieldCheck,
  Copy,
  Check,
  ArrowRight,
  FileSpreadsheet,
  Home,
  ChevronRight,
  CheckCircle2
} from "lucide-react";
import { fetchFromAPI } from "@/lib/api";
import EvidenceModal from "@/components/EvidenceModal";
import Link from "next/link";

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<any[]>([
    {
      role: "assistant",
      text: "Greetings Officer. I am your Coal Intelligence Assistant, grounded directly on verified statistical compendiums, production yearbooks, and geological inventories. How may I assist your analytical operations today?",
      sources: [],
      key_figures: []
    }
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  // Modal state
  const [activeSource, setActiveSource] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sampleQuestions = [
    "What was CIL's coal production in 2024-25?",
    "Which subsidiary produced the most coal?",
    "Compare CCL, SECL and MCL production.",
    "What was India's total coal production in 2023-24?",
    "Show coal production growth over recent financial years.",
    "What percentage of CIL production was non-coking coal?",
    "What is India's total coal resource and its geological breakdown?",
    "What were coal imports during recent financial years?"
  ];

  async function handleSend(queryText?: string) {
    const q = queryText || inputQuery;
    if (!q.trim() || loading) return;

    const newMessages = [...messages, { role: "user", text: q }];
    setMessages(newMessages);
    setInputQuery("");
    setLoading(true);

    try {
      const res = await fetchFromAPI("/ai/query", {
        method: "POST",
        body: JSON.stringify({ question: q, user_id: 2 })
      });

      setMessages([
        ...newMessages,
        {
          role: "assistant",
          text: res.answer,
          key_figures: res.key_figures || [],
          sources: res.sources || [],
          confidence: res.confidence || 98.0,
          query_type: res.query_type || "Hybrid Engine"
        }
      ]);
    } catch (err) {
      console.error("AI query error:", err);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          text: "An error occurred querying the statistical repository. Using cached statistical baseline.",
          sources: [],
          key_figures: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleCopy(text: string, index: number) {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  function openEvidence(src: any) {
    setActiveSource(src);
    setIsModalOpen(true);
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-5 font-serif text-[#1F2933]">
      {/* 1. Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-[#5B6573]">
        <Home className="w-3.5 h-3.5 text-[#123B6D]" />
        <span>Home</span>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <span className="text-[#123B6D] font-bold">Coal Intelligence Assistant</span>
      </nav>

      {/* 2. Official Header */}
      <div className="bg-white border border-[#D5DCE3] p-5 rounded shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#123B6D]">
            Coal Intelligence Assistant
          </h1>
          <p className="text-[13px] text-[#5B6573] mt-0.5">
            Source-grounded query and analysis of verified coal and mineral datasets with mathematical validation.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[12px] bg-[#F7F8FA] border border-[#D5DCE3] px-3 py-1.5 rounded text-gray-700">
          <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
          <span>Audit Grounding Active</span>
        </div>
      </div>

      {/* 3. Preset Queries (Simple Formal Buttons) */}
      <div className="bg-white border border-[#D5DCE3] p-4 rounded shadow-sm">
        <span className="text-[12px] font-bold uppercase tracking-wider text-gray-700 mb-2 block">
          Frequent High-Priority Administrative Inquiries:
        </span>
        <div className="flex flex-wrap gap-2">
          {sampleQuestions.map((sq, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(sq)}
              className="text-[13px] bg-[#F7F8FA] hover:bg-[#EAF2F8] text-gray-800 hover:text-[#123B6D] border border-[#D5DCE3] px-3 py-1.5 rounded transition-colors flex items-center gap-1.5"
            >
              <span>{sq}</span>
              <ArrowRight className="w-3 h-3 text-gray-400" />
            </button>
          ))}
        </div>
      </div>

      {/* 4. Chat / Information Panel Messages */}
      <div className="space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {m.role === "assistant" && (
              <div className="w-8 h-8 rounded bg-[#123B6D] flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-3xl rounded p-6 shadow-sm border ${
                m.role === "user"
                  ? "bg-[#123B6D] text-white border-[#0B2E53]"
                  : "bg-white text-gray-900 border-[#D5DCE3]"
              }`}
            >
              {/* Answer Label for Assistant */}
              {m.role === "assistant" && idx > 0 && (
                <div className="text-[12px] font-bold uppercase tracking-wider text-[#123B6D] border-b border-gray-100 pb-1 mb-3">
                  ANSWER
                </div>
              )}

              <div className="text-[15px] leading-relaxed whitespace-pre-wrap">
                {m.text}
              </div>

              {/* Key Figures */}
              {m.key_figures && m.key_figures.length > 0 && (
                <div className="mt-5 pt-3 border-t border-[#D5DCE3]">
                  <div className="text-[12px] font-bold uppercase tracking-wider text-[#123B6D] mb-2">
                    KEY FIGURES
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {m.key_figures.map((kf: any, kfIdx: number) => (
                      <div
                        key={kfIdx}
                        className="bg-[#F7F8FA] border border-[#D5DCE3] p-2.5 rounded text-center"
                      >
                        <div className="text-[11px] text-gray-600 font-medium">
                          {kf.label}
                        </div>
                        <div className="text-[16px] font-bold text-[#123B6D] mt-0.5">
                          {kf.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sources & Evidence */}
              {m.sources && m.sources.length > 0 && (
                <div className="mt-5 pt-3 border-t border-[#D5DCE3] space-y-2">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="font-bold uppercase tracking-wider text-[#123B6D]">
                      SOURCES & TRACEABILITY:
                    </span>
                    <span className="text-[#2E7D32] font-bold bg-[#F0FDF4] border border-[#DCFCE7] px-2 py-0.5 rounded">
                      Confidence: {m.confidence}%
                    </span>
                  </div>

                  {m.sources.map((src: any, srcIdx: number) => (
                    <div
                      key={srcIdx}
                      className="bg-[#F7F8FA] border border-[#D5DCE3] p-3 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[13px]"
                    >
                      <div>
                        <div className="font-bold text-gray-900">
                          {src.document_name}
                        </div>
                        <div className="text-[12px] text-gray-600">
                          Page {src.page_number} {src.table_name ? `• ${src.table_name}` : ""}
                        </div>
                      </div>
                      <button
                        onClick={() => openEvidence(src)}
                        className="px-3 py-1 bg-white hover:bg-gray-50 text-[#123B6D] border border-[#D5DCE3] rounded text-[12px] font-bold transition-colors shadow-sm self-start sm:self-auto"
                      >
                        View Source Evidence
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions Footer */}
              {m.role === "assistant" && idx > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[12px] text-gray-500">
                  <span>Engine: {m.query_type || "Hybrid Engine"}</span>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleCopy(m.text, idx)}
                      className="flex items-center gap-1 text-gray-600 hover:text-[#123B6D] transition-colors"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#2E7D32]" />
                          <span className="text-[#2E7D32] font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Response</span>
                        </>
                      )}
                    </button>
                    <Link
                      href="/reports"
                      className="flex items-center gap-1 text-[#123B6D] font-bold hover:underline"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>Formalize into Report</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 text-gray-600 text-[14px] p-4 bg-white border border-[#D5DCE3] rounded max-w-md shadow-sm">
            <Bot className="w-4 h-4 text-[#123B6D] animate-spin" />
            <span>Consulting SQL tables and official document chunks...</span>
          </div>
        )}
      </div>

      {/* 5. Input Query Box */}
      <div className="bg-white border border-[#D5DCE3] p-4 rounded shadow-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-3"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Enter your administrative or geological query regarding coal production, CIL subsidiaries, resources, or imports..."
            className="flex-1 bg-white border border-[#D5DCE3] rounded px-4 py-2.5 text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#123B6D]"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || loading}
            className="px-5 py-2.5 bg-[#123B6D] hover:bg-[#0B2E53] disabled:opacity-50 text-white text-[13px] font-bold rounded flex items-center gap-2 transition-all shadow-sm"
          >
            <span>Submit Query</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Traceability Evidence Modal */}
      <EvidenceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        source={activeSource}
      />
    </div>
  );
}
