import styles from './FeedbackCard.module.css'

const RATING_CONFIG = {
  'Excellent': { class: styles.excellent, label: 'Excellent' },
  'Good': { class: styles.good, label: 'Good' },
  'Needs work': { class: styles.needsWork, label: 'Needs work' },
}

export default function FeedbackCard({ feedback, isStreaming }) {
  if (!feedback && !isStreaming) return null

  const config = RATING_CONFIG[feedback?.rating] || RATING_CONFIG['Good']

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.label}>Feedback</span>
        {feedback && (
          <div className={styles.scoreRow}>
            <span className={`${styles.ratingBadge} ${config.class}`}>
              {config.label}
            </span>
            <span className={styles.score}>{feedback.score}<span className={styles.outOf}>/10</span></span>
          </div>
        )}
      </div>

      {isStreaming && !feedback && (
        <div className={styles.streaming}>
          <span className={styles.streamDot} />
          <span className={styles.streamDot} style={{ animationDelay: '0.2s' }} />
          <span className={styles.streamDot} style={{ animationDelay: '0.4s' }} />
        </div>
      )}

      {feedback && (
        <div className={styles.body}>
          {feedback.strengths && (
            <div className={styles.row}>
              <span className={styles.rowIcon} style={{ color: 'var(--accent)' }}>↑</span>
              <div>
                <p className={styles.rowLabel}>Strengths</p>
                <p className={styles.rowText}>{feedback.strengths}</p>
              </div>
            </div>
          )}
          {feedback.improvements && (
            <div className={styles.row}>
              <span className={styles.rowIcon} style={{ color: 'var(--amber)' }}>→</span>
              <div>
                <p className={styles.rowLabel}>Improve</p>
                <p className={styles.rowText}>{feedback.improvements}</p>
              </div>
            </div>
          )}
          {feedback.tip && (
            <div className={styles.tip}>
              <span className={styles.tipIcon}>✦</span>
              <p className={styles.tipText}>{feedback.tip}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
