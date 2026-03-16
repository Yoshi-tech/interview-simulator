import { useState, useEffect } from 'react'
import { INTERVIEW_TYPES, buildDebriefPrompt } from '../config'
import { ollamaChat } from '../ollama'
import styles from './DebriefScreen.module.css'

const RATING_CONFIG = {
  'Excellent': { class: styles.excellent },
  'Good': { class: styles.good },
  'Needs work': { class: styles.needsWork },
}

export default function DebriefScreen({ data, config, onRestart }) {
  const { type } = config
  const typeConfig = INTERVIEW_TYPES.find(t => t.id === type)
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(true)

  const scores = data.map(d => d.feedback?.score || 5)
  const avg = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : '—'

  useEffect(() => {
    if (data.length === 0) { setLoading(false); return }
    const questions = data.map(d => d.question)
    const answers = data.map(d => d.answer)
    const prompt = buildDebriefPrompt(questions, answers, scores, type)
    ollamaChat(prompt, text => setSummary(text))
      .then(() => setLoading(false))
      .catch(() => setLoading(false))
  }, [])

  const scoreColor = avg >= 7 ? '#c8f060' : avg >= 5 ? '#ffb547' : '#ff5f5f'

  return (
    <div className={styles.container}>
      <div className={styles.scoreHero}>
        <p className={styles.eyebrow}>Session complete</p>
        <div className={styles.avgScore} style={{ color: scoreColor }}>
          {avg}
          <span className={styles.avgOut}>/10</span>
        </div>
        <p className={styles.avgLabel}>average score · {data.length} question{data.length !== 1 ? 's' : ''}</p>
      </div>

      {(loading || summary) && (
        <div className={styles.summaryBox}>
          <p className={styles.summaryLabel}>Overall debrief</p>
          {loading && !summary ? (
            <div className={styles.dots}>
              <span /><span /><span />
            </div>
          ) : (
            <p className={styles.summaryText}>{summary}</p>
          )}
        </div>
      )}

      <h2 className={styles.sectionTitle}>Question by question</h2>

      <div className={styles.questionList}>
        {data.map((item, i) => {
          const rating = item.feedback?.rating || 'Good'
          const rc = RATING_CONFIG[rating] || RATING_CONFIG['Good']
          return (
            <div key={i} className={styles.qCard}>
              <div className={styles.qHeader}>
                <span className={styles.qNum}>Q{i + 1}</span>
                <span className={`${styles.ratingBadge} ${rc.class}`}>{rating}</span>
                {item.feedback?.score && (
                  <span className={styles.qScore}>{item.feedback.score}/10</span>
                )}
              </div>
              <p className={styles.qText}>{item.question}</p>
              <div className={styles.answerBlock}>
                <p className={styles.answerLabel}>Your answer</p>
                <p className={styles.answerText}>{item.answer}</p>
              </div>
              {item.feedback && (
                <div className={styles.feedbackRows}>
                  {item.feedback.strengths && (
                    <div className={styles.feedRow}>
                      <span className={styles.feedIcon} style={{ color: '#c8f060' }}>↑</span>
                      <p>{item.feedback.strengths}</p>
                    </div>
                  )}
                  {item.feedback.improvements && (
                    <div className={styles.feedRow}>
                      <span className={styles.feedIcon} style={{ color: '#ffb547' }}>→</span>
                      <p>{item.feedback.improvements}</p>
                    </div>
                  )}
                  {item.feedback.tip && (
                    <div className={styles.tipRow}>
                      <span style={{ color: '#c8f060', fontSize: '11px' }}>✦</span>
                      <p>{item.feedback.tip}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className={styles.footer}>
        <button className={styles.restartBtn} onClick={onRestart}>
          Practice again →
        </button>
      </div>
    </div>
  )
}
