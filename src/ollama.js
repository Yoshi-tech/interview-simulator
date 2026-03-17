const API = '/api/chat'

export async function ollamaChat(prompt, onChunk) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, stream: true }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || `Request failed: ${res.status}`)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let full = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const chunk = decoder.decode(value, { stream: true })
    const lines = chunk.split('\n').filter(l => l.startsWith('data: '))
    for (const line of lines) {
      const data = line.slice(6).trim()
      if (data === '[DONE]') continue
      try {
        const json = JSON.parse(data)
        const token = json.choices?.[0]?.delta?.content
        if (token) { full += token; onChunk?.(full) }
      } catch {}
    }
  }
  return full
}

export async function ollamaChatJson(prompt) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, stream: false, json: true }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || `Request failed: ${res.status}`)
  }
  const data = await res.json()
  const text = data.choices?.[0]?.message?.content || '{}'
  return JSON.parse(text)
}

export async function checkOllama() {
  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'Reply with the word OK and nothing else.', stream: false }),
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return { ok: false, error: err.error || `Status ${res.status}` }
    }
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e.message }
  }
}