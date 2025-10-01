import React, { useState } from 'react'
import { toast } from 'sonner'

const MAX_SOURCES = 5;

export default function WriteWithAI() {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [prompt, setPrompt] = useState('')
  const [sources, setSources] = useState([''])
  const [loading, setLoading] = useState(false)

  const updateSource = (index, value) => {
    const next = [...sources]
    next[index] = value
    setSources(next)
  }

  const addSource = () => {
    if (sources.length >= MAX_SOURCES) return
    setSources(prev => [...prev, ''])
  }

  const removeSource = (index) => {
    setSources(prev => prev.filter((_, i) => i !== index))
  }

  const handleExecute = (e) => {
    e.preventDefault()
    // Placeholder: this page will call backend/AI service asynchronously
    setLoading(true)
    // Simulate async work
    setTimeout(() => {
      setLoading(false)
      toast.info('AI post generation started. You will be notified when ready.')
    }, 800)
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="mb-6 bg-blue-50 border border-blue-100 rounded-md p-4">
        <h2 className="text-lg font-semibold mb-2">Generate a post with AI (asynchronous)</h2>
        <p className="text-sm text-slate-700">This page helps you create a complete blog post using AI. The generation runs asynchronously — after you hit Execute the job will run on the server and you will be notified when the draft is ready.</p>
      </div>

      <form onSubmit={handleExecute} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Post title" className="w-full border rounded p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <input value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Technology, Health" className="w-full border rounded p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Prompt (what you want the AI to write)</label>
          <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Give the AI instructions and tone..." className="w-full border rounded p-2 min-h-[140px]" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Sources (optional) — up to {MAX_SOURCES}</label>
          <div className="space-y-2">
            {sources.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <input value={s} onChange={e => updateSource(i, e.target.value)} placeholder={`Source ${i+1} — url to a public webpage or file`} className="flex-1 border rounded p-2" />
                <button type="button" onClick={() => removeSource(i)} className="text-sm text-red-600 px-2 py-1">Remove</button>
              </div>
            ))}

            <div>
              <button type="button" onClick={addSource} disabled={sources.length >= MAX_SOURCES} className="text-sm text-blue-600 px-2 py-1">Add source</button>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">{loading ? 'Executing…' : 'Execute'}</button>
        </div>
      </form>
    </div>
  )
}
