'use client';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';

interface ScoreData {
  quality: number;
  logic: number;
  performance: number;
  overall?: number;
}

interface SkillRadarChartProps {
  scores: ScoreData;
  name?: string;
}

export function SkillRadarChart({ scores, name = 'Skill Profile' }: SkillRadarChartProps) {
  const data = [
    { subject: 'Code Quality', score: scores.quality, fullMark: 100 },
    { subject: 'Logic', score: scores.logic, fullMark: 100 },
    { subject: 'Performance', score: scores.performance, fullMark: 100 },
    { subject: 'Efficiency', score: Math.round((scores.logic + scores.performance) / 2), fullMark: 100 },
    { subject: 'Creativity', score: Math.round((scores.quality + scores.logic) / 2 + 5), fullMark: 100 },
  ];

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
          <PolarGrid stroke="rgba(99,102,241,0.2)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#6b7280', fontSize: 11, fontFamily: 'Inter, sans-serif' }}
          />
          <Radar
            name={name}
            dataKey="score"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.25}
            strokeWidth={2}
          />
          <Tooltip
            contentStyle={{
              background: '#0f172a',
              border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: '12px',
              color: '#e2e8f0',
              fontSize: '12px',
            }}
            formatter={(value) => [`${value}/100`, 'Score'] as [string, string]}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
