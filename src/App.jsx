import { useState } from 'react'
import OllamaStatus from './components/OllamaStatus'
import SetupScreen from './components/SetupScreen'
import InterviewScreen from './components/InterviewScreen'
import DebriefScreen from './components/DebriefScreen'

export default function App() {
  const [screen, setScreen] = useState('setup') // setup | interview | debrief
  const [interviewConfig, setInterviewConfig] = useState(null)
  const [sessionData, setSessionData] = useState([])
  const [ollamaReady, setOllamaReady] = useState(false)

  function handleStart(config) {
    setInterviewConfig(config)
    setSessionData([])
    setScreen('interview')
  }

  function handleFinish(data) {
    setSessionData(data)
    setScreen('debrief')
  }

  function handleRestart() {
    setScreen('setup')
    setInterviewConfig(null)
    setSessionData([])
  }

  return (
    <>
      <OllamaStatus onReady={() => setOllamaReady(true)} />

      {screen === 'setup' && (
        <SetupScreen onStart={handleStart} />
      )}

      {screen === 'interview' && interviewConfig && (
        <InterviewScreen
          config={interviewConfig}
          onFinish={handleFinish}
        />
      )}

      {screen === 'debrief' && (
        <DebriefScreen
          data={sessionData}
          config={interviewConfig}
          onRestart={handleRestart}
        />
      )}
    </>
  )
}
