'use client';
import { useState } from 'react';
import { Copy, Check, ExternalLink, Code2 } from 'lucide-react';

interface EmbedWidgetProps {
  badgeId: string;
  baseUrl?: string;
}

export function EmbedWidget({ badgeId, baseUrl = 'http://localhost:3000' }: EmbedWidgetProps) {
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<'iframe' | 'markdown' | 'html'>('iframe');

  const verifyUrl = `${baseUrl}/badge/${badgeId}`;
  const snippets = {
    iframe: `<iframe 
  src="${baseUrl}/badge/${badgeId}"
  width="400" 
  height="200" 
  frameborder="0"
  style="border-radius:16px;overflow:hidden;"
  title="SkillBridge Verified Badge"
></iframe>`,
    markdown: `[![SkillBridge Verified Badge](${baseUrl}/api/badge/${badgeId}/image)](${verifyUrl})`,
    html: `<a href="${verifyUrl}" target="_blank" rel="noopener noreferrer">
  <img src="${baseUrl}/api/badge/${badgeId}/image" 
       alt="SkillBridge Verified Badge" 
       width="400" />
</a>`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[tab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Code2 className="w-4 h-4 text-indigo-400" />
        <h3 className="text-sm font-semibold text-white">Embed This Badge</h3>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 p-1 bg-gray-900 rounded-xl">
        {(['iframe', 'markdown', 'html'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-lg transition-all ${
              tab === t
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {t === 'iframe' ? 'iFrame' : t === 'markdown' ? 'Markdown' : 'HTML'}
          </button>
        ))}
      </div>

      {/* Code block */}
      <div className="relative">
        <pre className="code-editor bg-gray-900 text-gray-300 p-4 rounded-xl text-xs overflow-x-auto whitespace-pre-wrap break-all border border-white/5">
          {snippets[tab]}
        </pre>
        <button
          onClick={handleCopy}
          id="copy-embed-btn"
          className="absolute top-3 right-3 p-1.5 rounded-lg glass text-gray-400 hover:text-white transition-all"
          title="Copy to clipboard"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
        <ExternalLink className="w-3 h-3" />
        Paste in your GitHub README, portfolio, or personal website.
      </div>
    </div>
  );
}
