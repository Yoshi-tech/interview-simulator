export const INTERVIEW_TYPES = [
  {
    id: 'coding',
    label: 'Coding',
    icon: '{ }',
    desc: 'Algorithms, data structures, problem solving',
    hasEditor: true,
    topics: ['Arrays & strings', 'Recursion', 'Sorting & searching', 'Linked lists', 'Hash maps', 'Trees & graphs'],
  },
  {
    id: 'system',
    label: 'System design',
    icon: '⬡',
    desc: 'Architecture, APIs, databases, trade-offs',
    hasEditor: false,
    topics: ['REST APIs', 'Databases', 'Caching', 'Load balancing', 'Microservices', 'Authentication'],
  },
  {
    id: 'behavioral',
    label: 'Behavioral',
    icon: '◎',
    desc: 'STAR format, teamwork, conflict, growth',
    hasEditor: false,
    topics: ['Teamwork', 'Conflict resolution', 'Failure & learning', 'Time management', 'Communication', 'Initiative'],
  },
  {
    id: 'domain',
    label: 'Domain',
    icon: '</>',
    desc: 'React, JavaScript, Python, CSS, Git',
    hasEditor: false,
    topics: ['React & hooks', 'JavaScript core', 'Python basics', 'CSS & layout', 'Git & version control', 'TypeScript'],
  },
]

export const TOTAL_QUESTIONS = 5

export function buildQuestionPrompt(type, topic, previousQuestions) {
  const typeLabel = INTERVIEW_TYPES.find(t => t.id === type)?.label || type
  const used = previousQuestions.length
    ? `Previously asked questions (do NOT repeat these or similar ones): ${previousQuestions.map((q, i) => `${i + 1}. ${q}`).join(' | ')}`
    : ''

  const levelNote = 'This is for a junior developer (0–2 years experience). Keep complexity appropriate.'

  const typeInstructions = {
    coding: `Ask a concrete coding problem. It should be solvable in 10–20 minutes. State it clearly with an example input/output if helpful. Do NOT ask for full implementation — ask them to describe their approach or write pseudocode.`,
    system: `Ask a system design question scoped to junior level. It should involve a real-world scenario. Ask them to walk through their high-level approach.`,
    behavioral: `Ask a behavioral question using STAR format expectations. It should relate to real work or project situations a junior dev would encounter.`,
    domain: `Ask a technical knowledge question about ${topic || typeLabel}. It should test understanding, not just recall. Ask them to explain a concept or compare two things.`,
  }

  return `You are a professional technical interviewer at a top software company conducting a ${typeLabel} interview.

${levelNote}
Topic focus: ${topic || 'general ' + typeLabel}
${used}

${typeInstructions[type] || ''}

Generate exactly ONE interview question. Return ONLY the question text — no preamble, no numbering, no "Here's your question:", just the question itself.`
}

export function buildFeedbackPrompt(type, question, answer) {
  const typeLabel = INTERVIEW_TYPES.find(t => t.id === type)?.label || type

  return `You are a supportive but honest technical interviewer evaluating a junior developer's answer.

Interview type: ${typeLabel}
Question: ${question}
Candidate's answer: ${answer}

Evaluate this answer for a junior developer (0–2 years experience). Be specific, encouraging, and constructive.

Return a JSON object with these exact fields:
{
  "score": <integer 1–10>,
  "rating": "<one of: Excellent | Good | Needs work>",
  "strengths": "<1–2 sentences on what they did well>",
  "improvements": "<1–2 sentences on what to study or improve>",
  "tip": "<one concrete, actionable tip they can apply immediately>"
}`
}

export function buildDebriefPrompt(questions, answers, scores, type) {
  const typeLabel = INTERVIEW_TYPES.find(t => t.id === type)?.label || type
  const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length * 10) / 10
  const qa = questions.map((q, i) => `Q${i + 1}: ${q}\nA: ${answers[i]}\nScore: ${scores[i]}/10`).join('\n\n')

  return `You are a supportive technical interviewer. A junior developer just completed a ${typeLabel} mock interview with an average score of ${avg}/10.

Here are their questions and answers:
${qa}

Write a brief, honest overall debrief (3–5 sentences). Comment on their general performance, key patterns you noticed (good or bad), and the single most important thing they should focus on before their real interview. Be direct and encouraging.

Return only the debrief text, no JSON.`
}
