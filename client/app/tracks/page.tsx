import { SkillTrackGrid } from '@/components/SkillTrackGrid';
import { Award, Zap } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: "Skill Tracks — SkillBridge",
  description: "Select from 6 practical engineering skill tracks, submit your code, and receive AI-evaluated verified digital badges.",
};

export default function TracksPage() {
  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6">
      <div className="mt-8 mb-6 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 text-xs text-indigo-400 mb-4 glass">
          <Zap className="w-3.5 h-3.5" /> Practical Assessment Tracks
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3">
          Skill Challenge <span className="gradient-text">Catalog</span>
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
          Select an engineering track below to start your practical coding challenge. Complete the task to earn an AI-scored SHA-256 verified badge.
        </p>
      </div>

      <SkillTrackGrid />
    </div>
  );
}
