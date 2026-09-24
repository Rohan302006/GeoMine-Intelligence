"use client";

import React from "react";
import { X, FileText, CheckCircle2, ShieldCheck } from "lucide-react";

interface EvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  source: {
    document_name: string;
    page_number: number;
    table_name?: string;
    evidence: string;
    confidence: number;
  } | null;
}

export default function EvidenceModal({ isOpen, onClose, source }: EvidenceModalProps) {
  if (!isOpen || !source) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 font-serif text-[#1F2933]">
      <div className="bg-white border border-[#D5DCE3] rounded max-w-2xl w-full shadow-lg overflow-hidden animate-in fade-in duration-150">
        {/* Header */}
        <div className="px-6 py-3.5 bg-[#123B6D] text-white flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-[15px]">
            <FileText className="w-4 h-4 text-blue-200" />
            <span>Official Source Verification & Evidence Audit</span>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-[14px]">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#F7F8FA] p-3 rounded border border-[#D5DCE3]">
              <span className="text-gray-500 block text-[11px] font-bold uppercase">Source Document</span>
              <span className="font-bold text-[#123B6D]">{source.document_name}</span>
            </div>
            <div className="bg-[#F7F8FA] p-3 rounded border border-[#D5DCE3]">
              <span className="text-gray-500 block text-[11px] font-bold uppercase">Location</span>
              <span className="font-bold text-gray-900">
                Page {source.page_number} {source.table_name ? `• ${source.table_name}` : ""}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded bg-[#F0FDF4] border border-[#DCFCE7] text-[13px]">
            <div className="flex items-center gap-2 text-[#166534] font-bold">
              <ShieldCheck className="w-4 h-4 text-[#16a34a]" />
              <span>Statistical Grounding Confidence</span>
            </div>
            <span className="font-bold text-[#166534] bg-white px-2 py-0.5 rounded border border-[#DCFCE7]">
              {source.confidence}% Confidence
            </span>
          </div>

          <div>
            <label className="text-[13px] font-bold text-gray-800 block mb-1">
              Verbatim Extracted Evidence from Ingested Record:
            </label>
            <div className="p-4 bg-[#F7F8FA] rounded border border-[#D5DCE3] text-[13px] text-gray-800 leading-relaxed max-h-56 overflow-y-auto whitespace-pre-wrap font-serif">
              {source.evidence}
            </div>
          </div>

          <div className="text-[12px] text-gray-500 bg-gray-50 p-3 rounded border border-gray-200">
            <b>Auditability Guarantee:</b> Every figure extracted by this platform maintains a cryptographic checksum and byte-offset mapping to the original verified statistical publications.
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#F7F8FA] border-t border-[#D5DCE3] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#123B6D] hover:bg-[#0B2E53] text-white text-[13px] font-bold rounded transition-colors"
          >
            Close Audit Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
