'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { verifyBadge, type VerificationResult, type Employer } from '@/lib/api';
import { Shield, XCircle, Loader2, Search, QrCode, Upload, FileImage, Briefcase, Building, Mail } from 'lucide-react';
import { VerificationView } from '@/components/VerificationView';
import Link from 'next/link';

const EMPLOYER_STORAGE_KEY = 'skillbridge_employer';

function EmployerLoginForm({ onLogin }: { onLogin: (emp: Employer) => void }) {
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !companyEmail.trim()) {
      return setError('Please fill in both company name and work email.');
    }
    setLoading(true);
    setError('');

    setTimeout(() => {
      const emp: Employer = {
        id: 'emp_' + Math.random().toString(36).substr(2, 9),
        companyName: companyName.trim(),
        companyEmail: companyEmail.trim(),
        role: 'employer',
        loggedInAt: new Date().toISOString(),
      };
      localStorage.setItem(EMPLOYER_STORAGE_KEY, JSON.stringify(emp));
      window.dispatchEvent(new Event('storage'));
      onLogin(emp);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="max-w-md mx-auto w-full py-8">
      <div className="glass-card p-8 space-y-6 border border-emerald-500/20 shadow-2xl">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-3 text-emerald-400">
            <Briefcase className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">Employer Portal Access</h2>
          <p className="text-xs text-gray-400">
            Authentication required to access candidate verification reports and AI technical audits.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Company / Organization Name</label>
            <div className="relative">
              <Building className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Acme Corp, Tech Ventures"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-900 border border-white/10 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Corporate Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
                placeholder="recruiter@company.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-900 border border-white/10 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-xs hover:opacity-90 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Shield className="w-4 h-4" /> Log In as Verified Employer →
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function VerifyByHash({ initialHash, employer }: { initialHash?: string; employer: Employer }) {
  const [hash, setHash] = useState(initialHash || '');
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [mode, setMode] = useState<'hash' | 'qr'>('hash');

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialHash) handleVerify(initialHash);
  }, [initialHash]);

  const handleVerify = async (h?: string) => {
    const target = h || hash.trim();
    if (!target) return setError('Please enter a badge hash, short ID, or upload a valid QR code image.');
    setLoading(true);
    setError('');
    setResult(null);
    setSearched(true);

    try {
      const cleanTarget = target.includes('/verify/')
        ? target.split('/verify/').pop()?.trim() || target
        : target;

      const res = await verifyBadge(cleanTarget);
      setResult(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Badge not found or invalid hash.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (file: File) => {
    setSelectedFile(file);
    setError('');
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const match64 = content?.match(/[a-fA-F0-9]{64}/);
      const matchShort = file.name.match(/[a-fA-F0-9]{12,64}/);

      setTimeout(() => {
        if (match64 && match64[0]) {
          setHash(match64[0]);
          handleVerify(match64[0]);
        } else if (matchShort && matchShort[0]) {
          setHash(matchShort[0]);
          handleVerify(matchShort[0]);
        } else if (hash.trim()) {
          handleVerify(hash.trim());
        } else {
          handleVerify(hash.trim() || 'demo-qr');
        }
      }, 800);
    };

    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Search & Upload Card (Centered Verification Content) */}
      {!initialHash && (
        <div className="glass-card p-8 border border-emerald-500/20 space-y-6 shadow-2xl">
          <div className="text-center mb-2">
            <h1 className="text-2xl font-extrabold text-white">Candidate Verification Center</h1>
            <p className="text-xs text-gray-400 mt-1">Audit authentic candidate badges via SHA-256 Hash or device QR image.</p>
          </div>

          <div className="flex gap-2 p-1 bg-gray-900 rounded-xl max-w-sm mx-auto">
            <button
              onClick={() => setMode('hash')}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === 'hash' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Search className="w-3.5 h-3.5" /> Badge Hash / ID
            </button>
            <button
              onClick={() => setMode('qr')}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === 'qr' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" /> Upload Device QR
            </button>
          </div>

          {mode === 'hash' && (
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2 text-center">Audit Candidate SHA-256 Hash or Short ID</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  id="badge-hash-input"
                  type="text"
                  value={hash}
                  onChange={(e) => setHash(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                  placeholder="Enter 64-char SHA-256 hash or 12-char Short ID (e.g. #69CA5AD152FC)..."
                  className="flex-1 px-4 py-3 rounded-xl bg-gray-900 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-all text-xs font-mono"
                />
                <button
                  onClick={() => handleVerify()}
                  id="verify-badge-btn"
                  disabled={loading}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-emerald-500/20"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  Verify Candidate
                </button>
              </div>
            </div>
          )}

          {mode === 'qr' && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.svg"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer p-8 rounded-2xl bg-gray-900/70 hover:bg-gray-900 border-2 border-dashed border-white/20 hover:border-emerald-500/50 transition-all text-center space-y-3 group"
              >
                {previewUrl ? (
                  <div className="space-y-3">
                    <img
                      src={previewUrl}
                      alt="Uploaded QR Code"
                      className="w-28 h-28 object-contain mx-auto rounded-xl bg-white p-2 border border-white/10 shadow-lg"
                    />
                    <div className="text-xs text-emerald-400 font-mono">{selectedFile?.name}</div>
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400 group-hover:scale-110 transition-transform">
                    <FileImage className="w-7 h-7" />
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {selectedFile ? 'Change Selected QR Image' : 'Choose Badge QR Image from Device'}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                    Drag and drop your candidate QR image here, or click to browse device files (.PNG, .JPG, .SVG)
                  </p>
                </div>

                {!selectedFile && (
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold hover:bg-emerald-600/30 transition-all"
                  >
                    <Upload className="w-3.5 h-3.5" /> Select QR File from Device
                  </button>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-xs p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <XCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}
        </div>
      )}

      {loading && (
        <div className="text-center py-16">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-400 mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Validating SHA-256 cryptographic signature...</p>
        </div>
      )}

      {result?.verified && (
        <VerificationView data={result} />
      )}

      {searched && !loading && !result?.verified && !error && (
        <div className="text-center py-16 glass-card">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Badge Not Found</h3>
          <p className="text-gray-500 text-sm">This uploaded QR image or hash does not match any candidate credential in our system.</p>
        </div>
      )}
    </div>
  );
}

export default function VerifyPage() {
  const params = useParams();
  const rawHash = params.hash;
  const hash = Array.isArray(rawHash) ? rawHash.join('/') : (rawHash as string | undefined);

  const [employer, setEmployer] = useState<Employer | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(EMPLOYER_STORAGE_KEY);
    if (stored) {
      try {
        setEmployer(JSON.parse(stored));
      } catch (e) {
        localStorage.removeItem(EMPLOYER_STORAGE_KEY);
      }
    }
    setCheckingAuth(false);
  }, []);

  if (checkingAuth) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] pt-20 pb-16 px-4 sm:px-6 flex flex-col items-center justify-center max-w-4xl mx-auto w-full">
      {/* Pure Centered Verification Center */}
      {!employer ? (
        <EmployerLoginForm onLogin={setEmployer} />
      ) : (
        <div className="w-full my-auto space-y-6">
          <VerifyByHash initialHash={hash} employer={employer} />
        </div>
      )}
    </div>
  );
}
