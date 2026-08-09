'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Briefcase, Building, Mail, Calendar, Loader2 } from 'lucide-react';
import type { Employer } from '@/lib/api';

const EMPLOYER_STORAGE_KEY = 'skillbridge_employer';

export default function EmployerDetailsPage() {
  const [employer, setEmployer] = useState<Employer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(EMPLOYER_STORAGE_KEY);
    if (stored) {
      try {
        setEmployer(JSON.parse(stored));
      } catch (e) {
        localStorage.removeItem(EMPLOYER_STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  if (!employer) {
    return (
      <div className="min-h-screen pt-24 px-4 flex flex-col items-center justify-center text-center">
        <div className="glass-card p-10 max-w-md w-full border border-emerald-500/20 space-y-4">
          <Briefcase className="w-12 h-12 text-emerald-400 mx-auto" />
          <h2 className="text-2xl font-bold text-white">Employer Access Required</h2>
          <p className="text-gray-400 text-xs">
            You must log in to view employer corporate account details.
          </p>
          <Link
            href="/verify"
            className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-semibold hover:opacity-90 transition-all shadow-lg"
          >
            Log In as Employer →
          </Link>
        </div>
      </div>
    );
  }

  const loggedInDate = employer.loggedInAt
    ? new Date(employer.loggedInAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Active Session';

  return (
    <div className="min-h-[calc(100vh-4rem)] pt-20 pb-16 px-4 sm:px-6 flex flex-col items-center justify-center max-w-xl mx-auto w-full">
      {/* Employer Account Card — Pure Single Column View */}
      <div className="glass-card p-8 border border-emerald-500/30 space-y-6 shadow-2xl relative overflow-hidden w-full">
        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none text-emerald-400">
          <Building className="w-32 h-32" />
        </div>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-2xl font-extrabold text-white shadow-xl shadow-emerald-500/20 shrink-0">
            {employer.companyName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                VERIFIED EMPLOYER ACCOUNT
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white mt-1">{employer.companyName}</h1>
            <p className="text-gray-400 text-xs flex items-center gap-1.5 mt-1">
              <Mail className="w-3.5 h-3.5 text-emerald-400" /> {employer.companyEmail}
            </p>
          </div>
        </div>

        {/* Single Column Details */}
        <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
          <div className="p-4 rounded-xl bg-gray-900 border border-white/5 space-y-1">
            <div className="text-[11px] text-gray-500 font-medium">Corporate Work Email</div>
            <div className="text-xs text-white font-semibold flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-emerald-400" /> {employer.companyEmail}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gray-900 border border-white/5 space-y-1">
            <div className="text-[11px] text-gray-500 font-medium">Session ID</div>
            <div className="font-mono text-xs text-emerald-300 font-semibold">{employer.id}</div>
          </div>

          <div className="p-4 rounded-xl bg-gray-900 border border-white/5 space-y-1">
            <div className="text-[11px] text-gray-500 font-medium">Authentication Date</div>
            <div className="text-xs text-white font-semibold flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" /> {loggedInDate}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
