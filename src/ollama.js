const OLLAMA_BASE = 'http://localhost:11434'
const MODEL = 'llama3'

export async function ollamaChat(prompt, onChunk) {
  const res = await fetch(`${OLLAMA_BASE}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      prompt,
      stream: true,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Ollama error ${res.status}: ${err}`)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let full = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const chunk = decoder.decode(value, { stream: true })
    const lines = chunk.split('\n').filter(Boolean)
    for (const line of lines) {
      try {
        const json = JSON.parse(line)
        if (json.response) {
          full += json.response
          onChunk?.(full)
        }
      } catch {}
    }
  }

  return full
}

export async function ollamaChatJson(prompt) {
  const res = await fetch(`${OLLAMA_BASE}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      prompt: prompt + '\n\nRespond with valid JSON only. No markdown, no explanation.',
      stream: false,
      format: 'json',
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Ollama error ${res.status}: ${err}`)
  }

  const data = await res.json()
  return JSON.parse(data.response)
}

export async function checkOllama() {
  try {
    const res = await fetch(`${OLLAMA_BASE}/api/tags`, { signal: AbortSignal.timeout(3000) })
    if (!res.ok) return { ok: false, models: [] }
    const data = await res.json()
    return { ok: true, models: data.models?.map(m => m.name) || [] }
  } catch {
    return { ok: false, models: [] }
  }
}
