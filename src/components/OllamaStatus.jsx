import { useState, useEffect } from 'react'
import { checkOllama } from '../ollama'
import styles from './OllamaStatus.module.css'

export default function OllamaStatus({ onReady }) {
  const [status, setStatus] = useState('checking') // checking | ok | error
  const [models, setModels] = useState([])

  useEffect(() => {
    check()
  }, [])

  async function check() {
    setStatus('checking')
    const result = await checkOllama()
    if (result.ok) {
      setModels(result.models)
      setStatus('ok')
      onReady?.()
    } else {
      setStatus('error')
    }
  }

  if (status === 'ok') return null

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        {status === 'checking' && (
          <>
            <div className={styles.spinner} />
            <p className={styles.label}>Connecting to Ollama...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className={styles.errorDot} />
            <h2 className={styles.title}>Ollama not running</h2>
            <p className={styles.desc}>
              This app uses Ollama to run AI locally — free, private, no API key needed.
            </p>
            <ol className={styles.steps}>
              <li>
                Install Ollama from{' '}
                <a href="https://ollama.com" target="_blank" rel="noreferrer">
                  ollama.com
                </a>
              </li>
              <li>
                Run in your terminal:
                <code className={styles.code}>ollama run llama3</code>
              </li>
              <li>Come back here once it's running</li>
            </ol>
            <button className={styles.retryBtn} onClick={check}>
              Try again
            </button>
          </>
        )}
      </div>
    </div>
  )
}
