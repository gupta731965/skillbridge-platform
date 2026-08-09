'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Zap, Menu, X, Award, BarChart2, LogIn, UserCheck, Briefcase, LogOut, ShieldCheck } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [candidateName, setCandidateName] = useState<string | null>(null);
  const [employerName, setEmployerName] = useState<string | null>(null);
  const pathname = usePathname();

  const syncAuth = () => {
    try {
      const candStored = localStorage.getItem('skillbridge_user');
      if (candStored) {
        const parsed = JSON.parse(candStored);
        if (parsed?.name) setCandidateName(parsed.name);
        else setCandidateName(null);
      } else {
        setCandidateName(null);
      }

      const empStored = localStorage.getItem('skillbridge_employer');
      if (empStored) {
        const parsed = JSON.parse(empStored);
        if (parsed?.companyName) setEmployerName(parsed.companyName);
        else setEmployerName(null);
      } else {
        setEmployerName(null);
      }
    } catch (e) {
      setCandidateName(null);
      setEmployerName(null);
    }
  };

  useEffect(() => {
    syncAuth();
    window.addEventListener('storage', syncAuth);
    const interval = setInterval(syncAuth, 300);
    return () => {
      window.removeEventListener('storage', syncAuth);
      clearInterval(interval);
    };
  }, [pathname]);

  const handleCandidateLogout = () => {
    localStorage.removeItem('skillbridge_user');
    setCandidateName(null);
    window.dispatchEvent(new Event('storage'));
    window.location.href = '/dashboard';
  };

  const handleEmployerLogout = () => {
    localStorage.removeItem('skillbridge_employer');
    setEmployerName(null);
    window.dispatchEvent(new Event('storage'));
    window.location.href = '/verify';
  };

  const isEmployerPage = Boolean(employerName) || pathname.startsWith('/verify') || pathname.startsWith('/employer');
  const isCandidatePage = Boolean(candidateName);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Portal Title (Hidden on Employer and Candidate Logged-In Pages) */}
          {isEmployerPage ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs">
                EP
              </div>
              <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase hidden sm:inline">EMPLOYER PORTAL</span>
            </div>
          ) : isCandidatePage ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs">
                CP
              </div>
              <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase hidden sm:inline">CANDIDATE PANEL</span>
            </div>
          ) : (
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-lg tracking-tight">
                <span className="gradient-text">Skill</span>
                <span className="text-white">Bridge</span>
              </span>
            </Link>
          )}

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-5">
            {/* Case 1: Logged in as Employer */}
            {employerName ? (
              <>
                <Link
                  href="/verify"
                  className={`text-xs transition-colors flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-semibold border ${
                    pathname.startsWith('/verify')
                      ? 'bg-emerald-600 border-emerald-500 text-white shadow-md'
                      : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Verify Candidate
                </Link>

                <div className="flex items-center gap-2">
                  <Link
                    href="/employer"
                    className={`text-xs border px-3.5 py-1.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-md ${
                      pathname.startsWith('/employer')
                        ? 'bg-emerald-600 border-emerald-500 text-white shadow-md'
                        : 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20'
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5 text-emerald-400" /> {employerName}
                  </Link>
                  <button
                    onClick={handleEmployerLogout}
                    className="p-1.5 text-gray-400 hover:text-red-400 transition-colors rounded-lg glass"
                    title="Exit Employer Portal"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </>
            ) : candidateName ? (
              /* Case 2: Logged in as Candidate */
              <>
                <Link
                  href="/tracks"
                  className={`text-xs transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
                    pathname === '/tracks' ? 'text-white bg-white/10 font-semibold' : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <BarChart2 className="w-3.5 h-3.5 text-indigo-400" /> Skill Tracks
                </Link>

                <Link
                  href="/dashboard"
                  className={`text-xs transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
                    pathname === '/dashboard' ? 'text-white bg-white/10 font-semibold' : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Award className="w-3.5 h-3.5 text-indigo-400" /> Dashboard
                </Link>

                <div className="flex items-center gap-2">
                  <Link
                    href="/dashboard"
                    className="text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-indigo-500/20 transition-all shadow-md"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-indigo-400" /> {candidateName}
                  </Link>
                  <button
                    onClick={handleCandidateLogout}
                    className="p-1.5 text-gray-500 hover:text-red-400 transition-colors rounded-lg glass"
                    title="Sign Out Candidate"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </>
            ) : (
              /* Case 3: Before Login (Guest) — ONLY single Login button */
              <Link
                href="/login"
                id="nav-single-login-btn"
                className="text-xs text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition-all flex items-center gap-1.5 px-5 py-2 rounded-xl font-semibold shadow-lg shadow-indigo-500/20 hover:scale-105"
              >
                <LogIn className="w-3.5 h-3.5" /> Login
              </Link>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg glass text-gray-400 hover:text-white"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden pb-4 space-y-2">
            {employerName ? (
              <>
                <Link
                  href="/verify"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-emerald-300 bg-emerald-500/10 transition-all text-xs font-semibold"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Verify Candidate
                </Link>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between px-4 py-2">
                  <Link
                    href="/employer"
                    onClick={() => setOpen(false)}
                    className="text-xs text-emerald-300 font-semibold flex items-center gap-2 hover:underline"
                  >
                    <Briefcase className="w-4 h-4 text-emerald-400" /> {employerName}
                  </Link>
                  <button
                    onClick={handleEmployerLogout}
                    className="text-xs text-red-400 hover:underline flex items-center gap-1"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Exit Portal
                  </button>
                </div>
              </>
            ) : candidateName ? (
              <>
                <Link
                  href="/tracks"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all text-xs"
                >
                  <BarChart2 className="w-4 h-4 text-indigo-400" /> Skill Tracks
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all text-xs"
                >
                  <Award className="w-4 h-4 text-indigo-400" /> Dashboard
                </Link>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between px-4 py-2">
                  <span className="text-xs text-indigo-300 font-semibold flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-indigo-400" /> {candidateName}
                  </span>
                  <button
                    onClick={handleCandidateLogout}
                    className="text-xs text-red-400 hover:underline flex items-center gap-1"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20"
              >
                <LogIn className="w-4 h-4" /> Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
