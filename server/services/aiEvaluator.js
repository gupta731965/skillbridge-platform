require('dotenv').config();
const OpenAI = process.env.OPENAI_API_KEY ? require('openai') : null;

const openai = OpenAI && process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const SKILL_TRACK_CONTEXT = {
  'react-ui': 'React & UI Engineering',
  'nodejs-api': 'Node.js API Architecture',
  'python-data': 'Python Data Handling',
  'system-design': 'System Design & Architecture',
  'typescript-fullstack': 'TypeScript Full-Stack',
  'devops-cloud': 'DevOps & Cloud Infrastructure',
};

/**
 * Heuristic simulation engine — produces realistic evaluation without OpenAI
 * Analyzes code structure, patterns, and complexity indicators.
 */
function simulateEvaluation(code, track) {
  const lines = code.split('\n').filter(l => l.trim());
  const totalLines = lines.length;
  const commentLines = lines.filter(l => l.trim().startsWith('//') || l.trim().startsWith('#') || l.trim().startsWith('*')).length;
  const hasErrorHandling = /try|catch|\.catch|reject|throw|error/i.test(code);
  const hasFunctions = /function|=>|def |const \w+ =|async/i.test(code);
  const hasModularStructure = /import|require|export|module\./i.test(code);
  const hasMeaningfulNames = !/var [a-z]$|function [a-z]$/m.test(code) && !/\bx\b|\by\b|\bz\b|\ba\b|\bb\b/.test(code);
  const hasTypeAnnotations = /:\s*(string|number|boolean|any|void|Promise|Array)/i.test(code);
  const complexityKeywords = (code.match(/for|while|if|switch|forEach|map|filter|reduce/g) || []).length;
  const nestingDepth = Math.min(10, (code.match(/\{/g) || []).length / Math.max(1, totalLines) * 15);

  // Score calculation with realistic variance
  const seed = code.length % 17; // deterministic variance

  let quality = 40;
  if (totalLines > 5) quality += 10;
  if (totalLines > 20) quality += 10;
  if (commentLines / Math.max(1, totalLines) > 0.1) quality += 15;
  if (hasMeaningfulNames) quality += 10;
  if (hasTypeAnnotations) quality += 15;
  quality += seed;
  quality = Math.min(99, Math.max(30, quality));

  let logic = 40;
  if (hasErrorHandling) logic += 20;
  if (hasFunctions) logic += 15;
  if (complexityKeywords > 2) logic += 10;
  if (complexityKeywords > 5) logic += 5;
  logic += (seed * 2) % 10;
  logic = Math.min(99, Math.max(30, logic));

  let performance = 40;
  if (hasModularStructure) performance += 15;
  if (!/(setTimeout|setInterval)/i.test(code)) performance += 5;
  if (nestingDepth < 4) performance += 20;
  if (totalLines > 10 && totalLines < 200) performance += 10;
  performance += (seed * 3) % 12;
  performance = Math.min(99, Math.max(30, performance));

  const overall = Math.round((quality + logic + performance) / 3);
  const level = overall >= 80 ? 'Expert' : overall >= 60 ? 'Intermediate' : 'Beginner';
  const tier = overall >= 85 ? 'Platinum' : overall >= 70 ? 'Gold' : overall >= 55 ? 'Silver' : 'Bronze';

  const trackName = SKILL_TRACK_CONTEXT[track] || track;

  const strengthsPool = [
    `Demonstrates solid understanding of ${trackName} fundamentals`,
    'Good modular code structure with clear separation of concerns',
    'Error handling patterns reflect production-ready thinking',
    'Meaningful variable and function naming improves readability',
    'Appropriate use of modern language features and syntax',
    'Code logic is clean and easy to follow',
    'Shows evidence of code reusability principles',
  ];

  const weaknessesPool = [
    'Additional inline comments would improve long-term maintainability',
    'Edge case handling could be more comprehensive',
    'Consider adding type annotations for better tooling support',
    'Unit test coverage would strengthen confidence in this solution',
    'Performance optimization possible for large-scale data sets',
    'Input validation patterns could be more robust',
    'Some functions could be broken into smaller, testable units',
  ];

  const strengths = strengthsPool.filter((_, i) => (quality + i * 11) % 3 !== 0).slice(0, 3);
  const weaknesses = weaknessesPool.filter((_, i) => (logic + i * 7) % 3 !== 0).slice(0, 3);

  return { quality, logic, performance, overall, level, tier, strengths, weaknesses };
}

/**
 * OpenAI-powered evaluation using structured JSON prompt
 */
async function evaluateWithOpenAI(code, track) {
  const trackName = SKILL_TRACK_CONTEXT[track] || track;
  const prompt = `You are a senior software engineering evaluator for the SkillBridge platform.
Evaluate the following code submission for the "${trackName}" skill track.

Return ONLY a valid JSON object with this exact structure:
{
  "quality": <integer 0-100>,
  "logic": <integer 0-100>,
  "performance": <integer 0-100>,
  "overall": <integer 0-100>,
  "level": "<Beginner|Intermediate|Expert>",
  "tier": "<Bronze|Silver|Gold|Platinum>",
  "strengths": ["<point 1>", "<point 2>", "<point 3>"],
  "weaknesses": ["<point 1>", "<point 2>", "<point 3>"]
}

Scoring guidelines:
- quality: code clarity, naming, structure, comments (0-100)
- logic: correctness, error handling, algorithmic approach (0-100)
- performance: efficiency, scalability, best practices (0-100)
- overall: weighted average
- level: Beginner (<60), Intermediate (60-79), Expert (80+)
- tier: Bronze (<55), Silver (55-69), Gold (70-84), Platinum (85+)

Code submission:
\`\`\`
${code.substring(0, 3000)}
\`\`\``;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    response_format: { type: 'json_object' },
  });

  return JSON.parse(response.choices[0].message.content);
}

/**
 * Main evaluation function — tries OpenAI first, falls back to simulation
 */
async function evaluateSubmission(code, track) {
  if (openai) {
    try {
      console.log('[AI Evaluator] Using OpenAI GPT-4o-mini...');
      const result = await evaluateWithOpenAI(code, track);
      return { ...result, engine: 'openai' };
    } catch (err) {
      console.warn('[AI Evaluator] OpenAI failed, using simulation:', err.message);
    }
  }
  console.log('[AI Evaluator] Using simulated evaluation engine...');
  return { ...simulateEvaluation(code, track), engine: 'simulated' };
}

module.exports = { evaluateSubmission };
