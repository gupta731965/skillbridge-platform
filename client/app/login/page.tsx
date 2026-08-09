'use client';
import Link from 'next/link';
import { UserCheck, ShieldCheck, Zap, ArrowRight, Building, Award } from 'lucide-react';

export default function PortalLoginPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-4xl mx-auto flex flex-col justify-center">
      <div className="text-center mb-12">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-indigo-500/30">
          <Zap className="w-7 h-7 text-white" strokeWidth={2.5} />
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-2">Select Your Portal</h1>
        <p className="text-gray-400 max-w-md mx-auto text-sm">
          Welcome to SkillBridge. Please choose your portal type below to log in or get started.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Candidate Portal Card */}
        <div className="glass-card p-8 flex flex-col justify-between border border-indigo-500/20 hover:border-indigo-500/50 transition-all hover:-translate-y-1 shadow-2xl group">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
              <UserCheck className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
              CANDIDATE PANEL
            </span>
            <h2 className="text-2xl font-bold text-white mt-3 mb-2">Developers & Job Seekers</h2>
            <p className="text-gray-400 text-xs leading-relaxed mb-6">
              Take practical skill assessments, receive AI evaluation scores, earn SHA-256 verified digital badges, and showcase your skill portfolio.
            </p>
          </div>

          <Link
            href="/dashboard"
            id="candidate-portal-btn"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold hover:opacity-90 transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 group-hover:gap-3"
          >
            Candidate Login <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Employer Portal Card */}
        <div className="glass-card p-8 flex flex-col justify-between border border-emerald-500/20 hover:border-emerald-500/50 transition-all hover:-translate-y-1 shadow-2xl group">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              EMPLOYER PORTAL
            </span>
            <h2 className="text-2xl font-bold text-white mt-3 mb-2">Recruiters & Hiring Managers</h2>
            <p className="text-gray-400 text-xs leading-relaxed mb-6">
              Log in to audit candidate credentials, scan QR codes, inspect SHA-256 cryptographic signatures, and review AI code quality reports.
            </p>
          </div>

          <Link
            href="/verify"
            id="employer-portal-btn"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-semibold hover:opacity-90 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 group-hover:gap-3"
          >
            Enter Employer Portal <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
