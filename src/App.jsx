import { useState } from 'react'
import './App.css'

// Fast, permissive model — works well on free HF Inference API
const MODEL = 'black-forest-labs/FLUX.1-schnell'
const HF_TOKEN = import.meta.env.VITE_HF_TOKEN

const API_URL = `/hf-api/hf-inference/models/${MODEL}`

async function generateImageFromPrompt(prompt, onStatus) {
  if (!HF_TOKEN) {
    await new Promise((r) => setTimeout(r, 2500))
    return `https://picsum.photos/seed/${encodeURIComponent(prompt)}/768/512`
  }

  // Retry up to 5 times if model is still loading (HF returns 503)
  for (let attempt = 1; attempt <= 5; attempt++) {
    onStatus(attempt === 1 ? 'Sending request…' : `Model warming up, retry ${attempt}/5…`)

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
        'X-Wait-For-Model': 'true',   // ask HF to wait instead of 503-ing immediately
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { num_inference_steps: 4 }, // FLUX.1-schnell is optimised for 4 steps
      }),
    })

    // Model loading → wait and retry
    if (response.status === 503) {
      const json = await response.json().catch(() => ({}))
      const waitSec = json.estimated_time ?? 20
      onStatus(`Model loading… waiting ${Math.round(waitSec)}s`)
      await new Promise((r) => setTimeout(r, Math.min(waitSec * 1000, 25000)))
      continue
    }

    if (!response.ok) {
      const text = await response.text().catch(() => '')
      let msg = `API error ${response.status}`
      try { msg = JSON.parse(text).error ?? msg } catch (_) { /* keep msg */ }
      throw new Error(msg)
    }

    const blob = await response.blob()
    if (!blob.type.startsWith('image/')) {
      // Unexpected non-image body — surface raw text for debugging
      const text = await blob.text()
      throw new Error(`Unexpected response: ${text.slice(0, 200)}`)
    }
    return URL.createObjectURL(blob)
  }

  throw new Error('Model took too long to load. Please try again in a moment.')
}

export default function App() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingStatus, setLoadingStatus] = useState('Generating image…')
  const [imageUrl, setImageUrl] = useState(null)
  const [error, setError] = useState(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    setLoadingStatus('Sending request…')
    setError(null)
    setImageUrl(null)

    try {
      const url = await generateImageFromPrompt(prompt.trim(), setLoadingStatus)
      setImageUrl(url)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !loading && prompt.trim()) {
      e.preventDefault()
      handleGenerate()
    }
  }

  return (
    <div className="app-shell">
      {/* Background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <main className="card">
        {/* Header */}
        <header className="card-header">
          <div className="badge">✦ Powered by AI</div>
          <h1 className="title">AI Text to Image Generator</h1>
          <p className="subtitle">
            Transform your imagination into stunning visuals in seconds.
          </p>
        </header>

        {/* Input */}
        <div className="input-group">
          <textarea
            className="prompt-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the image you want to generate…"
            rows={3}
            disabled={loading}
          />
          <div className="input-footer">
            <span className="char-count">{prompt.length} / 500</span>
            <span className="hint">⏎ Enter to generate</span>
          </div>
        </div>

        {/* Button */}
        <button
          className={`generate-btn ${loading ? 'loading' : ''}`}
          onClick={handleGenerate}
          disabled={!prompt.trim() || loading}
        >
          {loading ? (
            <span className="btn-inner">
              <span className="spinner" />
              Generating…
            </span>
          ) : (
            <span className="btn-inner">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              Generate Image
            </span>
          )}
        </button>

        {/* Error */}
        {error && (
          <div className="error-box" role="alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="skeleton-wrap">
            <div className="skeleton" />
            <p className="skeleton-label">{loadingStatus}</p>
          </div>
        )}

        {/* Result */}
        {imageUrl && !loading && (
          <div className="result-wrap">
            <div className="result-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Generated from: <em>"{prompt}"</em>
            </div>
            <div className="image-frame">
              <img src={imageUrl} alt={prompt} className="result-image" />
            </div>
            <div className="result-actions">
              <a href={imageUrl} download="ai-generated.png" className="action-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download
              </a>
              <button
                className="action-btn secondary"
                onClick={() => { setImageUrl(null); setPrompt('') }}
              >
                Start over
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
