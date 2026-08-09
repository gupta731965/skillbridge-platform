const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `API error ${res.status}`);
  }
  return res.json();
}

// Users
export const createUser = (name: string, email: string) =>
  request<User>('/users', { method: 'POST', body: JSON.stringify({ name, email }) });

export const getUser = (id: string) => request<UserWithBadges>(`/users/${id}`);

// Assessments
export const getTracks = () => request<Track[]>('/assessments/tracks');
export const getTrackTask = (track: string) => request<TrackTask>(`/assessments/track/${track}/task`);
export const submitAssessment = (data: SubmitPayload) =>
  request<EvaluationResult>('/assessments/evaluate', {
    method: 'POST',
    body: JSON.stringify(data),
  });

// Verification
export const verifyBadge = (hash: string) => request<VerificationResult>(`/verify/${hash}`);

// Health
export const healthCheck = () => request<HealthResponse>('/health');

// ─── Types ───────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  _id: string;
  name: string;
  email: string;
  badges: string[] | Badge[];
  createdAt: string;
}

export interface UserWithBadges extends Omit<User, 'badges'> {
  badges: Badge[];
}

export interface Employer {
  id: string;
  companyName: string;
  companyEmail: string;
  role: 'employer';
  loggedInAt: string;
}

export interface Badge {
  id: string;
  _id: string;
  userId: string;
  userName: string;
  assessmentId: string;
  badgeHash: string;
  shortId: string;
  track: string;
  trackName: string;
  overallScore: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  level: 'Beginner' | 'Intermediate' | 'Expert';
  issuedAt: string;
}

export interface Assessment {
  id: string;
  track: string;
  trackName: string;
  aiScores: { quality: number; logic: number; performance: number; overall: number };
  aiLevel: string;
  tier: string;
  strengths: string[];
  weaknesses: string[];
  submittedAt: string;
  engine: string;
}

export interface Track {
  id: string;
  name: string;
  task: string;
}

export interface TrackTask {
  track: string;
  trackName: string;
  taskDescription: string;
}

export interface SubmitPayload {
  userId: string;
  userName: string;
  track: string;
  code: string;
}

export interface EvaluationResult {
  success: boolean;
  assessment: Assessment;
  badge: Badge;
  evaluation: {
    quality: number;
    logic: number;
    performance: number;
    overall: number;
    level: string;
    tier: string;
    strengths: string[];
    weaknesses: string[];
    engine: string;
  };
}

export interface VerificationResult {
  verified: boolean;
  badge: Badge;
  assessment: Assessment;
  candidate: { name: string; email?: string };
}

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
  dbMode: string;
  aiEngine: string;
}
