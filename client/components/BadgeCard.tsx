'use client';
import { useState } from 'react';
import { Award, Calendar, Shield, QrCode, X, Key, Copy, Check, Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import type { Badge } from '@/lib/api';

const TIER_CONFIG = {
  Bronze: {
    gradient: 'from-amber-900 via-amber-700 to-amber-500',
    border: 'border-amber-500/40',
    glow: 'shadow-amber-500/20',
    badge: '🥉',
    text: 'text-amber-300',
  },
  Silver: {
    gradient: 'from-gray-700 via-gray-500 to-gray-300',
    border: 'border-gray-400/40',
    glow: 'shadow-gray-400/20',
    badge: '🥈',
    text: 'text-gray-300',
  },
  Gold: {
    gradient: 'from-yellow-800 via-yellow-600 to-yellow-400',
    border: 'border-yellow-400/40',
    glow: 'shadow-yellow-400/20',
    badge: '🥇',
    text: 'text-yellow-300',
  },
  Platinum: {
    gradient: 'from-indigo-900 via-indigo-700 to-purple-500',
    border: 'border-indigo-400/40',
    glow: 'shadow-indigo-400/20',
    badge: '💎',
    text: 'text-indigo-300',
  },
};

interface BadgeCardProps {
  badge: Badge;
  compact?: boolean;
  showActions?: boolean;
}

export function BadgeCard({ badge, compact = false, showActions = true }: BadgeCardProps) {
  const [showQR, setShowQR] = useState(false);
  const [showHash, setShowHash] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  const conf = TIER_CONFIG[badge.tier] || TIER_CONFIG.Bronze;
  const date = new Date(badge.issuedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const verifyUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/verify/${badge.badgeHash}`
    : `http://localhost:3000/verify/${badge.badgeHash}`;

  const copyHashcode = () => {
    navigator.clipboard.writeText(badge.badgeHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const downloadQRCode = () => {
    const badgeIdStr = badge.id || badge._id || badge.badgeHash;
    const svgElement = document.getElementById(`qr-svg-${badgeIdStr}`);
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const blobURL = URL.createObjectURL(svgBlob);

    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 400;
      const context = canvas.getContext('2d');
      if (context) {
        context.fillStyle = '#FFFFFF';
        context.fillRect(0, 0, 400, 400);
        context.drawImage(image, 20, 20, 360, 360);
        const png = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = png;
        downloadLink.download = `SkillBridge_${badge.trackName.replace(/[^a-z0-9]/gi, '_')}_QR_${badge.shortId}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
      URL.revokeObjectURL(blobURL);
    };
    image.src = blobURL;
  };

  const badgeIdStr = badge.id || badge._id || badge.badgeHash;

  return (
    <div
      id={`badge-${badgeIdStr}`}
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${conf.gradient} p-0.5 shadow-2xl ${conf.glow} ${compact ? '' : 'max-w-md w-full'}`}
    >
      <div className="rounded-3xl bg-gray-950/85 backdrop-blur-sm p-6 h-full flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/30 flex items-center justify-center">
                <Shield className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-indigo-400 tracking-widest">SKILLBRIDGE</div>
                <div className="text-xs text-gray-400">VERIFIED CREDENTIAL</div>
              </div>
            </div>
            <div className="text-3xl" title={`${badge.tier} Tier`}>{conf.badge}</div>
          </div>

          {/* Candidate Name */}
          <div className="mb-3">
            <div className="text-2xl font-extrabold text-white">{badge.userName}</div>
            <div className="text-sm text-gray-400 mt-0.5">has demonstrated proficiency in</div>
          </div>

          {/* Track */}
          <div className="mb-4 p-3 rounded-xl bg-white/[0.04] border border-white/[0.08]">
            <div className="flex items-center gap-2">
              <Award className={`w-4 h-4 ${conf.text}`} />
              <span className={`font-bold ${conf.text}`}>{badge.trackName}</span>
            </div>
          </div>

          {/* Scores Row */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { label: 'Score', value: badge.overallScore, suffix: '/100' },
              { label: 'Level', value: badge.level },
              { label: 'Tier', value: badge.tier },
            ].map(({ label, value, suffix }) => (
              <div key={label} className="text-center p-2 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                <div className={`text-sm font-bold ${conf.text}`}>{value}{suffix}</div>
                <div className="text-xs text-gray-400">{label}</div>
              </div>
            ))}
          </div>

          {/* QR Code Container (Expandable) */}
          {showQR && (
            <div className="mb-4 p-4 rounded-2xl bg-gray-900 border border-white/10 text-center animate-fade-in-up space-y-3">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <QrCode className="w-3.5 h-3.5 text-indigo-400" /> Verification QR Code
                </span>
                <button
                  onClick={() => setShowQR(false)}
                  className="p-1 hover:text-white rounded-lg glass"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="inline-flex p-3 bg-white rounded-xl shadow-lg">
                <QRCodeSVG id={`qr-svg-${badgeIdStr}`} value={verifyUrl} size={140} level="H" includeMargin={false} />
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="font-mono text-gray-400">#{badge.shortId}</span>
                <button
                  onClick={downloadQRCode}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md"
                >
                  <Download className="w-3.5 h-3.5" /> Download QR Image
                </button>
              </div>
            </div>
          )}

          {/* SHA-256 Hashcode Container (Expandable) */}
          {showHash && (
            <div className="mb-4 p-4 rounded-2xl bg-gray-900 border border-indigo-500/30 text-left animate-fade-in-up space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-indigo-300 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-indigo-400" /> SHA-256 Employer Verification Hashcode
                </span>
                <button
                  onClick={() => setShowHash(false)}
                  className="p-1 hover:text-white rounded-lg glass text-gray-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="p-3 bg-gray-950 rounded-xl border border-white/10 font-mono text-xs text-indigo-300 break-all select-all">
                {badge.badgeHash}
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-gray-400">Share this hash with employers to verify.</span>
                <button
                  onClick={copyHashcode}
                  className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  {copiedHash ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedHash ? 'Copied Hash!' : 'Copy Hash'}
                </button>
              </div>
            </div>
          )}

          {/* Hash & Date */}
          <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {date}
            </div>
            <div className="font-mono text-gray-400">#{badge.shortId}</div>
          </div>
        </div>

        {/* Actions — 2 Clean Balanced Buttons */}
        {showActions && (
          <div className="flex gap-2.5 pt-2 border-t border-white/10">
            <button
              onClick={() => setShowQR(!showQR)}
              id={`badge-qr-btn-${badgeIdStr}`}
              className={`flex-1 min-w-0 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all border ${
                showQR
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                  : 'bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <QrCode className="w-3.5 h-3.5 text-indigo-400" /> {showQR ? 'Hide QR' : 'QR Code'}
            </button>

            <button
              onClick={() => setShowHash(!showHash)}
              id={`badge-hash-btn-${badgeIdStr}`}
              className={`flex-1 min-w-0 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all border ${
                showHash
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                  : 'bg-indigo-600/20 border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30'
              }`}
            >
              <Key className="w-3.5 h-3.5" /> {showHash ? 'Hide Hash' : 'Show Hashcode'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
