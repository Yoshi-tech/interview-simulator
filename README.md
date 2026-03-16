# Interview Simulator

A free, local AI-powered mock interview tool for junior developers. No API key, no cost — runs entirely on your machine using Ollama.

## Features

- **4 interview types**: Coding, System Design, Behavioral, Domain Knowledge
- **Monaco code editor** for coding questions (with language switching)
- **Real AI feedback** after every answer: score, strengths, improvements, actionable tip
- **Full debrief** at the end with an AI-generated overall summary
- **Streaming responses** — answers appear as they generate
- **Completely free** — powered by Llama 3 via Ollama

## Setup

### 1. Install Ollama

Download from [ollama.com](https://ollama.com) and install it.

### 2. Pull the model

```bash
ollama pull llama3
```

This downloads ~4GB. Run it once:

```bash
ollama run llama3
```

### 3. Install and run the app

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Changing the model

Edit `src/ollama.js` and change the `MODEL` constant:

```js
const MODEL = 'llama3'        // default
const MODEL = 'mistral'       // faster, lighter
const MODEL = 'llama3:70b'    // smarter, needs more RAM
const MODEL = 'codellama'     // better for coding questions
```

Run `ollama pull <model-name>` first if you haven't already.

## Project structure

```
src/
  App.jsx                  # Screen orchestration
  main.jsx                 # Entry point
  index.css                # Global styles & design tokens
  ollama.js                # Ollama API client (streaming + JSON)
  config.js                # Interview types, topics, prompt builders
  components/
    OllamaStatus.jsx/css   # Connection check & setup guide
    SetupScreen.jsx/css    # Type & topic selection
    InterviewScreen.jsx    # Main interview flow
    CodeEditor.jsx/css     # Monaco editor wrapper
    FeedbackCard.jsx/css   # Per-answer feedback display
    DebriefScreen.jsx/css  # Final results & AI summary
```

## How it works

1. The app connects to your local Ollama instance at `http://localhost:11434`
2. Vite proxies `/api/ollama` → `localhost:11434` to avoid CORS
3. Questions are generated fresh each session (no repeats within a session)
4. Feedback is requested as JSON using Ollama's `format: "json"` mode
5. The debrief summary streams token-by-token for a live feel

## Tips

- For **coding questions**, describe your approach in the code comments before writing code — the AI evaluates your reasoning, not just syntax
- For **behavioral questions**, use the STAR format: Situation, Task, Action, Result
- Run multiple sessions on the same topic to build familiarity
- Try `codellama` for more focused coding question feedback
