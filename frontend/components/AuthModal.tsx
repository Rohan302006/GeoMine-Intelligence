"use client";

import React, { useState } from "react";
import { X, Shield, Key, CheckCircle2, User, Lock, AlertCircle, ArrowRight } from "lucide-react";
import { DEMO_ACCOUNTS, AuthUser, UserRole, loginWithCredentials, switchDemoRole } from "@/lib/auth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser;
  onUserChanged: (user: AuthUser) => void;
}

export default function AuthModal({ isOpen, onClose, currentUser, onUserChanged }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"switch" | "login">("switch");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleQuickSwitch(role: UserRole) {
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const user = await switchDemoRole(role);
      onUserChanged(user);
      setSuccessMsg(`Switched to ${user.name} (${user.role} role)`);
      setTimeout(() => {
        onClose();
      }, 600);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to switch role");
    } finally {
      setLoading(false);
    }
  }

  async function handleManualLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const user = await loginWithCredentials(email, password);
      onUserChanged(user);
      setSuccessMsg(`Successfully authenticated as ${user.name} (${user.role})`);
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-lg border border-[#D5DCE3] shadow-2xl max-w-xl w-full overflow-hidden font-sans">
        {/* Header */}
        <div className="bg-[#0F2E59] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center border border-white/20">
              <Shield className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold leading-tight">Role-Based Access Control (RBAC)</h2>
              <p className="text-[11px] text-blue-200">Switch active demonstration persona or authenticate with credentials</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Account Pill */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex items-center justify-between text-[12px]">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-medium">Currently Authenticated:</span>
            <span className="font-bold text-gray-900">{currentUser.name}</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-[#123B6D] border border-blue-200">
              {currentUser.role}
            </span>
          </div>
          <span className="text-[11px] text-gray-500">{currentUser.email}</span>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-gray-200 px-6 pt-3 bg-white">
          <button
            onClick={() => setActiveTab("switch")}
            className={`pb-2.5 text-[13px] font-bold border-b-2 mr-6 flex items-center gap-1.5 transition-colors ${
              activeTab === "switch"
                ? "border-[#123B6D] text-[#123B6D]"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <User className="w-4 h-4" />
            <span>1-Click Role Switcher</span>
          </button>
          <button
            onClick={() => setActiveTab("login")}
            className={`pb-2.5 text-[13px] font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === "login"
                ? "border-[#123B6D] text-[#123B6D]"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Sign In with Password</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-2.5 rounded text-[12px] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded text-[12px] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {activeTab === "switch" && (
            <div className="space-y-3">
              <p className="text-[12px] text-gray-600">
                Select a persona to test the system&apos;s role-based permissions (RBAC). Actions in reports, validation, and uploads will adjust immediately based on your active role:
              </p>

              <div className="grid grid-cols-1 gap-2.5">
                {DEMO_ACCOUNTS.map((acc) => {
                  const isCurrent = currentUser.role === acc.role;
                  return (
                    <div
                      key={acc.role}
                      onClick={() => !loading && handleQuickSwitch(acc.role)}
                      className={`p-3.5 rounded border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isCurrent
                          ? "bg-blue-50/70 border-[#123B6D] ring-1 ring-[#123B6D]"
                          : "bg-white border-gray-200 hover:border-blue-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[13px] text-gray-900">{acc.name}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${acc.badgeColor}`}>
                            {acc.role}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Active
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-gray-500 flex items-center gap-2 font-mono">
                          <span>{acc.email}</span>
                          <span>•</span>
                          <span>Password: {acc.password}</span>
                        </div>
                        <div className="text-[11.5px] text-gray-600">
                          <b>Permissions:</b> {acc.permissions}
                        </div>
                      </div>

                      <button
                        disabled={loading}
                        className={`px-3 py-1.5 rounded text-[11px] font-bold flex items-center gap-1 transition-colors flex-shrink-0 ${
                          isCurrent
                            ? "bg-emerald-600 text-white cursor-default"
                            : "bg-[#123B6D] hover:bg-[#0B2E53] text-white"
                        }`}
                      >
                        {isCurrent ? "Active Role" : "Switch To Role"}
                        {!isCurrent && <ArrowRight className="w-3 h-3" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "login" && (
            <form onSubmit={handleManualLogin} className="space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. admin@geomine.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] text-gray-900 focus:outline-none focus:border-[#123B6D]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="DemoPass#2026"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] text-gray-900 focus:outline-none focus:border-[#123B6D]"
                />
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded p-3 text-[11px] text-gray-600 space-y-1">
                <div className="font-bold text-gray-800">Demo Login Accounts (All share password: DemoPass#2026)</div>
                <div className="font-mono text-[10.5px]">
                  • Admin: admin@geomine.ai<br />
                  • Officer: officer@geomine.ai<br />
                  • Analyst: analyst@geomine.ai<br />
                  • Viewer: viewer@geomine.ai
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-[12px] font-bold text-gray-600 hover:text-gray-900 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-[#123B6D] hover:bg-[#0B2E53] text-white text-[12px] font-bold rounded flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{loading ? "Authenticating..." : "Sign In & Enforce Role"}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-2.5 flex items-center justify-between text-[11px] text-gray-500">
          <span>Backend JWT Authentication & Dynamic RBAC</span>
          <button
            onClick={onClose}
            className="font-bold text-[#123B6D] hover:underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
