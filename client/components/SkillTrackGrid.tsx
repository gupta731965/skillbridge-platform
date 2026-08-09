'use client';
import Link from 'next/link';
import { Code2, Server, Database, Cpu, Layers, Cloud, ArrowRight, Clock, Zap } from 'lucide-react';

const TRACKS = [
  {
    id: 'react-ui',
    name: 'React & UI Engineering',
    icon: Code2,
    difficulty: 'Intermediate',
    diffColor: 'text-yellow-400 bg-yellow-400/10',
    duration: '45 min',
    desc: 'Build accessible, performant React components with modern patterns.',
    gradient: 'from-blue-500/10 to-indigo-600/10',
    border: 'border-blue-500/20',
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-500/10',
  },
  {
    id: 'nodejs-api',
    name: 'Node.js API Architecture',
    icon: Server,
    difficulty: 'Intermediate',
    diffColor: 'text-yellow-400 bg-yellow-400/10',
    duration: '60 min',
    desc: 'Design production-grade REST APIs with Express, validation & middleware.',
    gradient: 'from-green-500/10 to-emerald-600/10',
    border: 'border-green-500/20',
    iconColor: 'text-green-400',
    iconBg: 'bg-green-500/10',
  },
  {
    id: 'python-data',
    name: 'Python Data Handling',
    icon: Database,
    difficulty: 'Beginner',
    diffColor: 'text-green-400 bg-green-400/10',
    duration: '45 min',
    desc: 'Process, analyze and transform real-world datasets with Python.',
    gradient: 'from-yellow-500/10 to-orange-600/10',
    border: 'border-yellow-500/20',
    iconColor: 'text-yellow-400',
    iconBg: 'bg-yellow-500/10',
  },
  {
    id: 'system-design',
    name: 'System Design & Architecture',
    icon: Cpu,
    difficulty: 'Expert',
    diffColor: 'text-red-400 bg-red-400/10',
    duration: '90 min',
    desc: 'Design scalable, distributed systems with thoughtful trade-offs.',
    gradient: 'from-red-500/10 to-pink-600/10',
    border: 'border-red-500/20',
    iconColor: 'text-red-400',
    iconBg: 'bg-red-500/10',
  },
  {
    id: 'typescript-fullstack',
    name: 'TypeScript Full-Stack',
    icon: Layers,
    difficulty: 'Intermediate',
    diffColor: 'text-yellow-400 bg-yellow-400/10',
    duration: '60 min',
    desc: 'Write type-safe, composable TypeScript utilities and patterns.',
    gradient: 'from-purple-500/10 to-violet-600/10',
    border: 'border-purple-500/20',
    iconColor: 'text-purple-400',
    iconBg: 'bg-purple-500/10',
  },
  {
    id: 'devops-cloud',
    name: 'DevOps & Cloud Infrastructure',
    icon: Cloud,
    difficulty: 'Expert',
    diffColor: 'text-red-400 bg-red-400/10',
    duration: '75 min',
    desc: 'Build containerised, production-ready deployment pipelines.',
    gradient: 'from-cyan-500/10 to-sky-600/10',
    border: 'border-cyan-500/20',
    iconColor: 'text-cyan-400',
    iconBg: 'bg-cyan-500/10',
  },
];

interface SkillTrackGridProps {
  userId?: string;
}

export function SkillTrackGrid({ userId }: SkillTrackGridProps) {
  return (
    <section id="tracks" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 text-xs text-indigo-400 mb-4">
          <Zap className="w-3 h-3" /> 6 Skill Tracks Available
        </div>
        <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
          Choose Your <span className="gradient-text">Challenge</span>
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto">
          Each track features a real-world engineering task, reviewed by AI against industry standards.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {TRACKS.map((track) => {
          const Icon = track.icon;
          const href = userId
            ? `/assess/${track.id}?userId=${userId}`
            : `/assess/${track.id}`;

          return (
            <Link
              key={track.id}
              href={href}
              id={`track-${track.id}`}
              className={`group relative p-6 rounded-2xl bg-gradient-to-br ${track.gradient} border ${track.border} hover:border-opacity-60 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl block`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div className={`w-12 h-12 rounded-xl ${track.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${track.iconColor}`} />
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${track.diffColor}`}>
                  {track.difficulty}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                {track.name}
              </h3>
              <p className="text-sm text-gray-500 mb-5 leading-relaxed">{track.desc}</p>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <Clock className="w-3.5 h-3.5" />
                  {track.duration}
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${track.iconColor} group-hover:gap-2 transition-all`}>
                  Start Challenge <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
