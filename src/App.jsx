import { useState, useCallback } from 'react'
import './App.css'

const LANGUAGES = [
  { id: 'java',       label: 'Java'       },
  { id: 'cpp',        label: 'C++'        },
  { id: 'python',     label: 'Python'     },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'other',      label: 'other'      },
]

// ── Score Ring ───────────────────────────────────────────────────────────────
function ScoreRing({ rating }) {
  const radius       = 38
  const strokeWidth  = 7
  const circumference = 2 * Math.PI * radius
  const offset       = circumference - (rating / 10) * circumference
  const color        = rating >= 8 ? '#22c55e' : rating >= 5 ? '#f59e0b' : '#ef4444'

  return (
    <div className="score-ring-wrapper">
      <svg width="90" height="90" viewBox="0 0 90 90" className="score-ring-svg">
        <circle cx="45" cy="45" r={radius} fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} />
        <circle
          cx="45" cy="45" r={radius} fill="none"
          stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.9s ease' }}
        />
      </svg>
      <div className="score-ring-content">
        <span className="score-value" style={{ color }}>{rating}</span>
        <span className="score-divider">/10</span>
      </div>
    </div>
  )
}

// ── Copy Button ──────────────────────────────────────────────────────────────
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopy}>
      {copied ? '✓ Copied' : '⎘ Copy'}
    </button>
  )
}

// ── Skeleton Loader ──────────────────────────────────────────────────────────
function SkeletonLoader() {
  const bar = (w = '100%', h = 14) => (
    <div className="skeleton-bar" style={{ width: w, height: h }} />
  )

  return (
    <div className="skeleton-container">
      <div className="skeleton-header">
        <div className="skeleton-ring" />
        <div className="skeleton-lines">
          {bar('55%', 16)}{bar('90%', 13)}{bar('70%', 13)}
        </div>
      </div>
      {bar('40%', 13)}{bar('100%', 48)}{bar('90%', 48)}{bar('75%', 48)}
      {bar('40%', 13)}{bar('100%', 96)}
    </div>
  )
}

// ── App ──────────────────────────────────────────────────────────────────────
function App() {
  const [code,      setCode]      = useState('')
  const [language,  setLanguage]  = useState('java')
  const [isLoading, setIsLoading] = useState(false)
  const [result,    setResult]    = useState(null)
  const [error,     setError]     = useState(null)

  const lineCount = code ? code.split('\n').length : 0

  const handleSubmit = useCallback(async () => {
    if (!code.trim()) {
      setError('Please paste some code before submitting.')
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, code }),
      })

      if (!response.ok) {
        throw new Error('Server error. Please ensure your Java and Python servers are running.')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError('Network Error: ' + err.message)
    } finally {
      setIsLoading(false)
    }
  }, [code, language])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const el    = e.target
      const start = el.selectionStart
      const end   = el.selectionEnd
      const next  = code.substring(0, start) + '  ' + code.substring(end)
      setCode(next)
      requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = start + 2 })
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit()
    }
  }, [code, handleSubmit])

  return (
    <div className="app-container">
      {/* ── Header ── */}
      <div className="header-container">
        <div className="header-content">
          <div>
            <div className="header-title-row">
              <span className="header-icon">🔍</span>
              <h1 className="header-title">CodeCritic</h1>
              <span className="ai-badge">AI</span>
            </div>
            <p className="header-subtitle">Paste your code and get instant AI feedback</p>
          </div>

          <div className="shortcut-hint">
            <kbd className="shortcut-key">Ctrl</kbd>
            <span>+</span>
            <kbd className="shortcut-key">↵</kbd>
            <span style={{ marginLeft: 2 }}>to review</span>
          </div>
        </div>
      </div>

      {/* ── Two-column grid ── */}
      <div className="main-grid">
        
        {/* ── Left: Input Panel ── */}
        <div className="panel">
          <div>
            <p className="section-label">Language</p>
            <div className="lang-row">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.id}
                  onClick={() => setLanguage(lang.id)}
                  className={`lang-btn ${language === lang.id ? 'active' : ''}`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div className="textarea-header">
              <p className="section-label">Your Code</p>
              {lineCount > 0 && (
                <span className="line-count">
                  {lineCount} line{lineCount !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`// Paste your ${language} code here...\n// Tab inserts spaces · Ctrl+Enter to review`}
              className="code-textarea"
            />
          </div>

          <button onClick={handleSubmit} disabled={isLoading} className="submit-btn">
            <span className={isLoading ? 'spin-icon' : ''} style={{ display: 'inline-block' }}>
              {isLoading ? '⟳' : '⚡'}
            </span>
            {isLoading ? 'Analyzing...' : 'Review Code'}
          </button>
        </div>

        {/* ── Right: Results Panel ── */}
        <div className="panel results-panel">
          
          {error && (
            <div className="error-state">
              <span style={{ flexShrink: 0 }}>⚠️</span>
              {error}
            </div>
          )}

          {!result && !error && !isLoading && (
            <div className="empty-state">
              <span className="empty-icon">📋</span>
              <p className="empty-title">No review yet</p>
              <p className="empty-desc">
                Paste your code on the left,<br />
                then click <strong>Review Code</strong>
              </p>
            </div>
          )}

          {isLoading && <SkeletonLoader />}

          {result && (
            <div className="fadein" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              
              <div className="score-summary">
                <ScoreRing rating={result.rating} />
                <div>
                  <p className="section-label">Quality Score</p>
                  {result.summary && (
                    <p className="summary-text">{result.summary}</p>
                  )}
                </div>
              </div>

              <div>
                <p className="section-label">Identified Issues</p>
                <div className="issues-container">
                  {result.issues.map((issue, index) => (
                    <div key={index} className="issue-item">
                      <span className="issue-icon">⚠</span>
                      {issue}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="fix-header">
                  <p className="section-label">Suggested Fix</p>
                  <CopyButton text={result.fix} />
                </div>
                <pre className="fix-pre">
                  <code>{result.fix}</code>
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App