'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getTrackTask, submitAssessment, type EvaluationResult } from '@/lib/api';
import { AIEvaluationPanel } from '@/components/AIEvaluationPanel';
import { BadgeCard } from '@/components/BadgeCard';
import { EmbedWidget } from '@/components/EmbedWidget';
import { CodeEditor } from '@/components/CodeEditor';
import { ArrowLeft, Send, AlertCircle, BookOpen, Terminal, Loader2, Award, Sparkles } from 'lucide-react';
import Link from 'next/link';

const STORAGE_KEY = 'skillbridge_user';

const PLACEHOLDER_CODE: Record<string, string> = {
  'react-ui': `// React & UI Engineering Challenge
// Build the SearchableDropdown component
import React, { useState } from 'react';

export function SearchableDropdown({ options = [], placeholder = "Select option...", onChange }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filtered = options.filter(opt => 
    opt.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative w-64 font-sans">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        aria-label="Searchable dropdown"
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      {isOpen && (
        <ul className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-auto">
          {filtered.map(opt => (
            <li
              key={opt.id}
              onClick={() => { onChange?.(opt); setIsOpen(false); setQuery(opt.label); }}
              className="px-4 py-2 hover:bg-indigo-50 cursor-pointer text-sm"
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`,

  'nodejs-api': `// Node.js API Architecture Challenge
// Express.js route for /products resource
const express = require('express');
const router = express.Router();

// Mock middleware
const validateProduct = (req, res, next) => {
  const { name, price } = req.body;
  if (!name || typeof price !== 'number') {
    return res.status(400).json({ error: 'Invalid product data: name and price required' });
  }
  next();
};

// GET /products - list + filter + pagination
router.get('/', async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const query = { deletedAt: null };
    if (category) query.category = category;
    
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const [products, total] = await Promise.all([
      Product.find(query).skip((pageNum - 1) * limitNum).limit(limitNum),
      Product.countDocuments(query),
    ]);
    
    res.json({
      data: products,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products', message: err.message });
  }
});

// POST /products
router.post('/', validateProduct, async (req, res) => {
  try {
    const product = await new Product(req.body).save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;`,

  'python-data': `# Python Data Handling Challenge
# Sales record aggregation function
from typing import List, Dict, Any

def process_sales_records(records: List[Dict[str, Any]]) -> Dict[str, Any]:
    if not records:
        return {"categories": {}, "top_categories": [], "total_sales": 0.0}

    category_stats = {}
    total_revenue = 0.0

    for record in records:
        category = record.get("category", "Uncategorized")
        amount = float(record.get("amount", 0.0))
        total_revenue += amount

        if category not in category_stats:
            category_stats[category] = {"total": 0.0, "count": 0, "average": 0.0}

        category_stats[category]["total"] += amount
        category_stats[category]["count"] += 1

    for cat, data in category_stats.items():
        data["average"] = round(data["total"] / data["count"], 2)
        data["total"] = round(data["total"], 2)

    top_3 = sorted(category_stats.items(), key=lambda x: x[1]["total"], reverse=True)[:3]
    top_categories = [cat for cat, _ in top_3]

    return {
        "categories": category_stats,
        "top_categories": top_categories,
        "total_sales": round(total_revenue, 2),
    }
`,

  'system-design': `// System Design: URL Shortener Service
// Algorithm: Base62 encoding of auto-incrementing ID
class UrlShortenerService {
  constructor(db, redisClient) {
    this.db = db;
    this.redis = redisClient;
    this.BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  }

  encode(id) {
    let str = "";
    while (id > 0) {
      str = this.BASE62[id % 62] + str;
      id = Math.floor(id / 62);
    }
    return str.padStart(6, '0');
  }

  async shortenUrl(originalUrl, customSlug = null) {
    if (customSlug) {
      const exists = await this.db.findOne({ slug: customSlug });
      if (exists) throw new Error("Custom slug collision");
      await this.db.insert({ slug: customSlug, originalUrl, hits: 0 });
      return customSlug;
    }

    const doc = await this.db.insert({ originalUrl, hits: 0 });
    const slug = this.encode(doc.id);
    await this.db.update(doc.id, { slug });
    await this.redis.set(slug, originalUrl, 'EX', 86400); // 24h cache
    return slug;
  }

  async getOriginalUrl(slug) {
    const cached = await this.redis.get(slug);
    if (cached) {
      this.db.incrementHits(slug); // async analytics
      return cached;
    }
    const doc = await this.db.findOne({ slug });
    if (!doc) return null;
    await this.redis.set(slug, doc.originalUrl, 'EX', 86400);
    return doc.originalUrl;
  }
}
`,

  'typescript-fullstack': `// TypeScript Utility Library Challenge
export type Result<T, E = Error> =
  | { success: true; value: T }
  | { success: false; error: E };

export function ok<T>(value: T): Result<T, never> {
  return { success: true, value };
}

export function err<E>(error: E): Result<never, E> {
  return { success: false, error };
}

export function pipe<T>(...fns: Array<(arg: any) => any>): (arg: T) => any {
  return (initial: T) => fns.reduce((acc, fn) => fn(acc), initial);
}

export function memoize<T extends (...args: any[]) => any>(fn: T, ttlMs = 5000): T {
  const cache = new Map<string, { value: any; expiry: number }>();
  return ((...args: any[]) => {
    const key = JSON.stringify(args);
    const now = Date.now();
    const hit = cache.get(key);
    if (hit && now < hit.expiry) return hit.value;
    const result = fn(...args);
    cache.set(key, { value: result, expiry: now + ttlMs });
    return result;
  }) as T;
}
`,

  'devops-cloud': `# Dockerfile & docker-compose for Node.js + Redis Architecture
# Multi-stage Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
USER node
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:3000/api/health || exit 1
CMD ["node", "dist/index.js"]
`,
};

