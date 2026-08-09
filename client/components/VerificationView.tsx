'use client';
import { Shield, CheckCircle, XCircle, Award, Calendar, QrCode, Sparkles } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { SkillRadarChart } from '@/components/SkillRadarChart';
import type { VerificationResult } from '@/lib/api';

interface VerificationViewProps {
  data: VerificationResult;
}

export function VerificationView({ data }: VerificationViewProps) {
  const { verified, badge, assessment, candidate } = data;

  if (!verified || !badge) {
    return (
      <div className="glass-card p-10 text-center text-red-400">
        <XCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
        <h3 className="text-xl font-bold mb-2">Unverified Credential</h3>
        <p className="text-gray-400 text-sm">
          This badge hash could not be verified. It may be invalid or tampered with.
        </p>
      </div>
    );
  }

  const issuedDate = new Date(badge.issuedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const verifyUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/verify/${badge.badgeHash}`
    : `http://localhost:3000/verify/${badge.badgeHash}`;

  return (
    <div className="space-y-6 animate-fade-in-up w-full">
      {/* Verification Header Banner */}
      <div className="flex items-center gap-4 p-5 rounded-2xl bg-green-500/10 border border-green-500/30">
        <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
          <CheckCircle className="w-7 h-7 text-green-400" />
        </div>
        <div>
          <div className="font-bold text-green-400 text-lg">✓ Verified Authentic Credential</div>
          <div className="text-gray-400 text-xs sm:text-sm mt-0.5">
            This badge was cryptographically signed by SkillBridge (SHA-256) and has passed all authenticity checks.
          </div>
        </div>
      </div>

      {/* Perfectly Aligned 2-Column Section */}
      <div className="grid lg:grid-cols-2 gap-6 items-stretch">
        {/* Left Column: Candidate & Badge Info */}
        <div className="glass-card p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Candidate & Badge Info</h3>
              <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20 font-mono">
                #{badge.shortId}
              </span>
            </div>

            <div>
              <div className="text-[11px] text-gray-500 uppercase tracking-wider mb-0.5">Candidate Name</div>
              <div className="text-2xl font-extrabold text-white">{candidate?.name || badge.userName}</div>
            </div>

            <div>
              <div className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">Skill Track</div>
              <div className="text-indigo-300 font-bold flex items-center gap-2 text-sm">
                <Award className="w-4 h-4 text-indigo-400" /> {badge.trackName}
              </div>
            </div>

            {/* Score Pill Row */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <div className="text-center p-2.5 rounded-xl bg-gray-900 border border-white/5">
                <div className="text-lg font-extrabold text-indigo-400">{badge.overallScore}</div>
                <div className="text-[10px] text-gray-500 uppercase">Overall</div>
              </div>
              <div className="text-center p-2.5 rounded-xl bg-gray-900 border border-white/5">
                <div className="text-sm font-bold text-purple-400 mt-1">{badge.level}</div>
                <div className="text-[10px] text-gray-500 uppercase">Level</div>
              </div>
              <div className="text-center p-2.5 rounded-xl bg-gray-900 border border-white/5">
                <div className="text-sm font-bold text-yellow-400 mt-1">{badge.tier}</div>
                <div className="text-[10px] text-gray-500 uppercase">Tier</div>
              </div>
            </div>

            {/* Verification QR Code Display */}
            <div className="p-3.5 rounded-2xl bg-gray-900/80 border border-white/10 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 mb-2 font-medium">
                <QrCode className="w-3.5 h-3.5 text-indigo-400" /> Official Verification QR Code
              </div>
              <div className="inline-flex p-2.5 bg-white rounded-xl shadow-md">
                <QRCodeSVG value={verifyUrl} size={120} level="H" includeMargin={false} />
              </div>
              <div className="text-[10px] text-gray-400 mt-1.5 font-mono break-all">
                {verifyUrl}
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-white/10">
            <div>
              <div className="text-[11px] text-gray-500 mb-0.5">Issued Date</div>
              <div className="text-xs text-gray-300 flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-gray-400" /> {issuedDate}
              </div>
            </div>

            <div>
              <div className="text-[11px] text-gray-500 mb-0.5">Cryptographic SHA-256 Hash</div>
              <div className="font-mono text-[11px] text-indigo-300 bg-gray-900 p-2.5 rounded-xl border border-white/5 break-all select-all">
                {badge.badgeHash}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Competency Radar & AI Identified Key Strengths */}
        <div className="glass-card p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" /> AI Competency Breakdown
            </h3>

            {assessment?.aiScores ? (
              <>
                <SkillRadarChart
                  scores={{
                    quality: assessment.aiScores.quality,
                    logic: assessment.aiScores.logic,
                    performance: assessment.aiScores.performance,
                  }}
                  name={candidate?.name || badge.userName}
                />

                <div className="grid grid-cols-3 gap-2 pt-1">
                  {[
                    { label: 'Code Quality', value: assessment.aiScores.quality },
                    { label: 'Logic', value: assessment.aiScores.logic },
                    { label: 'Performance', value: assessment.aiScores.performance },
                  ].map(({ label, value }) => (
                    <div key={label} className="text-center p-2 rounded-xl bg-gray-900 border border-white/5">
                      <div className="text-sm font-bold text-indigo-400">{value}/100</div>
                      <div className="text-[10px] text-gray-500">{label}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-xs text-gray-500">
                Detailed radar scores available upon evaluation.
              </div>
            )}
          </div>

          {/* AI-Identified Key Strengths Section Aligned at Bottom */}
          {assessment?.strengths && assessment.strengths.length > 0 && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2.5">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> AI-Identified Key Strengths
              </h4>
              <ul className="space-y-2">
                {assessment.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-200">
                    <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
                    <span className="leading-relaxed">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
