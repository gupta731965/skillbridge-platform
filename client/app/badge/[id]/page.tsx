'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { BadgeCard } from '@/components/BadgeCard';
import { EmbedWidget } from '@/components/EmbedWidget';
import { SkillRadarChart } from '@/components/SkillRadarChart';
import { verifyBadge, type VerificationResult } from '@/lib/api';
import { QRCodeSVG } from 'qrcode.react';
import { Loader2, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function BadgePage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    verifyBadge(id)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-400" />
      </div>
    );
  }

  if (error || !data?.verified) {
    return (
      <div className="min-h-screen pt-24 px-4 text-center">
        <div className="text-6xl mb-4">❌</div>
        <h1 className="text-2xl font-bold text-white mb-2">Badge Not Found</h1>
        <p className="text-gray-500 mb-6">{error || 'This badge does not exist.'}</p>
        <Link href="/dashboard" className="text-indigo-400 hover:text-indigo-300">← Back to Dashboard</Link>
      </div>
    );
  }

  const { badge, assessment } = data;
  const verifyUrl = typeof window !== 'undefined' ? `${window.location.origin}/verify/${badge.badgeHash}` : `/verify/${badge.badgeHash}`;

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="mt-8 mb-10">
        <Link href="/dashboard" className="text-gray-500 hover:text-gray-300 text-sm flex items-center gap-1.5 mb-6">
          ← Dashboard
        </Link>
        <h1 className="text-3xl font-extrabold text-white">Your Verified Badge</h1>
        <p className="text-gray-500 text-sm mt-1">Share this page to showcase your verified skill credential.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Badge Card */}
        <div className="space-y-6">
          <BadgeCard badge={badge} showActions />

          {/* QR Code */}
          <div className="glass-card p-6 text-center">
            <h3 className="text-sm font-semibold text-gray-400 mb-4">Scan to Verify</h3>
            <div className="inline-flex p-4 bg-white rounded-2xl">
              <QRCodeSVG
                value={verifyUrl}
                size={160}
                level="H"
                includeMargin={false}
              />
            </div>
            <div className="mt-3 text-xs text-gray-600">
              Employers can scan this QR to instantly verify your credential.
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-6">
          {/* Radar */}
          {assessment?.aiScores && (
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Skill Breakdown</h3>
              <SkillRadarChart
                scores={{
                  quality: assessment.aiScores.quality,
                  logic: assessment.aiScores.logic,
                  performance: assessment.aiScores.performance,
                }}
                name={badge.userName}
              />
            </div>
          )}

          {/* Embed Widget */}
          <EmbedWidget badgeId={badge.badgeHash} />

          {/* Verify Link */}
          <div className="glass-card p-5">
            <div className="text-xs text-gray-500 mb-2">Public Verification URL</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 font-mono text-xs text-indigo-400 bg-gray-900 px-3 py-2 rounded-lg truncate">
                {verifyUrl}
              </div>
              <Link
                href={`/verify/${badge.badgeHash}`}
                target="_blank"
                className="p-2 rounded-lg glass text-gray-400 hover:text-white transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
