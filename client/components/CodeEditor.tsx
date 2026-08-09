'use client';
import { useState } from 'react';
import { Copy, Check, Terminal, Code2 } from 'lucide-react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  filename?: string;
  readOnly?: boolean;
}

export function CodeEditor({
  value,
  onChange,
  language = 'javascript',
  filename = 'solution.js',
  readOnly = false,
}: CodeEditorProps) {
  const [copied, setCopied] = useState(false);

  const lines = value.split('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-gray-950 font-mono text-xs">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900/90 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-sans">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            <span>{filename}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-gray-500 font-sans uppercase tracking-wider">{language}</span>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg glass text-gray-400 hover:text-white transition-colors"
            title="Copy code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="relative flex min-h-[400px] max-h-[550px] overflow-auto">
        {/* Line Numbers */}
        <div className="select-none py-4 px-3 text-right text-gray-600 bg-gray-900/40 border-r border-white/5 min-w-[40px] shrink-0 font-mono text-xs">
          {lines.map((_, i) => (
            <div key={i} className="leading-6">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Text Area Input */}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readOnly}
          spellCheck={false}
          className="w-full bg-transparent text-gray-200 p-4 leading-6 resize-none focus:outline-none font-mono text-xs whitespace-pre tab-4"
          style={{ minHeight: `${Math.max(400, lines.length * 24)}px` }}
        />
      </div>

      {/* Footer info */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900/60 border-t border-white/5 text-[11px] text-gray-500 font-sans">
        <span className="flex items-center gap-1">
          <Code2 className="w-3 h-3 text-indigo-400" /> {lines.length} lines, {value.length} characters
        </span>
        <span>UTF-8</span>
      </div>
    </div>
  );
}
