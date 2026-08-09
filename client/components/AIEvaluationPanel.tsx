'use client';
import { useEffect, useRef } from 'react';
import { CheckCircle, AlertCircle, TrendingUp, Cpu, Code2, Zap } from 'lucide-react';

interface Scores {
  quality: number;
  logic: number;
  performance: number;
  overall: number;
}

interface AIEvaluationPanelProps {
  scores: Scores;
  level: string;
  tier: string;
  strengths: string[];
  weaknesses: string[];
  engine: string;
  trackName: string;
  visible: boolean;
}

const CIRCUMFERENCE = 2 * Math.PI * 45; // r=45

function ScoreRing({
  score,
  label,
  icon: Icon,
  color,
  delay = 0,
}: {
  score: number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  delay?: number;
}) {
  const offset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-28 h-28">
        <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE}
            style={{
              transition: `stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
              strokeDashoffset: offset,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-extrabold text-white">{score}</span>
          <span className="text-xs text-gray-500">/ 100</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-sm text-gray-400">
        <span style={{ color }}>
          <Icon className="w-3.5 h-3.5" />
        </span>
        {label}
      </div>
    </div>
  );
}

const TIER_CONFIG: Record<string, { gradient: string; text: string }> = {
  Bronze: { gradient: 'from-amber-700 to-amber-500', text: 'text-amber-300' },
  Silver: { gradient: 'from-gray-500 to-gray-300', text: 'text-gray-200' },
  Gold: { gradient: 'from-yellow-600 to-yellow-400', text: 'text-yellow-300' },
  Platinum: { gradient: 'from-indigo-600 to-purple-400', text: 'text-indigo-200' },
};

const LEVEL_COLOR: Record<string, string> = {
  Beginner: 'text-green-400',
  Intermediate: 'text-yellow-400',
  Expert: 'text-purple-400',
};

export function AIEvaluationPanel({
  scores,
  level,
  tier,
  strengths,
  weaknesses,
  engine,
  trackName,
  visible,
}: AIEvaluationPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const tierConf = TIER_CONFIG[tier] || TIER_CONFIG.Bronze;

  useEffect(() => {
    if (visible && panelRef.current) {
      panelRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      ref={panelRef}
      id="ai-evaluation-panel"
      className="mt-8 space-y-6 animate-fade-in-up"
    >
      {/* Overall Score Banner */}
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${tierConf.gradient} p-0.5`}>
        <div className="rounded-2xl bg-gray-950/90 p-6 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-indigo-400" />
                <span className="text-xs text-gray-500 uppercase tracking-wider">AI Evaluation Complete</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 border border-gray-700">
                  {engine === 'openai' ? '🤖 GPT-4o' : '⚡ Simulated AI'}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white">{trackName}</h3>
              <p className={`text-sm font-medium mt-1 ${LEVEL_COLOR[level]}`}>
                {level} Level Candidate
              </p>
            </div>
            <div className="text-right">
              <div className="text-6xl font-extrabold text-white">{scores.overall}</div>
              <div className="text-sm text-gray-500">Overall Score</div>
              <div className={`text-sm font-bold mt-1 ${tierConf.text}`}>{tier} Tier</div>
            </div>
          </div>
        </div>
      </div>

      {/* Score Rings */}
      <div className="glass-card p-6">
        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">Dimension Breakdown</h4>
        <div className="grid grid-cols-3 gap-4">
          <ScoreRing score={scores.quality} label="Code Quality" icon={Code2} color="#6366f1" delay={0} />
          <ScoreRing score={scores.logic} label="Logic" icon={Cpu} color="#8b5cf6" delay={200} />
          <ScoreRing score={scores.performance} label="Performance" icon={TrendingUp} color="#06b6d4" delay={400} />
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass-card p-6">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-green-400 mb-4">
            <CheckCircle className="w-4 h-4" /> Strengths
          </h4>
          <ul className="space-y-3">
            {strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="glass-card p-6">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-orange-400 mb-4">
            <AlertCircle className="w-4 h-4" /> Areas to Improve
          </h4>
          <ul className="space-y-3">
            {weaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
                {w}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
