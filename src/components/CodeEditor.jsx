import Editor from '@monaco-editor/react'
import styles from './CodeEditor.module.css'

const LANGUAGE_OPTIONS = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
]

const STARTER = {
  javascript: `// Write your solution here\nfunction solution() {\n  \n}\n`,
  python: `# Write your solution here\ndef solution():\n    pass\n`,
  typescript: `// Write your solution here\nfunction solution(): void {\n  \n}\n`,
  java: `// Write your solution here\npublic class Solution {\n    public void solve() {\n        \n    }\n}\n`,
  cpp: `// Write your solution here\n#include <iostream>\nusing namespace std;\n\nvoid solution() {\n    \n}\n`,
}

export default function CodeEditor({ value, onChange, language, onLanguageChange }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <span className={styles.toolbarLabel}>Code</span>
        <div className={styles.dots}>
          <span className={styles.dot} style={{ background: '#ff5f57' }} />
          <span className={styles.dot} style={{ background: '#febc2e' }} />
          <span className={styles.dot} style={{ background: '#28c840' }} />
        </div>
        <select
          className={styles.langSelect}
          value={language}
          onChange={e => {
            onLanguageChange(e.target.value)
            if (!value || value === STARTER[language]) {
              onChange(STARTER[e.target.value])
            }
          }}
        >
          {LANGUAGE_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
      <Editor
        height="280px"
        language={language}
        value={value}
        onChange={val => onChange(val || '')}
        theme="vs-dark"
        options={{
          fontSize: 13,
          fontFamily: "'DM Mono', monospace",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbers: 'on',
          renderLineHighlight: 'line',
          padding: { top: 16, bottom: 16 },
          scrollbar: { verticalScrollbarSize: 4 },
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          renderWhitespace: 'none',
          contextmenu: false,
          wordWrap: 'on',
        }}
      />
    </div>
  )
}

export { STARTER }
