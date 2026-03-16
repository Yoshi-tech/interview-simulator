import { useState, useEffect, useRef } from 'react'
import { INTERVIEW_TYPES, TOTAL_QUESTIONS, buildQuestionPrompt, buildFeedbackPrompt } from '../config'
import { ollamaChat, ollamaChatJson } from '../ollama'
import CodeEditor, { STARTER } from './CodeEditor'
import FeedbackCard from './FeedbackCard'
import styles from './InterviewScreen.module.css'

export default function InterviewScreen({ config, onFinish }) {
  const { type, topic } = config
  const typeConfig = INTERVIEW_TYPES.find(t => t.id === type)

  const [phase, setPhase] = useState('loading') // loading | answering | evaluating | feedback
  const [currentQ, setCurrentQ] = useState(0)
  const [question, setQuestion] = useState('')
  const [questions, setQuestions] = useState([])
  const [textAnswer, setTextAnswer] = useState('')
  const [codeAnswer, setCodeAnswer] = useState(STARTER.javascript)
  const [codeLanguage, setCodeLanguage] = useState('javascript')
  const [feedback, setFeedback] = useState(null)
  const [allData, setAllData] = useState([]) // { question, answer, feedback }
  const [error, setError] = useState(null)
  const answerRef = useRef(null)

  const isCodeType = typeConfig?.hasEditor
  const progress = currentQ / TOTAL_QUESTIONS

  useEffect(() => {
    loadQuestion([])
  }, [])

  async function loadQuestion(prevQuestions) {
    setPhase('loading')
    setQuestion('')
    setFeedback(null)
    setTextAnswer('')
    setError(null)

    try {
      const prompt = buildQuestionPrompt(type, topic, prevQuestions)
      let q = ''
      await ollamaChat(prompt, text => {
        q = text
        setQuestion(text)
      })
      setQuestions(prev => [...prev, q])
      setPhase('answering')
      setTimeout(() => answerRef.current?.focus(), 100)
    } catch (e) {
      setError('Could not load question. Is Ollama running?')
      setPhase('answering')
    }
  }

  async function handleSubmit() {
    const answer = isCodeType ? codeAnswer : textAnswer
    if (!answer.trim()) return

    setPhase('evaluating')
    setFeedback(null)

    try {
      const prompt = buildFeedbackPrompt(type, question, answer)
      const result = await ollamaChatJson(prompt)
      setFeedback(result)
      setPhase('feedback')
      setAllData(prev => [...prev, { question, answer, feedback: result }])
    } catch (e) {
      setFeedback({
        score: 5,
        rating: 'Good',
        strengths: 'Answer received.',
        improvements: 'Could not fully evaluate — try again.',
        tip: 'Make sure Ollama is running and llama3 is loaded.',
      })
      setPhase('feedback')
    }
  }

  async function handleNext() {
    const nextQ = currentQ + 1
    if (nextQ >= TOTAL_QUESTIONS) {
      onFinish(allData)
      return
    }
    setCurrentQ(nextQ)
    setCodeAnswer(STARTER[codeLanguage])
    loadQuestion(questions)
  }

  const canSubmit = isCodeType
    ? codeAnswer.trim() !== STARTER[codeLanguage].trim()
    : textAnswer.trim().length > 20

  const isLast = currentQ === TOTAL_QUESTIONS - 1

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.meta}>
          <span className={styles.typeBadge}>{typeConfig?.label}</span>
          {topic && <span className={styles.topicBadge}>{topic}</span>}
        </div>
        <span className={styles.counter}>{currentQ + 1} / {TOTAL_QUESTIONS}</span>
      </div>

      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${progress * 100}%` }} />
      </div>

      <div className={styles.questionBox}>
        <p className={styles.questionLabel}>Interviewer</p>
        {phase === 'loading' ? (
          <div className={styles.loadingQ}>
            <span className={styles.dot} />
            <span className={styles.dot} style={{ animationDelay: '0.15s' }} />
            <span className={styles.dot} style={{ animationDelay: '0.3s' }} />
          </div>
        ) : (
          <p className={styles.questionText}>{question || error}</p>
        )}
      </div>

      {phase !== 'loading' && (
        <div style={{ animation: 'fadeUp 0.25s ease' }}>
          {isCodeType ? (
            <CodeEditor
              value={codeAnswer}
              onChange={setCodeAnswer}
              language={codeLanguage}
              onLanguageChange={setCodeLanguage}
            />
          ) : (
            <textarea
              ref={answerRef}
              className={styles.textarea}
              placeholder="Type your answer here... Aim for 2–4 sentences minimum."
              value={textAnswer}
              onChange={e => setTextAnswer(e.target.value)}
              disabled={phase !== 'answering'}
            />
          )}

          {phase === 'feedback' && (
            <FeedbackCard feedback={feedback} />
          )}

          {phase === 'evaluating' && (
            <FeedbackCard isStreaming />
          )}

          <div className={styles.btnRow}>
            {(phase === 'answering') && (
              <button
                className={styles.submitBtn}
                onClick={handleSubmit}
                disabled={!canSubmit}
              >
                Submit answer
              </button>
            )}
            {phase === 'evaluating' && (
              <button className={styles.submitBtn} disabled>
                <span className={styles.spinner} /> Evaluating...
              </button>
            )}
            {phase === 'feedback' && (
              <button className={styles.nextBtn} onClick={handleNext}>
                {isLast ? 'See debrief →' : 'Next question →'}
              </button>
            )}
            <button className={styles.quitBtn} onClick={() => onFinish(allData)}>
              {allData.length > 0 ? 'End & see debrief' : 'Quit'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
