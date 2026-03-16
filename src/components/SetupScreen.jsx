import { useState } from 'react'
import { INTERVIEW_TYPES } from '../config'
import styles from './SetupScreen.module.css'

export default function SetupScreen({ onStart }) {
  const [selectedType, setSelectedType] = useState(null)
  const [selectedTopic, setSelectedTopic] = useState(null)

  const type = INTERVIEW_TYPES.find(t => t.id === selectedType)

  function handleTypeSelect(id) {
    setSelectedType(id)
    setSelectedTopic(null)
  }

  function handleStart() {
    if (!selectedType) return
    onStart({ type: selectedType, topic: selectedTopic })
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={styles.eyebrow}>Junior dev track</span>
        <h1 className={styles.title}>Interview Simulator</h1>
        <p className={styles.subtitle}>
          Practice with an AI interviewer. Get real feedback on every answer.
        </p>
      </header>

      <section className={styles.section}>
        <p className={styles.sectionLabel}>Choose interview type</p>
        <div className={styles.typeGrid}>
          {INTERVIEW_TYPES.map(t => (
            <button
              key={t.id}
              className={`${styles.typeCard} ${selectedType === t.id ? styles.selected : ''}`}
              onClick={() => handleTypeSelect(t.id)}
            >
              <span className={styles.typeIcon}>{t.icon}</span>
              <span className={styles.typeLabel}>{t.label}</span>
              <span className={styles.typeDesc}>{t.desc}</span>
              {t.hasEditor && (
                <span className={styles.editorBadge}>Code editor</span>
              )}
            </button>
          ))}
        </div>
      </section>

      {type && (
        <section className={styles.section} style={{ animation: 'fadeUp 0.2s ease' }}>
          <p className={styles.sectionLabel}>
            Topic focus <span className={styles.optional}>— optional</span>
          </p>
          <div className={styles.topicGrid}>
            {type.topics.map(topic => (
              <button
                key={topic}
                className={`${styles.topicChip} ${selectedTopic === topic ? styles.topicSelected : ''}`}
                onClick={() => setSelectedTopic(selectedTopic === topic ? null : topic)}
              >
                {topic}
              </button>
            ))}
          </div>
        </section>
      )}

      <div className={styles.footer}>
        <div className={styles.meta}>
          <span>5 questions</span>
          <span className={styles.dot}>·</span>
          <span>Live AI feedback</span>
          <span className={styles.dot}>·</span>
          <span>Full debrief</span>
        </div>
        <button
          className={styles.startBtn}
          disabled={!selectedType}
          onClick={handleStart}
        >
          Start interview →
        </button>
      </div>
    </div>
  )
}
