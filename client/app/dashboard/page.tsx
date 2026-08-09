'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { createUser, getUser, type UserWithBadges, type Badge } from '@/lib/api';
import { BadgeCard } from '@/components/BadgeCard';
import { SkillRadarChart } from '@/components/SkillRadarChart';
import { User, Award, BarChart2, Plus, Mail, Search } from 'lucide-react';

const STORAGE_KEY = 'skillbridge_user';

function LoginForm({ onLogin }: { onLogin: (user: UserWithBadges) => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return setError('Please fill in all fields');
    setLoading(true);
    setError('');
    try {
      const user = await createUser(name.trim(), email.trim());
      const full = await getUser(user.id || user._id).catch(() => ({ ...user, badges: [] } as unknown as UserWithBadges));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(full));
      onLogin(full);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create profile. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-indigo-500/30">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Candidate Login</h1>
          <p className="text-gray-500 text-sm">Enter your name and email to access your assessments & badges.</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Johnson"
              className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-900 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            id="create-profile-btn"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:opacity-90 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 shadow-lg shadow-indigo-500/20"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Logging in...
              </span>
            ) : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserWithBadges | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as UserWithBadges;
        setUser(parsed);
        // Refresh from server and merge with local badges
        getUser(parsed.id || parsed._id)
          .then((fresh) => {
            const localBadges = Array.isArray(parsed.badges) ? parsed.badges : [];
            const freshBadges = Array.isArray(fresh.badges) ? fresh.badges : [];
            const badgeMap = new Map();
            localBadges.forEach((b: any) => {
              const key = typeof b === 'object' ? (b.id || b._id || b.badgeHash) : b;
              if (key) badgeMap.set(key, b);
            });
            freshBadges.forEach((b: any) => {
              const key = typeof b === 'object' ? (b.id || b._id || b.badgeHash) : b;
              if (key) badgeMap.set(key, b);
            });
            const mergedBadges = Array.from(badgeMap.values());
            const updatedUser = { ...fresh, badges: mergedBadges };
            setUser(updatedUser);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
          })
          .catch(() => {});
      } catch {}
    }
    setLoading(false);
  }, []);

  const rawBadges = useMemo(() => (user && Array.isArray(user.badges) ? user.badges : []), [user]);

  const validBadges = useMemo(() => {
    return rawBadges.filter((b): b is Badge => typeof b === 'object' && b !== null);
  }, [rawBadges]);

  const filteredBadges = useMemo(() => {
    return validBadges.filter((badge) => {
      const matchesTier = selectedTier === 'All' || badge.tier === selectedTier;
      const matchesSearch =
        !searchQuery.trim() ||
        badge.trackName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        badge.level.toLowerCase().includes(searchQuery.toLowerCase()) ||
        badge.shortId.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTier && matchesSearch;
    });
  }, [validBadges, selectedTier, searchQuery]);

  const avgScore = useMemo(() => {
    return validBadges.length > 0
      ? Math.round(validBadges.reduce((acc, b) => acc + b.overallScore, 0) / validBadges.length)
      : 0;
  }, [validBadges]);

  // Aggregate scores for radar chart
  const radarScores = useMemo(() => {
    return validBadges.length > 0
      ? {
          quality: Math.round(validBadges.reduce((acc, b) => acc + b.overallScore, 0) / validBadges.length),
          logic: Math.round(validBadges.reduce((acc, b) => acc + b.overallScore * 0.95, 0) / validBadges.length),
          performance: Math.round(validBadges.reduce((acc, b) => acc + b.overallScore * 0.9, 0) / validBadges.length),
        }
      : { quality: 0, logic: 0, performance: 0 };
  }, [validBadges]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LoginForm onLogin={setUser} />;
  }

  return (
    <div className="min-h-screen pt-20 pb-8 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col justify-between">
      {/* Profile Header */}
      <div className="mt-4 mb-6 glass-card p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-extrabold text-white shadow-xl shadow-indigo-500/30 shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">{user.name}</h1>
              <p className="text-gray-500 text-xs mt-0.5">{user.email}</p>
              <div className="flex flex-wrap gap-2.5 mt-2">
                <span className="inline-flex items-center gap-1.5 text-xs text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                  <Award className="w-3 h-3" /> {validBadges.length} Badge{validBadges.length !== 1 ? 's' : ''} Earned
                </span>
                {avgScore > 0 && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                    <BarChart2 className="w-3 h-3" /> {avgScore} Avg Score
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href="/tracks"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold hover:opacity-90 transition-all shadow-lg shadow-indigo-500/20"
            >
              <Plus className="w-4 h-4" /> Take Skill Assessment
            </Link>
          </div>
        </div>
      </div>

      {/* Single Viewport Content Grid */}
      {validBadges.length === 0 ? (
        <div className="text-center py-20 glass-card">
          <div className="text-5xl mb-3">🏆</div>
          <h2 className="text-2xl font-bold text-white mb-2">Welcome, {user.name}!</h2>
          <p className="text-gray-400 max-w-md mx-auto text-sm">
            You haven't earned any verified badges yet. Click "+ Take Skill Assessment" above to take your first skill challenge!
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column (7/12): Earned Badges Gallery */}
          <div className="lg:col-span-7 glass-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-400" /> Earned Badges
                  <span className="text-xs font-normal text-gray-400 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                    {filteredBadges.length} of {validBadges.length}
                  </span>
                </h2>

                {/* Search Input */}
                <div className="relative min-w-[160px]">
                  <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search track..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-gray-900 text-xs text-white rounded-lg border border-white/10 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Tier Filter Chips */}
              <div className="flex items-center gap-1.5 mb-5 overflow-x-auto pb-1 scrollbar-none">
                {['All', 'Platinum', 'Gold', 'Silver', 'Bronze'].map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setSelectedTier(tier)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 ${
                      selectedTier === tier
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {tier === 'Platinum' ? '💎 ' : tier === 'Gold' ? '🥇 ' : tier === 'Silver' ? '🥈 ' : tier === 'Bronze' ? '🥉 ' : ''}
                    {tier}
                  </button>
                ))}
              </div>

              {/* Bounded Scrollable Gallery Aligned with Right Column */}
              {filteredBadges.length === 0 ? (
                <div className="text-center py-12 text-gray-500 text-xs">
                  No badges found matching your filter.
                </div>
              ) : (
                <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1.5 custom-scrollbar">
                  {filteredBadges.map((badge, i) => (
                    <div key={badge.id || badge._id || i} className="animate-fade-in-up">
                      <BadgeCard badge={badge} compact />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column (5/12): Skill Radar & Credentials Summary Aligned Side-by-Side */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            {/* Skill Radar Chart */}
            <div className="glass-card p-6 flex-1 flex flex-col justify-between">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-purple-400" /> Overall Skill Radar
              </h2>
              <SkillRadarChart scores={radarScores} name={user.name} />
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[
                  { label: 'Quality', value: radarScores.quality, color: 'text-indigo-400' },
                  { label: 'Logic', value: radarScores.logic, color: 'text-purple-400' },
                  { label: 'Performance', value: radarScores.performance, color: 'text-cyan-400' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="text-center p-2 rounded-xl bg-gray-900 border border-white/5">
                    <div className={`text-base font-bold ${color}`}>{value}</div>
                    <div className="text-[11px] text-gray-500">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Aligned Credentials Summary Section */}
            <div className="glass-card p-5">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Credentials Summary</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                  <div className="text-[11px] text-indigo-300 mb-0.5">Total Badges</div>
                  <div className="text-xl font-extrabold text-white">{validBadges.length}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <div className="text-[11px] text-purple-300 mb-0.5">Average Score</div>
                  <div className="text-xl font-extrabold text-white">{avgScore} / 100</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
