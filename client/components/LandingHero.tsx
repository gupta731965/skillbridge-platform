'use client';
import { useEffect, useRef } from 'react';

const PARTICLES = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  speed: Math.random() * 0.3 + 0.1,
  opacity: Math.random() * 0.5 + 0.1,
}));

const STATS = [
  { value: '12,000+', label: 'Candidates Evaluated' },
  { value: '98%', label: 'Employer Satisfaction' },
  { value: '340+', label: 'Hiring Partners' },
  { value: '6', label: 'Skill Tracks' },
];

export function LandingHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden mesh-bg grid-pattern pt-16">
      {/* Ambient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center py-20">
        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-8xl font-extrabold tracking-tight leading-none mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
          <span className="gradient-text">Proof of Skill,</span>
          <br />
          <span className="text-white">Not Degree.</span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-400 mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
          SkillBridge evaluates your real-world coding ability with AI, then issues a cryptographically verified digital badge — your portable proof of competence that employers actually trust.
        </p>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
          {STATS.map((stat) => (
            <div key={stat.label} className="glass-card p-6 text-center hover:border-indigo-500/30 transition-all hover:-translate-y-1">
              <div className="text-3xl font-extrabold gradient-text mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="mt-24 animate-fade-in-up" style={{ animationDelay: '0.5s', opacity: 0 }}>
          <h2 className="text-2xl font-bold text-white mb-2">How It Works</h2>
          <p className="text-gray-500 mb-12 text-sm">Three steps from code to credential</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                icon: '🎯',
                title: 'Pick a Skill Track',
                desc: 'Choose from 6 expert-curated challenge tracks based on your speciality.',
                color: 'from-indigo-500/20 to-indigo-600/10',
                border: 'border-indigo-500/20',
              },
              {
                step: '02',
                icon: '🤖',
                title: 'AI Evaluates Your Code',
                desc: 'Submit your solution. GPT-4 scores it on quality, logic, and performance in seconds.',
                color: 'from-purple-500/20 to-purple-600/10',
                border: 'border-purple-500/20',
              },
              {
                step: '03',
                icon: '🏆',
                title: 'Earn a Verified Badge',
                desc: 'Get a SHA-256 signed digital badge with QR code — tamper-evident and permanently verifiable.',
                color: 'from-cyan-500/20 to-cyan-600/10',
                border: 'border-cyan-500/20',
              },
            ].map(({ step, icon, title, desc, color, border }) => (
              <div key={step} className={`relative p-8 rounded-2xl bg-gradient-to-br ${color} border ${border} text-left hover:-translate-y-2 transition-all duration-300`}>
                <div className="text-xs font-bold text-gray-600 mb-4 tracking-widest">STEP {step}</div>
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
