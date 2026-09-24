"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Database, Calendar, User, Shield, ChevronDown } from "lucide-react";
import { getCurrentUser, AuthUser } from "@/lib/auth";
import AuthModal from "@/components/AuthModal";

export default function Navbar() {
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [authUser, setAuthUser] = useState<AuthUser>({
    name: "Executive Officer",
    email: "officer@geomine.ai",
    role: "Officer"
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    setAuthUser(getCurrentUser());

    function handleAuthChanged() {
      setAuthUser(getCurrentUser());
    }

    window.addEventListener("auth-changed", handleAuthChanged);

    function updateDateTime() {
      const now = new Date();
      const dateStr = now.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
      const timeStr = now.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
      setCurrentDateTime(`${dateStr} ${timeStr}`);
    }
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => {
      clearInterval(interval);
      window.removeEventListener("auth-changed", handleAuthChanged);
    };
  }, []);

  return (
    <header className="w-full bg-white border-b border-[#D5DCE3] flex-shrink-0">
      {/* 1. Official Header Bar */}
      <div className="w-full px-6 py-3 flex items-center justify-between">
        {/* Left Branding */}
        <div className="flex items-center">
          {/* GeoMine Intelligence Crest */}
          <div className="mr-3 flex-shrink-0 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/emblem.svg"
              alt="GeoMine Intelligence Crest"
              className="h-12 w-auto object-contain"
            />
          </div>

          {/* Authority / Division Text */}
          <div className="flex flex-col justify-center border-r border-[#D5DCE3] pr-4 mr-4">
            <span className="font-bold text-[14px] text-gray-900 leading-tight">
              GeoMine Intelligence Directorate
            </span>
            <span className="font-bold text-[14px] text-[#123B6D] leading-tight">
              Mineral Analytics Division
            </span>
            <span className="text-[11px] text-gray-600 leading-tight mt-0.5">
              Coal Resource & Production Monitoring
            </span>
          </div>

          {/* System Title */}
          <div className="flex flex-col justify-center">
            <span className="font-bold text-[15px] text-[#0B2E53] leading-tight">
              GeoMine Platform
            </span>
            <span className="font-bold text-[18px] text-[#0B2E53] leading-tight">
              AI Intelligence & Reporting System
            </span>
            <span className="italic text-[11px] text-[#1F5A96] leading-tight mt-0.5">
              AI-Powered Geological, Mining & Statistical Intelligence
            </span>
          </div>
        </div>

        {/* Right Metadata: Date/Time & Logged In Officer */}
        <div className="flex items-center gap-5">
          {/* Live Date & Time */}
          <div className="hidden lg:flex items-center gap-2 text-[12px] text-gray-700 font-serif">
            <Calendar className="w-4 h-4 text-[#123B6D]" />
            <span className="tabular-nums font-medium">
              {currentDateTime || "Tue, 16 Sep 2026 14:32:17"}
            </span>
          </div>

          <div className="h-8 w-[1px] bg-[#D5DCE3] hidden lg:block" />

          {/* Active User Persona & Role Switcher */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-lg border border-[#D5DCE3] hover:border-[#123B6D] hover:bg-slate-50 transition-all text-left group"
            title="Click to switch persona or sign in"
          >
            <div className="w-8 h-8 rounded-full bg-[#123B6D] text-white flex items-center justify-center font-bold text-xs shadow-sm flex-shrink-0 group-hover:bg-[#0B2E53]">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="text-left leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] font-bold text-gray-900">{authUser.name}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-[#123B6D] border border-blue-200">
                  {authUser.role}
                </span>
              </div>
              <div className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                <span>Switch Role / Sign In</span>
                <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-gray-700" />
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* 2. SIH Prototype Notice Bar */}
      <div className="w-full bg-[#0B203E] px-6 py-1.5 flex items-center justify-between text-white border-t border-[#123B6D]">
        <div className="flex items-center gap-2 text-[12px] leading-tight">
          <span className="bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wide border border-amber-500/30 flex-shrink-0">
            SIH 2026 Prototype
          </span>
          <span className="text-slate-200 text-[11px]">
            This platform is a prototype solution developed for the Smart India Hackathon 2026 (PS ID: SIH26023). It is not an official portal of the Ministry of Coal or CMPDI/CIL.
          </span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-1.5 bg-[#071933] border border-emerald-500/40 px-2.5 py-0.5 rounded-full text-[11px] text-emerald-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>System Ready</span>
          </div>
        </div>
      </div>

      {/* Auth & RBAC Persona Switcher Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={authUser}
        onUserChanged={(u) => setAuthUser(u)}
      />
    </header>
  );
}
