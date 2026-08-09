import { LandingHero } from '@/components/LandingHero';
import Link from 'next/link';
import { Shield, Zap, Globe } from 'lucide-react';

export default function HomePage() {
  return (
    <div>
      <LandingHero />

      {/* Why SkillBridge */}
      <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="glass-card p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 mesh-bg opacity-50 pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-4xl font-extrabold text-white mb-4">
              Why <span className="gradient-text">SkillBridge</span>?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-12 text-lg">
              Traditional credentials gatekeep talent. We believe the best engineer is proven by their code, not their diploma.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Zap,
                  title: 'AI-Powered Evaluation',
                  desc: 'GPT-4 evaluates your submission against real engineering standards — not MCQs or guesswork.',
                  color: 'text-indigo-400',
                  bg: 'bg-indigo-500/10',
                },
                {
                  icon: Shield,
                  title: 'Tamper-Evident Badges',
                  desc: 'Every badge is SHA-256 signed. Employers can verify authenticity in seconds via QR code or hash lookup.',
                  color: 'text-purple-400',
                  bg: 'bg-purple-500/10',
                },
                {
                  icon: Globe,
                  title: 'Share Everywhere',
                  desc: 'Embed on GitHub README, LinkedIn, or your portfolio. One link proves your skill to the entire world.',
                  color: 'text-cyan-400',
                  bg: 'bg-cyan-500/10',
                },
              ].map(({ icon: Icon, title, desc, color, bg }) => (
                <div key={title} className="text-left">
                  <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 text-center">
        <h2 className="text-4xl font-extrabold text-white mb-4">
          Ready to prove your skills?
        </h2>
        <p className="text-gray-400 mb-8">No degree required. No gatekeeping. Just your code.</p>
        <Link
          href="/login"
          id="landing-final-cta"
          className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg hover:opacity-90 transition-all hover:scale-105 shadow-2xl shadow-indigo-500/30"
        >
          Start for Free →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] py-8 px-4 text-center text-xs text-gray-700">
        <p>SkillBridge © 2026 — AI-powered Micro-Credentialing Platform</p>
      </footer>
    </div>
  );
}