export default function AssessPage() {
  const params = useParams();
  const router = useRouter();
  const track = params.track as string;

  const [taskDesc, setTaskDesc] = useState('');
  const [trackName, setTrackName] = useState('');
  const [code, setCode] = useState('');
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const [taskLoading, setTaskLoading] = useState(true);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'task' | 'code'>('task');

  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const u = JSON.parse(stored);
      setUserId(u.id || u._id || '');
      setUserName(u.name || '');
    } else {
      router.push('/dashboard');
      return;
    }

    setCode(PLACEHOLDER_CODE[track] || '// Write your solution here\n');

    getTrackTask(track)
      .then((data) => {
        setTaskDesc(data.taskDescription);
        setTrackName(data.trackName);
      })
      .catch(() => {
        setTaskDesc('Task could not be loaded. Please make sure the server is running.');
        setTrackName(track);
      })
      .finally(() => setTaskLoading(false));
  }, [track, router]);

  const handleSubmit = async () => {
    if (!code.trim() || code.trim().length < 20) {
      setError('Please write a meaningful solution before submitting.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await submitAssessment({ userId, userName, track, code });
      setResult(res);
      if (res.badge) {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            const u = JSON.parse(stored);
            const existingBadges = Array.isArray(u.badges) ? u.badges : [];
            const badgeId = res.badge.id || res.badge._id || res.badge.badgeHash;
            const exists = existingBadges.some((b: any) =>
              typeof b === 'object' ? (b.id === badgeId || b._id === badgeId || b.badgeHash === res.badge.badgeHash) : b === badgeId
            );
            if (!exists) {
              u.badges = [res.badge, ...existingBadges];
              localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
            }
          } catch (err) {
            console.error('Failed to update local user badges:', err);
          }
        }
      }

      // Smooth scroll down to Results Section
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 200);

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Submission failed. Is the server running on port 5000?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-20 px-4 sm:px-6 max-w-4xl mx-auto space-y-12">
      {/* Header */}
      <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/tracks" className="p-2 rounded-xl glass hover:text-white text-gray-400 transition-colors" title="Back to Skill Tracks">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-white">{trackName || track}</h1>
            <p className="text-gray-500 text-xs mt-0.5">Practical Skill Challenge Assessment</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full self-start sm:self-auto font-medium">
          <Sparkles className="w-3.5 h-3.5" /> AI Evaluator Active
        </div>
      </div>

      {/* Main Workspace Column */}
      <div className="space-y-6">
        {/* Tab Switch */}
        <div className="flex gap-2 p-1.5 bg-gray-900 rounded-2xl max-w-xs">
          <button
            onClick={() => setTab('task')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
              tab === 'task' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Task Brief
          </button>
          <button
            onClick={() => setTab('code')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
              tab === 'code' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" /> Code Editor
          </button>
        </div>

        {tab === 'task' && (
          <div className="glass-card p-8 animate-fade-in-up">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" /> Challenge Specifications
            </h2>
            {taskLoading ? (
              <div className="flex items-center gap-2 text-gray-400 text-sm py-4">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" /> Loading challenge requirements...
              </div>
            ) : (
              <pre className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {taskDesc}
              </pre>
            )}
          </div>
        )}

        {tab === 'code' && (
          <div className="animate-fade-in-up">
            <CodeEditor
              value={code}
              onChange={setCode}
              filename={`solution.${track.includes('python') ? 'py' : track.includes('typescript') ? 'ts' : 'js'}`}
              language={track.includes('python') ? 'python' : track.includes('typescript') ? 'typescript' : 'javascript'}
            />
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {/* Submit CTA */}
        <button
          onClick={handleSubmit}
          id="submit-assessment-btn"
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm hover:opacity-90 transition-all hover:scale-[1.01] disabled:opacity-50 disabled:scale-100 shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Evaluating Code with GPT-4...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Submit Code for AI Evaluation & Badge Generation
            </>
          )}
        </button>

        {loading && (
          <div className="text-center text-xs text-gray-500 animate-pulse">
            Analyzing code structure, logic correctness, performance metrics, and generating SHA-256 badge...
          </div>
        )}
      </div>

      {/* Downside Scrolling Results Section (Single Column Layout) */}
      <div ref={resultsRef} className="pt-8">
        {result && (
          <div className="space-y-10 animate-fade-in-up border-t border-white/10 pt-10">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-semibold mb-3">
                ✓ AI Evaluation & Verification Complete
              </div>
              <h2 className="text-3xl font-extrabold text-white">Your Evaluation Results</h2>
              <p className="text-gray-400 text-xs mt-1">
                Below are your detailed score breakdown, verified digital badge, and embed code.
              </p>
            </div>

            {/* Result Item 1: AI Score Breakdown Panel */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" /> 1. Detailed AI Competency Score
              </h3>
              <AIEvaluationPanel
                scores={result.evaluation}
                level={result.evaluation.level}
                tier={result.evaluation.tier}
                strengths={result.evaluation.strengths}
                weaknesses={result.evaluation.weaknesses}
                engine={result.evaluation.engine}
                trackName={trackName}
                visible={true}
              />
            </div>

            {/* Result Item 2: Verified Digital Badge */}
            {result.badge && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" /> 2. Verified Digital Badge
                </h3>
                <div className="flex justify-center">
                  <BadgeCard badge={result.badge} />
                </div>
              </div>
            )}

            {/* Result Item 3: Embed Badge Code Widget */}
            {result.badge && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  💻 3. Embed Badge on GitHub & Portfolio
                </h3>
                <EmbedWidget badgeId={result.badge.id || result.badge._id} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
